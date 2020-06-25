import React from 'react';
import {
  withKnobs,
  optionsKnob as options,
  boolean,
} from '@storybook/addon-knobs';
import { Square } from './Square';
// import { Piece } from '../Piece/Piece';

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

  const isActive = boolean('Active', true);

  return (
    <Square color={color} isActive={isActive}>
      {/* <Piece type="Whk" color="black" /> */}
    </Square>
  );
};
