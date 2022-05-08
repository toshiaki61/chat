type ChatBase = {
  id: string;
  createdAt: string;
  message: string;
  type: string;
};

export type ChatSystem = ChatBase & {
  type: 'text';
};

export type ChatQuery = ChatBase & {
  type: 'query';
};

export type ChatMessage = ChatSystem | ChatQuery;

export type ChatReceivedEvent = { id: string; data: ChatMessage[] };
