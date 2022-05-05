import styles from './interaction-item.module.scss';

/* eslint-disable-next-line */
export interface InteractionItemProps {}

export function InteractionItem(props: InteractionItemProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to InteractionItem!</h1>
    </div>
  );
}

export default InteractionItem;
