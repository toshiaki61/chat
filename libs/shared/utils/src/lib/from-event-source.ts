import { Observable } from 'rxjs';

export type Params = ConstructorParameters<typeof EventSource>;
export function fromEventSource<T>(...params: Params): Observable<T> {
  return new Observable<T>((subscriber) => {
    const sse = new EventSource(...params);

    sse.onmessage = (event) => {
      try {
        subscriber.next(JSON.parse(event.data));
      } catch (e) {
        console.error('fail', e);
      }
    };
    sse.onerror = (e) => subscriber.error(e);
    return () => {
      if (sse.readyState === EventSource.OPEN) {
        sse.close();
      }
    };
  });
}
