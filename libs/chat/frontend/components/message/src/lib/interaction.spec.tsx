import { render } from '@testing-library/react';

import { Interaction } from './interaction';

describe('Interaction', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Interaction />);
    expect(baseElement).toBeTruthy();
  });
});
