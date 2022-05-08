import { render } from '@testing-library/react';

import { ChatQuery } from '@chat-ex/chat/frontend/api/message';

import { InteractionItemQuery } from './interaction-item-query';

describe('InteractionItemQuery', () => {
  it('should render successfully', () => {
    const props: ChatQuery = {
      type: 'query',
      id: 'test',
      createdAt: new Date().toJSON(),
      message: 'test',
    };
    const { baseElement } = render(<InteractionItemQuery {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
