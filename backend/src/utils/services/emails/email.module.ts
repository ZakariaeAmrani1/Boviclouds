
// src/email/email.module.ts

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { EmailService } from './email.service';

@Module({
  providers: [
    EmailService,
    // Define the factory provider for the mailer transporter
    {
      provide: 'MAILER_TRANSPORTER',
      useFactory: (configService: ConfigService) => {
        // Production transport configuration
        if (configService.get<string>('NODE_ENV') === 'production') {
          return createTransport({
            host: configService.get<string>('MAILERSEND_HOST'),
            port: configService.get<number>('MAILERSEND_PORT'),
            auth: {
              user: configService.get<string>('MAILERSEND_USERNAME'),
              pass: configService.get<string>('MAILERSEND_PWD'),
            },
          });
        }
        
        // Development transport configuration (e.g., Mailtrap)
        return createTransport({
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PWD'),
          },
        });
      },
      inject: [ConfigService], 
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}