import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { LoggerFactory } from 'json-logger-service';

import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { PaginationParams } from './pagination-params';

@Controller('message')
export class MessageController {
  #logger = LoggerFactory.createLogger(MessageController.name);
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(account = 'test', @Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(account, createMessageDto);
  }

  @Get()
  findAll(account = 'test', @Query() { skip, limit }: PaginationParams) {
    return this.messageService.findAll(account, skip, limit);
  }

  @Post(':channel')
  send(
    account = 'test',
    @Param('channel') channel: string,
    @Body() dto: CreateMessageDto
  ) {
    return this.messageService.send(account, channel, dto);
  }
}
