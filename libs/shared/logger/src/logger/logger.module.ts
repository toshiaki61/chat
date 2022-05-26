import { DynamicModule, Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { loggerNamespaces } from './inject-logger.decorator';
import { LoggerService } from './logger.service';

export class LoggerModule {
  static forRootAsync(): DynamicModule {
    const providers: Provider[] = [...this.createLoggerProviders()];

    return {
      module: LoggerModule,
      global: true,
      providers: [LoggerService, ...providers],
      exports: providers,
    };
  }

  private static createLoggerProviders(): Provider[] {
    const providers: Provider[] = [];

    for (const [logNamespace, injectionToken] of Array.from(loggerNamespaces)) {
      providers.push({
        scope: Scope.REQUEST,
        provide: injectionToken,
        useFactory: (request: Request) => {
          return new LoggerService(logNamespace, request);
        },
        inject: [REQUEST],
      });
    }

    return providers;
  }
}
