import {
  Injectable,
  Scope,
  LoggerService as LoggerServiceInterface,
  Request,
} from '@nestjs/common';
import { LoggerFactory, JsonLogger } from 'json-logger-service';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService implements LoggerServiceInterface {
  #logger: JsonLogger;

  constructor(private namespace: string, private request: Request) {
    this.#logger = LoggerFactory.createLogger(this.namespace, {
      buildCustomContext: () => {
        return {
          account: this.request.headers.get('X-Account-Id'),
          requestId: this.request.headers.get('X-Request-Id'),
        };
      },
    });
  }

  log(message: string, context?: unknown) {
    return this.#logger.info(context, message);
  }

  error(message: string, trace?: string, context?: unknown) {
    return this.#logger.error(context, trace, message);
  }

  warn(message: string, context?: unknown) {
    return this.#logger.warn(context, message);
  }

  debug(message: string, context?: unknown) {
    return this.#logger.debug(context, message);
  }

  verbose(message: string, context?: unknown) {
    return this.#logger.trace(context, message);
  }
}
