// import { useChannelQuery, useSendMessageMutation } from './api';
import { useState, useEffect, useRef } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { useChannelQuery } from '@chat-ex/chat/frontend/api/message';

// import { user, generateUsers, toggleBg } from './data';
import styles from './interaction.module.scss';

/* eslint-disable-next-line */
// export interface InteractionProps {}

// export function Interaction(props: InteractionProps) {
//   const result = useChannelQuery('test');

//   return (
//     <div style={{ maxHeight: 300 }}>
//       {result.data?.ids.map((id) => {
//         return <div key={id}>{result.data?.entities[id]?.message}</div>;
//       })}
//     </div>
//   );
// }

export function Interaction() {
  // const [users, setUsers] = useState(() => generateUsers(100));
  const appendInterval = useRef(0);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [atBottom, setAtBottom] = useState(false);
  const showButtonTimeoutRef = useRef(0);
  const [showButton, setShowButton] = useState(false);
  const result = useChannelQuery('test');
  console.log('result', result);
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
    <>
      <Virtuoso
        style={{ height: 400, width: '100%' }}
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
        itemContent={(index, id) => {
          const message = result.data?.entities[id];
          if (!message) {
            return null;
          }
          return (
            <div
              style={{
                // backgroundColor: toggleBg(index),
                padding: '1rem 0.5rem',
              }}
            >
              <h4>{message.message}</h4>
              <div style={{ marginTop: '1rem' }}>{message.message}</div>
            </div>
          );
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
    </>
  );
}
