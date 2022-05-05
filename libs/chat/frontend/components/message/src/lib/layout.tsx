import { useChannelQuery } from '@chat-ex/chat/frontend/api/message';

import { Form } from './form';
import { Interaction } from './interaction';
import styles from './layout.module.scss';

export function Layout() {
  // const result = useChannelQuery('test');
  // console.log('result', result);
  return (
    <section className={styles['container']}>
      <Interaction />
      <Form />
    </section>
  );
}
