import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import * as FormData from 'form-data';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AIService{
    constructor(
        private readonly httpService:HttpService,
        private readonly configService:ConfigService
    ){}

    async sendCowNNIToMuzzleModel(cowNNI:string){
        try {
            const formData = new FormData();
            formData.append('cow_id', cowNNI);
            const headers = formData.getHeaders();
            const modelDomain = this.configService.get<string>('MUZZLE_MODEL_DOMAIN');
            if(modelDomain){
                const observale = this.httpService.post(modelDomain,
                formData,
                {
                    headers,
                },
                );
                const response = await firstValueFrom(observale);
                if (response.status !== 200) throw new BadRequestException(
                  "Couldn't send cow nni to ai model",
                );
            }
            throw new BadRequestException(
                "Couldn't send cow nni to ai model",
            );
        } catch (error) {
            console.log(error.response);
        }
    }

}