import React from 'react';
import { render, screen } from '@testing-library/react';
import { Piece } from './Piece';

describe('Piece', () => {
  it('renders', () => {
    render(<Piece />);
  });

  it('renders a white pawn', () => {
    render(<Piece color="white" type="Pawn" />);
    const inputNode = screen.getByLabelText('white Pawn');

    expect(inputNode).toBeTruthy();
  });
});
