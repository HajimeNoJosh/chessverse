import React from 'react';
import { render } from '@testing-library/react';
import { Square } from './Square';

describe('Square', () => {
  it('renders', () => {
    render(<Square />);
  });

  it('has a color', () => {
    render(<Square color="black" />);
  });
  // square should have a color

  // square should have a piece

  // square should be isAttacked

  // square should have an isAttacked with a cirle with no piece

  // square should have an isAttacked with a triangle if a piece

  // square should have an overlay if isActive
});
