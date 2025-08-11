import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  
  );
  app.enableCors({
    origin: '*',
    credentials: true,
  });
 
  // app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'developement') {
    app.use(morgan('dev'));
  }
}
bootstrap();

