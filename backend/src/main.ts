import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  await app.listen(process.env.PORT ?? 3000);
  if (process.env.ENV === "developpement"){
    app.use(morgan('dev'))
  }
}
bootstrap();



