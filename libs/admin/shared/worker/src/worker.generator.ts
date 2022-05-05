import type {
  CustomWorker,
  Functions,
  MessageEventData,
  Promisify,
} from './worker.interface';

function generateUuid() {
  /* cspell: disable-next-line */
  const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('');
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case 'x':
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case 'y':
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
    }
  }
  return chars.join('');
}

export function generateWorkerListener<T extends Functions>(
  ctx: CustomWorker,
  impl: T
) {
  type HandlerType = keyof T;
  type HandlerParam = Parameters<T[HandlerType]>[0];
  return function workerListener({
    data: { id, type, payload },
  }: MessageEventData<HandlerParam, HandlerType>) {
    const handler = impl[type];
    if (!handler) {
      return;
    }

    ctx.postMessage({ id, type, payload: handler(payload) });
  };
}

export function generateWorkerCaller<T extends Functions>(
  worker: Worker,
  impl: T
): Promisify<T> {
  const keys: (keyof T)[] = Object.keys(impl);
  return keys.reduce<Promisify<T>>((acc, type) => {
    type Response = ReturnType<T[typeof type]>;
    acc[type] = function callWorker(
      payload: Parameters<T[typeof type]>[0]
    ): Promise<Response> {
      return new Promise<Response>((resolve) => {
        const id = generateUuid();
        function listener(event: MessageEventData<Response>): void {
          if (event.data?.id !== id) {
            return;
          }
          worker.removeEventListener('message', listener);
          resolve(event.data.payload);
        }
        worker.addEventListener('message', listener);

        worker.postMessage({ id, type, payload });
      });
    };

    return acc;
  }, {} as Promisify<T>);
}
