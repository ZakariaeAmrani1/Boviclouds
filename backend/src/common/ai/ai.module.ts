import { Module } from "@nestjs/common";
import { AIService } from "./ai.service";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule,
    ConfigModule, 
  ],
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}