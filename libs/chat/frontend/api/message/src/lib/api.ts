import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Subscription, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

import {
  exponentialJitterBackoff,
  fromEventSource,
} from '@chat-ex/shared/utils';

type ChatSystemMessage = {
  _id: string;
  type: 'text';
  message: string;
};
type ChatQueryMessage = {
  _id: string;
  type: 'query';
  message: string;
};
type ChatMessage = ChatSystemMessage | ChatQueryMessage;
type ChatReceivedEvent = { id: string; data: ChatMessage[] };
const messagesAdapter = createEntityAdapter<ChatMessage>({
  selectId: (m) => m._id,
});

export const api = createApi({
  reducerPath: 'messageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation<
      EntityState<ChatMessage>,
      { id: string; message: string }
    >({
      query: ({ id, ...patch }) => ({
        url: `message/${id}`,
        method: 'POST',
        body: patch,
      }),
    }),

    channel: builder.query<EntityState<ChatMessage>, string>({
      queryFn() {
        return { data: { ids: [], entities: {} } };
      },

      async onCacheEntryAdded(
        topic,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        const event$ = fromEventSource<ChatReceivedEvent>(
          (process.env['EVENT_SOURCE_URI'] ?? '/api/message') + `/${topic}`,
          {
            withCredentials:
              process.env['EVENT_SOURCE_WITH_CREDENTIALS'] === 'true',
          }
        ).pipe(
          retry({
            delay: (_error, retryCount) => {
              return timer(exponentialJitterBackoff(retryCount));
            },
            resetOnSuccess: true,
          })
        );

        let subscription: Subscription | undefined = undefined;
        try {
          await cacheDataLoaded;
          subscription = event$.subscribe({
            next: (message) => {
              updateCachedData((draft) => {
                messagesAdapter.upsertMany(draft, message.data);
              });
            },
            error: (error) => {
              console.log('error', error);
            },
            complete: () => {
              console.log('complete');
            },
          });
        } catch {
          // if cacheEntryRemoved resolved before cacheDataLoaded,
          // cacheDataLoaded throws
        }

        await cacheEntryRemoved;
        subscription?.unsubscribe();
      },
    }),
  }),
});

export const { useSendMessageMutation, useChannelQuery } = api;
