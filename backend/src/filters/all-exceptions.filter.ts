import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import mongoose from 'mongoose';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';

    // --- MongoDB Native Error ---
    if (exception instanceof MongoError) {
      switch (exception.code) {
        case 11000:
          status = HttpStatus.CONFLICT;
          message = 'A record with the provided information already exists.';
          break;
        default:
          message = 'A database error occurred.';
      }

      // --- Mongoose CastError ---
    } else if (exception instanceof mongoose.Error.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid value '${exception.value}' for field '${exception.path}'`;

      // --- Mongoose ValidationError ---
    } else if (exception instanceof mongoose.Error.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = Object.values(exception.errors)
        .map((err) => err.message)
        .join(', ');

      // --- NestJS HttpException ---
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : (errorResponse as any).message || message;

      // --- General JS Error ---
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // --- Final Response Payload ---
    const responsePayload: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    // Include path/value if available (e.g. CastError)
    if (
      exception instanceof mongoose.Error.CastError ||
      ('path' in (exception as any) && 'value' in (exception as any))
    ) {
      responsePayload.errorField = (exception as any).path;
      responsePayload.invalidValue = (exception as any).value;
    }

    // Include stack trace only in non-production environments
    const isProd = process.env.NODE_ENV === 'production';

    if (!isProd && exception instanceof Error) {
      responsePayload.error = exception.name;
      responsePayload.stack = exception.stack;
    }

    if (isProd) {
      console.error(exception);
    }

    response.status(status).json(responsePayload);
  }
}
