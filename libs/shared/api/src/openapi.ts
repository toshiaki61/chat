import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { JsonLoggerService } from 'json-logger-service';

import { ChatApiModule } from './api';

async function bootstrap() {
  const app = await NestFactory.create(ChatApiModule, {
    logger: new JsonLoggerService('NestSwagger'),
  });

  const options = new DocumentBuilder()
    .setTitle('Chats')
    .setDescription('The chats API description')
    .setVersion('1.0')
    .addTag('chats')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const outputPath = resolve(
    process.cwd(),
    'libs/shared/api',
    'chat-openapi.json'
  );
  writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8' });

  await app.close();
}
bootstrap();
