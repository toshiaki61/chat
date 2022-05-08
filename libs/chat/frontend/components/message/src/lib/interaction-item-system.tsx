import { ChatSystem } from '@chat-ex/chat/frontend/api/message';

import styles from './interaction-item-system.module.scss';

export type InteractionItemSystemProps = Omit<ChatSystem, 'type'>;

export function InteractionItemSystem({
  message,
  createdAt,
}: InteractionItemSystemProps) {
  return (
    <div className={styles['container']}>
      <div>{message}</div>
      <div>{createdAt}</div>
    </div>
  );
}
