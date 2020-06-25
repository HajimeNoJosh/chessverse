import React from 'react';
import { withKnobs, optionsKnob as options } from '@storybook/addon-knobs';
import { Piece } from './Piece';

export default {
  title: 'Piece',
  component: Piece,
  decorators: [withKnobs],
};

const makeObj = (array) => {
  const obj = {};
  for (let i = 0; i < array.length; i += 1) {
    obj[array[i]] = array[i];
  }
  return obj;
};

export const Default = () => {
  const typeSelect = makeObj([
    'Pawn',
    'King',
    'Queen',
    'Bishop',
    'Knight',
    'Rook',
  ]);
  const type = options('Name', typeSelect, 'Pawn', { display: 'select' });
  const colorSelect = {
    black: 'black',
    white: 'white',
  };
  const color = options('Color', colorSelect, 'white', { display: 'select' });

  return <Piece type={type} color={color} />;
};
