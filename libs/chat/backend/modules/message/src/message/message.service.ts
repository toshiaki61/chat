import { RedisService } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable, Logger, MessageEvent } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { concatWith, from, map, Observable } from 'rxjs';

import { CreateMessageDto } from './dto/create-message.dto';
import { ChatReceivedEvent } from './events/chat-received.event';
import { Message, MessageDocument } from './schema/message.schema';

@Injectable()
export class MessageService {
  #logger = new Logger(MessageService.name);
  #topicKey = 'chat_received';
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly pubsub: RedisService
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

  send(account: string, channel: string, dto: CreateMessageDto) {
    return this.create(account, dto).then((message) => {
      const data = [message.toJSON()];
      this.#logger.debug('send', data);
      const topic = `${this.#topicKey}:${account}:${channel}`;
      const event = JSON.stringify(
        new ChatReceivedEvent(message.id, account, data)
      );
      return this.pubsub.getClient().publish(topic, event);
    });
  }

  stream(
    account: string,
    channel: string,
    lastEventId?: string
  ): Observable<MessageEvent> {
    this.#logger.debug(
      `lastEventId: ${lastEventId}, channel: ${channel}, account: ${account}`
    );
    const topic = `${this.#topicKey}:${account}:${channel}`;
    const sub$ = new Observable<MessageEvent>((observer) => {
      const client = this.pubsub.getClient();
      client.subscribe(topic, (err, numberOfChannels) => {
        if (err) {
          observer.error(err);
          return;
        }
        this.#logger.debug(
          `subscribed to ${topic}, numberOfChannels: ${numberOfChannels}`
        );
      });
      const messageHandler = (channel: string, message: string) => {
        if (channel === topic) {
          this.#logger.debug(`received message: ${message}`);
          try {
            const data = JSON.parse(message);
            observer.next(data);
          } catch (e) {
            observer.error(e);
          }
        }
      };
      client.on('message', messageHandler);

      return () => {
        client.off('message', messageHandler);
        client.unsubscribe(topic);
      };
    });

    if (lastEventId) {
      return from(this.findAll(account, 0, undefined, lastEventId)).pipe(
        map(
          ({ results }) =>
            new ChatReceivedEvent(
              results[results.length - 1].id,
              account,
              results
            )
        ),
        concatWith(sub$)
      );
    }
    return sub$;

    // return combineLatest(subject,   interval(1000));

    // );
    // return interval(100).pipe(
    //   bufferTime(1000),
    //   map((ids) => ({
    //     id: ids[ids.length - 1] + '',
    //     // type: 'message',
    //     data: new ChatReceivedEvent(
    //       ids[ids.length - 1] + '',
    //       'test',
    //       ids.map((id) => ({
    //         id: id + '',
    //         _id: id + '',
    //         account: 'test',
    //         type: 'system',
    //         message: `message-${id}`,
    //         from: '',
    //         to: '',
    //       }))
    //     ),
    //   }))
    // );

    // return subject.asObservable();
  }
}
