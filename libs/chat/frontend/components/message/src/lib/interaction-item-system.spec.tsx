import { ChatSystem } from '@chat-ex/chat/frontend/api/message';
import { render } from '@testing-library/react';

import { InteractionItemSystem } from './interaction-item-system';

describe('InteractionItemSystem', () => {
  it('should render successfully', () => {
    const props: ChatSystem = {
      type: 'text',
      id: 'test',
      createdAt: new Date().toJSON(),
      message: 'test',
    };
    const { baseElement } = render(<InteractionItemSystem {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
