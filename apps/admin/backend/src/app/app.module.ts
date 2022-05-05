import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerFactory } from 'json-logger-service';
import * as mongoose from 'mongoose';

import { Env } from '@chat-ex/shared/data';
import { ExceptionsLoggingFilter } from '@chat-ex/shared/filters';

const logger = LoggerFactory.createLogger('Mongoose');
mongoose.set('debug', (collectionName, method, ...args) => {
  logger.debug(`${collectionName}.${method}:${JSON.stringify(args)}`);
});
@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService<Env>) => ({
        uri: config.get('ADMIN_MONGODB_URI'),
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
      inject: [ConfigService],
    }),

    // ChatModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggingFilter,
    },
  ],
})
export class AppModule {}
