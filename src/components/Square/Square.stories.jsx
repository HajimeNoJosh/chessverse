import React from 'react';
import { withKnobs, optionsKnob as options } from '@storybook/addon-knobs';
import { Square } from './Square';
import { Piece } from '../Piece/Piece';

export default {
  title: 'Square',
  component: Square,
  decorators: [withKnobs],
};

export const Default = () => {
  const colorSelect = {
    black: 'black',
    white: 'white',
  };
  const color = options('Color', colorSelect, 'white', { display: 'select' });

  return (
    <Square color={color}>
      <Piece type="knight" color="black" />
    </Square>
  );
};
