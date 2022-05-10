import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerFactory } from 'json-logger-service';
import * as mongoose from 'mongoose';

import { Env } from '@chat-ex/shared/data';
import { ExceptionsLoggingFilter } from '@chat-ex/shared/filters';
import { Message, MessageSchema } from '@chat-ex/shared/schema';
import { exponentialJitterBackoff } from '@chat-ex/shared/utils';

import { AppController } from './app.controller';
import { AppService } from './app.service';

const logger = LoggerFactory.createLogger('Mongoose');
mongoose.set('debug', (collectionName, method, ...args) => {
  logger.debug(`${collectionName}.${method}:${JSON.stringify(args)}`);
});
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService<Env>) => ({
        readyLog: true,
        config: {
          url: config.get('REDIS_URI'),
          enableOfflineQueue: true,
          enableReadyCheck: true,
          scaleReads: 'all',
          retryStrategy: (times) => exponentialJitterBackoff(times),
          reconnectOnError: () => true,
        },
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService<Env>) => ({
        uri: config.get('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.on('connected', () =>
            logger.debug(`Mongoose connected to ${connection.name}`)
          );
          connection.on('disconnected', () =>
            logger.debug(`Mongoose disconnected from ${connection.name}`)
          );
          connection.on('error', (error) =>
            logger.error(`Mongoose error on ${connection.name}`, error)
          );
          return connection;
        },
      }),
    }),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),

    // MessageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggingFilter,
    },
    AppService,
  ],
  controllers: [AppController],
})
export class AppModule {}
