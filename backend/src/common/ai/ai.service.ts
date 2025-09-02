import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIService {
  private readonly modelDomain: string;
  private readonly modelDomain1: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.modelDomain = this.configService.get<string>(
      'MUZZLE_MODEL_DOMAIN',
    ) as string;
    this.modelDomain1 = this.configService.get<string>(
      'MUZZLE_MODEL_DOMAIN1',
    ) as string;
  }

  private async sendToModel(
    endpoint: string,
    formFields: Record<string, any>,
  ): Promise<any> {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(formFields)) {
        if (value && (value as Express.Multer.File).buffer) {
          const file = value as Express.Multer.File;
          formData.append(key, file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
          });
        } else {
          formData.append(key, value);
        }
      }
      if (endpoint === '/get-morph') {
        const response = await firstValueFrom(
          this.httpService.post(`${this.modelDomain1}${endpoint}`, formData, {
            headers: formData.getHeaders(),
          }),
        );
        if (response.status !== 200) {
          throw new BadRequestException(
            `Couldn't send data to AI model — model returned status ${response.status}`,
          );
        }
        return response.data;
      } else {
        const response = await firstValueFrom(
          this.httpService.post(`${this.modelDomain}${endpoint}`, formData, {
            headers: formData.getHeaders(),
          }),
        );
        if (response.status !== 200) {
          throw new BadRequestException(
            `Couldn't send data to AI model — model returned status ${response.status}`,
          );
        }
        return response.data;
      }
    } catch (error) {
      console.error(
        `Error sending data to AI model (${endpoint}):`,
        error?.response?.data || error,
      );
      throw new BadRequestException(
        `Couldn't send data to AI model — request to ${endpoint} failed`,
      );
    }
  }

  async sendCowNNIToMuzzleModel(cowNNI: string) {
    return await this.sendToModel('/add-cow', { cow_id: cowNNI });
  }

  async predictCow(image: Express.Multer.File) {
    return await this.sendToModel('/predict', { image });
  }

  async getCowMorphology(image: Express.Multer.File) {
    return await this.sendToModel('/get-morph', { image });
  }
}
