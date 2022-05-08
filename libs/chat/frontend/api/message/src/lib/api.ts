import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Subscription, timer, retry } from 'rxjs';

import {
  exponentialJitterBackoff,
  fromEventSource,
} from '@chat-ex/shared/utils';

import { ChatMessage, ChatReceivedEvent } from './interface';

const messagesAdapter = createEntityAdapter<ChatMessage>({});

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
        body: { ...patch, type: 'query' },
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
