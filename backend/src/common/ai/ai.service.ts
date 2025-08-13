import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import * as FormData from 'form-data';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AIService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async sendCowNNIToMuzzleModel(cowNNI: string) {
    const modelDomain = this.configService.get<string>('MUZZLE_MODEL_DOMAIN');
    if (!modelDomain) {
      throw new BadRequestException(
        "Couldn't send cow NNI to AI model — missing model domain",
      );
    }

    try {
      const formData = new FormData();
      formData.append('cow_id', cowNNI);

      const response = await firstValueFrom(
        this.httpService.post(modelDomain, formData, {
          headers: formData.getHeaders(),
        }),
      );

      if (response.status !== 200) {
        throw new BadRequestException(
          "Couldn't send cow NNI to AI model — model returned non-200",
        );
      }
    } catch (error) {
      console.error(
        'Error sending cow NNI to AI model:',
        error?.response?.data || error,
      );
      throw new BadRequestException(
        "Couldn't send cow NNI to AI model — request failed",
      );
    }
  }
}
