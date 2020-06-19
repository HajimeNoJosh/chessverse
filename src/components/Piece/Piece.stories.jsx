import React from 'react';
import { withKnobs, optionsKnob as options } from '@storybook/addon-knobs';
import { Piece } from './Piece';

export default {
  title: 'Piece',
  component: Piece,
  decorators: [withKnobs],
};

export const Default = () => {
  const typeSelect = {
    pawn: 'pawn',
    queen: 'queen',
    king: 'king',
    bishop: 'bishop',
    knight: 'knight',
    rook: 'rook',
  };
  const type = options('Name', typeSelect, 'knight', { display: 'select' });
  const colorSelect = {
    black: 'black',
    white: 'white',
  };
  const color = options('Color', colorSelect, 'white', { display: 'select' });

  return <Piece type={type} color={color} />;
};
