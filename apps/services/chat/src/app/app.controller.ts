import { Controller, Param, Sse, MessageEvent, Headers } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AppService } from './app.service';

@Controller('/message')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Sse(':channel')
  subscribe(
    account = 'test',
    @Headers('last-event-id') lastEventId: string | undefined,
    @Param('channel') channel: string
  ): Observable<MessageEvent> {
    return this.appService.stream(account, channel, lastEventId);
  }
}
