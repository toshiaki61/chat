import { useForm } from 'react-hook-form';

import { useSendMessageMutation } from '@chat-ex/chat/frontend/api/message';

import styles from './form.module.scss';

/* eslint-disable-next-line */
export interface FormProps {}

export function Form(props: FormProps) {
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const { register, handleSubmit, reset } = useForm();

  const handle = handleSubmit(({ message }) => {
    const id = 'test'; // customer id
    sendMessage({ id, message });
    reset();
  });

  return (
    <form onSubmit={handle} className={styles['container']}>
      <input {...register('message')} />
      <button disabled={isLoading}>submit</button>
    </form>
  );
}

// function MessageBoard() {
//   const result = useChannelQuery('test');

//   return (
//     <div style={{ maxHeight: 300 }}>
//       {result.data?.ids.map((id) => {
//         return <div key={id}>{result.data?.entities[id]?.message}</div>;
//       })}
//     </div>
//   );
// }
// const MessageForm = () => {
//   const id = useId();
//   const [sendMessage, { isLoading }] = useSendMessageMutation();
//   const { register, handleSubmit, reset } = useForm();

//   const handle = handleSubmit(({ message }) => {
//     sendMessage({ id, message });
//     reset();
//   });

//   return (
//     <form onSubmit={handle}>
//       <MessageBoard />
//       <input {...register('message')} />
//       <button disabled={isLoading}>submit</button>
//     </form>
//   );
// };
