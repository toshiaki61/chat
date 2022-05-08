import clsx from 'clsx';
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
    <form onSubmit={handle} className={clsx('flex justify-center p-8')}>
      <input
        className={clsx(
          styles['input'],
          'text-white bg-transparent border-none outline-none caret-white select-none'
        )}
        placeholder="入力してください"
        {...register('message')}
      />
      <button type="button"></button>
      <button className={clsx(styles['button'])} disabled={isLoading}>
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          color="currentColor"
          fill="none"
          strokeLinecap="square"
          strokeWidth="3.75"
          stroke="currentColor"
          // aria-labelledby="cursorIconTitle"
          role="img"
        >
          <g>
            <polygon
              transform="rotate(112.413 9.16667 14.3333)"
              stroke="null"
              points="3.1666676998138428,21.833332061767578 3.1666676998138428,5.83333158493042 15.166667699813843,17.833332061767578 8.166667699813843,17.833332061767578 3.1666676998138428,22.833332061767578 "
            />
          </g>
        </svg>
      </button>
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
