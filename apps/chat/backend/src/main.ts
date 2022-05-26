import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JsonLoggerService, RequestLogger } from 'json-logger-service';

import { Env } from '@chat-ex/shared/data';

import { AppModule } from './app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new JsonLoggerService('Nest'),
  });
  app.use(RequestLogger.buildExpressRequestLogger());
  const config = app.get<ConfigService<Env>>(ConfigService);

  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector),{

  //   excludePrefixes: ['socket'] }));
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  if (config.get('SWAGGER_ENABLED')) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API ')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = config.get('PORT') || 4444;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      url: config.get('REDIS_URI') ?? 'redis://localhost:6379',
    },
  });

  await app
    .startAllMicroservices()
    .catch((err) => Logger.error('failed to start services', err));
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
