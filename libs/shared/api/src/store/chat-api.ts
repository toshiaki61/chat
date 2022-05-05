import { emptySplitApi as api } from './empty-api';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    chatControllerSend: build.query<
      ChatControllerSendApiResponse,
      ChatControllerSendApiArg
    >({
      query: () => ({ url: `/chat` }),
    }),
    chatControllerEvents: build.query<
      ChatControllerEventsApiResponse,
      ChatControllerEventsApiArg
    >({
      query: () => ({ url: `/chat/events` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as chatApi };
export type ChatControllerSendApiResponse = unknown;
export type ChatControllerSendApiArg = void;
export type ChatControllerEventsApiResponse = unknown;
export type ChatControllerEventsApiArg = void;
export const { useChatControllerSendQuery, useChatControllerEventsQuery } =
  injectedRtkApi;
