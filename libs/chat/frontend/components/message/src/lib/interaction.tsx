// import { useChannelQuery, useSendMessageMutation } from './api';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { useChannelQuery } from '@chat-ex/chat/frontend/api/message';

import { InteractionItem } from './interaction-item';
import styles from './interaction.module.scss';

export function Interaction() {
  const appendInterval = useRef(0);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [atBottom, setAtBottom] = useState(false);
  const showButtonTimeoutRef = useRef(0);
  const [showButton, setShowButton] = useState(false);
  const result = useChannelQuery('test');
  useEffect(() => {
    return () => {
      clearInterval(appendInterval.current);
      clearTimeout(showButtonTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    clearTimeout(showButtonTimeoutRef.current);
    if (!atBottom) {
      showButtonTimeoutRef.current = window.setTimeout(
        () => setShowButton(true),
        500
      );
    } else {
      setShowButton(false);
    }
  }, [atBottom, setShowButton]);

  return (
    <div className={clsx(styles['container'], 'flex rounded-3xl')}>
      <Virtuoso
        className={clsx(styles['scroller'])}
        // style={{ height: 400, width: '100%' }}
        ref={virtuosoRef}
        initialTopMostItemIndex={999}
        data={result.data?.ids}
        atBottomStateChange={(bottom) => {
          clearInterval(appendInterval.current);
          if (bottom) {
            appendInterval.current = window.setInterval(() => {
              // setUsers((users) => [
              //   ...users,
              //   user(),
              //   user(),
              //   user(),
              //   user(),
              //   user(),
              // ]);
            }, 400);
          }
          setAtBottom(bottom);
        }}
        itemContent={(_, id) => {
          const message = result.data?.entities[id];
          if (!message) {
            return null;
          }
          return <InteractionItem message={message} key={id} />;
        }}
        followOutput={'auto'}
      />
      {showButton && (
        <button
          onClick={() =>
            virtuosoRef.current?.scrollToIndex({
              index: (result.data?.ids.length ?? 0) - 1,
              behavior: 'smooth',
            })
          }
          style={{ float: 'right', transform: 'translate(-1rem, -2rem)' }}
        >
          Bottom
        </button>
      )}
    </div>
  );
}
