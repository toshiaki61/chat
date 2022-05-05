import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { JsonLoggerService, RequestLogger } from 'json-logger-service';

import { Env } from '@chat-ex/shared/data';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new JsonLoggerService('NestServer'),
  });
  app.use(RequestLogger.buildExpressRequestLogger());
  const config = app.get<ConfigService<Env>>(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = config.get('ADMIN_PORT') || 3333;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      url: config.get('ADMIN_REDIS_URI') ?? 'redis://localhost:6379',
    },
  });

  await app
    .startAllMicroservices()
    .catch((err) => Logger.error('failed to start services', err));
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
