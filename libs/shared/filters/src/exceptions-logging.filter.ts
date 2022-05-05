import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LoggerFactory } from 'json-logger-service';

@Catch()
export class ExceptionsLoggingFilter extends BaseExceptionFilter {
  #logger = LoggerFactory.createLogger(ExceptionsLoggingFilter.name);
  override catch(exception: unknown, host: ArgumentsHost) {
    this.#logger.error(exception, 'Exception thrown');
    super.catch(exception, host);
  }
}
