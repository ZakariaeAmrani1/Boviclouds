import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 9001);
  if (process.env.ENVIRENEMMENT=="developpement"){
    app.use(morgan)
  }
}
bootstrap();



