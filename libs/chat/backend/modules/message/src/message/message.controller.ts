import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Sse,
  MessageEvent,
  Query,
  Headers,
  Inject,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { LoggerFactory } from 'json-logger-service';
import { Observable, Subject } from 'rxjs';

import { CreateMessageDto } from './dto/create-message.dto';
import { ChatReceivedEvent } from './events/chat-received.event';
import { MessageService } from './message.service';
import { PaginationParams } from './pagination-params';

@Controller('message')
export class MessageController {
  #logger = LoggerFactory.createLogger(MessageController.name);
  constructor(
    private readonly messageService: MessageService,
    @Inject('SUBJECT_MAP')
    private readonly map: Map<string, Subject<MessageEvent>>
  ) {}

  @Post()
  create(account = 'test', @Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(account, createMessageDto);
  }

  @Get()
  findAll(account = 'test', @Query() { skip, limit }: PaginationParams) {
    return this.messageService.findAll(account, skip, limit);
  }

  @Post(':channel')
  send(account = 'test', @Body() dto: CreateMessageDto) {
    return this.messageService.send(account, dto);
  }

  @Sse(':channel')
  subscribe(
    account = 'test',
    @Headers('last-event-id') lastEventId: string | undefined,
    @Param('channel') channel: string
  ): Observable<MessageEvent> {
    this.#logger.debug(
      `lastEventId: ${lastEventId}, channel: ${channel}, account: ${account}`
    );
    const key = `${account}:${channel}`;
    let subject = this.map.get(key);
    if (!subject) {
      subject = new Subject();
      this.map.set(key, subject);
    }
    if (lastEventId) {
      this.messageService
        .findAll(account, 0, undefined, lastEventId)
        .then((result) => this.messageService.emit(account, result.results));
    }
    return subject.asObservable();
  }

  @EventPattern('chat_received')
  getNotifications(
    @Payload() data: ChatReceivedEvent,
    @Ctx() context: RedisContext
  ) {
    this.#logger.debug(
      data,
      `Channel: ${context.getChannel()}, ${context.getArgs()}`
    );
    const message: MessageEvent = {
      id: data.id,
      data,
    };
    this.map.get('test:test')?.next(message);
  }
}
