import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class TransformResponseInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();

      const responseMessage = this.reflector.get<string>(
        'responseMessage',
        context.getHandler(),
      ) || 'Operation completed successfully';
  

      return next.handle().pipe(
        map((data) => ({
          success: true,
          status: response.statusCode,
          message: responseMessage,
          data: data || null,
        })),
      );
    }
  }