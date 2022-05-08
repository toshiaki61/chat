import { ChatMessage } from '@chat-ex/chat/frontend/api/message';

import { InteractionItemQuery } from './interaction-item-query';
import { InteractionItemSystem } from './interaction-item-system';

export type InteractionItemProps = { message: ChatMessage };

const componentMap = {
  text: InteractionItemSystem,
  query: InteractionItemQuery,
};
export function InteractionItem({ message }: InteractionItemProps) {
  const { type, ...rest } = message;
  const Component = componentMap[type];
  if (!Component) {
    return null;
  }
  return <Component {...rest} />;
}
