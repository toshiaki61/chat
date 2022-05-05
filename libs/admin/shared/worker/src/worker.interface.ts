export interface CustomWorker extends Worker {
  new (): Worker;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Functions = { [key: string]: (...args: any[]) => any };

export type Promisify<T extends Functions> = {
  [KeyType in keyof T]: (
    arg: Parameters<T[KeyType]>[0]
  ) => Promise<ReturnType<T[KeyType]>>;
};

export type MessageEventData<Payload = unknown, Type = string> = MessageEvent<{
  id: string;
  type: Type;
  payload: Payload;
}>;
