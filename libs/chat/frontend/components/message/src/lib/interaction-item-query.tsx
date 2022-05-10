import clsx from 'clsx';

import { ChatQuery } from '@chat-ex/chat/frontend/api/message';
import { formatDuration } from '@chat-ex/shared/date';

import styles from './interaction-item-query.module.scss';

export type InteractionItemQueryProps = Omit<ChatQuery, 'type'>;

export function InteractionItemQuery({
  message,
  createdAt,
}: InteractionItemQueryProps) {
  const t = formatDuration(createdAt);
  return (
    <div className={clsx(styles['container'], 'flex flex-col text-right')}>
      <div className={clsx(styles['message'], 'rounded-t-3xl rounded-bl-3xl')}>
        {message}
      </div>
      <div className={clsx(styles['date'], 'text-sm')}>{t}</div>
    </div>
  );
}
