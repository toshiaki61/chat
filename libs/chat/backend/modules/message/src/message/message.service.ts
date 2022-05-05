import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, LeanDocument, FilterQuery, FlattenMaps } from 'mongoose';
import { Subject } from 'rxjs';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatReceivedEvent } from './events/chat-received.event';
import {
  Message,
  MessageDocument,
  JsonMessage,
  LeanMessage,
} from './schema/message.schema';

@Injectable()
export class MessageService {
  #logger = new Logger(MessageService.name);
  constructor(
    @Inject('CHAT_SERVICE') private client: ClientProxy,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  create(account: string, createMessageDto: CreateMessageDto) {
    const created = new this.messageModel({ account, ...createMessageDto });
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

  async send(account: string, dto: CreateMessageDto) {
    const data = await this.create(account, dto);
    this.#logger.debug('send', data);
    this.client.emit(
      'chat_received',
      new ChatReceivedEvent(data.id, account, [data])
    );
  }

  async emit(account: string, data: LeanMessage[]) {
    const last = data[data.length - 1];
    this.client.emit(
      'chat_received',
      new ChatReceivedEvent(last.id, account, data)
    );
  }

  // stream(key: string, lastEventId?: string) {
  //   const subject = this.#map.get(key);
  //   if (!subject) {
  //     console.log('stream', key);
  //     const subject = new Subject<any>();

  //     subject.subscribe({
  //       complete: () => {
  //         this.#map.delete(key);
  //       },
  //     });
  //     this.#map.set(key, subject);
  //     return subject;
  //   }
  //   return subject;
  // }
}
