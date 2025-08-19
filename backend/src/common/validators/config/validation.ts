// config/validation.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // App
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // Database
  MONGO_URI: Joi.string().uri().required(),

  // JWT
  JWT_SECRET: Joi.string().min(10).required(),
  JWT_EXPIRATION: Joi.string().default('1d'),

  // Mailer (production)
  MAILERSEND_HOST: Joi.string().hostname().required(),
  MAILERSEND_PORT: Joi.number().default(587),
  MAILERSEND_USERNAME: Joi.string().required(),
  MAILERSEND_PWD: Joi.string().required(),

  // Mailer (development)
  EMAIL_HOST: Joi.string().hostname().required(),
  EMAIL_PORT: Joi.number().default(2525),
  EMAIL_USERNAME: Joi.string().required(),
  EMAIL_PWD: Joi.string().required(),

  // Sender
  EMAIL_FROM: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  // Frontend
  FRONT_URL: Joi.string().uri().required(),

  // S3 / MinIO
  S3_ENDPOINT: Joi.string().uri().required(),
  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().required(),
  S3_BUCKET: Joi.string().required(),
  S3_PUBLIC_URL: Joi.string().uri().required(),
  AWS_REGION: Joi.string().required(),

  // Muzzle Model
  MUZZLE_MODEL_DOMAIN: Joi.string().uri().required(),
});
