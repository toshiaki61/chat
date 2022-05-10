import { LeanMessage } from '@chat-ex/shared/schema';

export class ChatReceivedEvent {
  constructor(id: string, account: string, data: LeanMessage[]) {
    this.id = id;
    this.account = account;
    this.data = data;
  }
  id: string;
  account: string;
  data: LeanMessage[];
}
