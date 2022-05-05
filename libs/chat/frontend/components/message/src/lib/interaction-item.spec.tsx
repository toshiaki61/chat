import { render } from '@testing-library/react';

import InteractionItem from './interaction-item';

describe('InteractionItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InteractionItem />);
    expect(baseElement).toBeTruthy();
  });
});
