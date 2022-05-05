import { LeanMessage } from '../schema/message.schema';

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
