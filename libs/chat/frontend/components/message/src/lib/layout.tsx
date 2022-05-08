import clsx from 'clsx';

import { Form } from './form';
import { Interaction } from './interaction';
import styles from './layout.module.scss';

export function Layout() {
  return (
    <section className={clsx(styles['container'], 'bg-[#212e42] rounded-3xl')}>
      <Interaction />
      <Form />
    </section>
  );
}
