import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIService {
  private readonly modelDomain: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.modelDomain = this.configService.get<string>('MUZZLE_MODEL_HOST') as string;
  }

  private async sendToModel(
    endpoint: string,
    formFields: Record<string, any>,
  ): Promise<any> {
    if (!this.modelDomain) {
      throw new BadRequestException(
        "Couldn't send data to AI model — missing model domain",
      );
    }

    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(formFields)) {
        formData.append(key, value);
      }

      const response = await firstValueFrom(
        this.httpService.post(`${this.modelDomain}${endpoint}`, formData, {
          headers: formData.getHeaders(),
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              progressEvent.total
                ? (progressEvent.loaded * 100) / progressEvent.total
                : 0,
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
        }),
      );

      if (response.status !== 200) {
        throw new BadRequestException(
          `Couldn't send data to AI model — model returned status ${response.status}`,
        );
      }

      return response.data;
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
