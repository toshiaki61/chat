import { render } from '@testing-library/react';

import { ChatMessage } from '@chat-ex/chat/frontend/api/message';

import { InteractionItem } from './interaction-item';

describe('InteractionItem', () => {
  it('should render successfully', () => {
    const props: { message: ChatMessage } = {
      message: {
        type: 'query',
        id: 'test',
        createdAt: new Date().toJSON(),
        message: 'test',
      },
    };
    const { baseElement } = render(<InteractionItem {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
