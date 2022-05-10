import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

import { Message, MessageSchema } from '@chat-ex/shared/schema';

import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'CHAT_SERVICE',
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            url: config.get('REDIS_URI'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
