import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { JsonLoggerService, RequestLogger } from 'json-logger-service';

import { Env } from '@chat-ex/shared/data';

import { AppModule } from './app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new JsonLoggerService('NestServer'),
  });
  app.use(RequestLogger.buildExpressRequestLogger());
  const config = app.get<ConfigService<Env>>(ConfigService);

  const globalPrefix = 'chat';
  app.setGlobalPrefix(globalPrefix);

  const port = config.get('SERVICES_CHAT_PORT') || 33333;

  // await app
  //   .startAllMicroservices()
  //   .catch((err) => Logger.error('failed to start services', err));
  await app.listen(port).catch((err) => Logger.error('failed to listen', err));
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
