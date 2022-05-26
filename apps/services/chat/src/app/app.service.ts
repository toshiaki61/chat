import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, MessageEvent } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { concatWith, from, map, Observable } from 'rxjs';

import { ChatReceivedEvent } from '@chat-ex/shared/events';
import { InjectLogger, LoggerService } from '@chat-ex/shared/logger';
import { Message, MessageDocument } from '@chat-ex/shared/schema';

@Injectable()
export class AppService {
  #topicKey = 'chat_received';
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly pubsub: RedisService,
    @InjectLogger(AppService.name) private readonly logger: LoggerService
  ) {}

  async findAll(account: string, startId?: string) {
    const filter: FilterQuery<MessageDocument> = {
      $and: [{ account }],
    };

    if (startId) {
      filter['$and']?.push({ _id: { $gt: startId } });
    }
    const findQuery = this.messageModel.find(filter);

    return findQuery.lean();
  }

  stream(
    account: string,
    channel: string,
    lastEventId?: string
  ): Observable<MessageEvent> {
    this.logger.debug(
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
        this.logger.debug(
          `subscribed to ${topic}, numberOfChannels: ${numberOfChannels}`
        );
      });
      const messageHandler = (channel: string, message: string) => {
        if (channel === topic) {
          this.logger.debug(`received message: ${message}`);
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

    if (lastEventId && /^[\d]+$/.test(lastEventId)) {
      return from(this.findAll(account, lastEventId)).pipe(
        map(
          (results) =>
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
  }
}
