import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;

        // Handle class-validator errors array from ValidationPipe
        if (Array.isArray(responseObj.message)) {
          message = 'Validation failed';
          errors = responseObj.message.map((msg: unknown) => String(msg));
        } else if (typeof responseObj.message === 'string') {
          message = responseObj.message;
        } else if (responseObj.error && typeof responseObj.error === 'string') {
          message = responseObj.error;
        } else {
          message = exception.message;
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    }

    const errorResponse: ApiResponse<null> = {
      success: false,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
      ...(errors && { errors }),
    };

    response.status(status).json(errorResponse);
  }
}