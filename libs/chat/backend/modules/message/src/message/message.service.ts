import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import { ChatReceivedEvent } from '@chat-ex/shared/events';
import { Message, MessageDocument } from '@chat-ex/shared/schema';

import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  #logger = new Logger(MessageService.name);
  #topicKey = 'chat_received';
  constructor(
    @Inject('CHAT_SERVICE') private client: ClientProxy,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  create(account: string, createMessageDto: CreateMessageDto) {
    const created = new this.messageModel({
      account,
      ...createMessageDto,
    });
    return created.save();
  }

  async findAll(
    account: string,
    documentsToSkip = 0,
    limitOfDocuments?: number,
    startId?: string
  ) {
    const filter: FilterQuery<MessageDocument> = {
      $and: [{ account }],
    };

    if (startId) {
      filter['$and']?.push({ _id: { $gt: startId } });
    }
    const findQuery = this.messageModel
      .find(filter)
      .sort({ _id: 1 })
      .skip(documentsToSkip);

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }

    const results = await findQuery.lean();
    const count = await this.messageModel.countDocuments(filter);

    return { results, count };
  }

  findOne(id: string) {
    return this.messageModel.findById(id).lean();
  }

  async send(account: string, channel: string, dto: CreateMessageDto) {
    const data = await this.create(account, dto);
    this.#logger.debug('send', data);
    return this.client.emit(
      `${this.#topicKey}:${account}:${channel}`,
      new ChatReceivedEvent(data.id, account, [data])
    );
  }
}
