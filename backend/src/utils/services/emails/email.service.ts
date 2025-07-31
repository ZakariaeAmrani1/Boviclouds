// src/email/email.service.ts

import { Injectable, Inject, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { convert } from 'html-to-text';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs/promises'; 
import { User } from 'src/users/schemas/users/user.schema';

// EmailUser is just an alias/extension of User
export class EmailUser extends User {}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    // Inject the nodemailer transporter
    @Inject('MAILER_TRANSPORTER')
    private readonly mailerTransporter: Transporter,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generic method to send an email.
   * @param to - The recipient's email address.
   * @param subject - The email subject.
   * @param templateName - The name of the HTML template file (without .html).
   * @param context - The data to pass to the template for replacement.
   */
  private async send(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, string>,
  ) {
    try {
      // 1. Read the HTML template file
      const baseDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

      const templatePath = path.join(
        process.cwd(),
        baseDir,
        'utils',
        'services',
        'emails',
        'templates',
        `${templateName}.html`,
      );
      let html = await fs.readFile(templatePath, 'utf8');

      // 2. Replace placeholders in the HTML
      for (const key in context) {
        if (context.hasOwnProperty(key)) {
          // Use a simple regex to replace all occurrences of {{key}}
          html = html.replace(
            new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
            context[key],
          );
        }
      }

      // 3. Define email options
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_FROM'),
        to,
        subject,
        html,
        text: convert(html),
      };

      // 4. Send the email
      const info = await this.mailerTransporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${to}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to} using template ${templateName}:`,
        error.stack,
      );
      // throw new InternalServerErrorException('Failed to send email');
    }
  }

  /**
   * Sends a welcome email to a new user.
   * @param user - The user object.
   * @param url - The confirmation or login URL.
   */
  async sendWelcome(user: EmailUser, url: string) {
    const displayFirstName =
      `${user.prenom_lat || ''} ${user.prenom_ar ? `(${user.prenom_ar})` : ''}`.trim();

    await this.send(user.email, 'Welcome to boviclouds family!', 'welcome', {
      firstName: displayFirstName,
      url: url,
    });
  }

  /**
   * Sends an account validation email.
   * @param user - The user object.
   * @param validationUrl - The account validation URL.
   */
  async sendAccountValidation(user: EmailUser, validationUrl: string) {
    const displayFirstName =
      `${user.prenom_lat || ''} ${user.prenom_ar ? `(${user.prenom_ar})` : ''}`.trim();

    await this.send(
      user.email,
      'Please Validate Your Account',
      'accountValidation',
      {
        firstName: displayFirstName,
        validationUrl: validationUrl,
      },
    );
  }

  /**
   * Sends a password reset email.
   * @param user - The user object.
   * @param resetUrl - The password reset URL.
   */
  async sendPasswordReset(user: EmailUser, resetUrl: string) {
    const displayFirstName =
      `${user.prenom_lat || ''} ${user.prenom_ar ? `(${user.prenom_ar})` : ''}`.trim();

    await this.send(
      user.email,
      'Your password reset token (valid for 10 mins)',
      'resetPassword',
      {
        firstName: displayFirstName,
        url: resetUrl,
      },
    );
  }
  async sendEmailVerification(user: EmailUser, resetUrl: string) {
    const displayFirstName =
      `${user.prenom_lat || ''} ${user.prenom_ar ? `(${user.prenom_ar})` : ''}`.trim();

    await this.send(
      user.email,
      'This email verification token (valid for 10 mins)',
      'emailConfirmation',
      {
        firstName: displayFirstName,
        url: resetUrl,
      },
    );
  }
  async sendAccountCreationEmail(user: EmailUser, password: string, link: string) {
    const displayFirstName =
      `${user.prenom_lat || ''} ${user.prenom_ar ? `(${user.prenom_ar})` : ''}`.trim();

    await this.send(
      user.email,
      'Your account has been created successfully',
      'accountCreation',
      {
        firstName: displayFirstName,
        url: link,
        password: password,
        email: user.email,
      },
    );
  }
}
