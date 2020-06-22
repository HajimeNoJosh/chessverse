import React from 'react';

import { Square } from '../Square/Square';
import { Piece } from '../Piece/Piece';

import './Board.scss';

export const Board = () => {
  const board = [];
  const boardRep = [
    ['Blr', 'Bln', 'Blb', 'Blq', 'Blk', 'Blb', 'Bln', 'Blr'],
    ['Blp', 'Blp', 'Blp', 'Blp', 'Blp', 'Blp', 'Blp', 'Blp'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['Whp', 'Whp', 'Whp', 'Whp', 'Whp', 'Whp', 'Whp', 'Whp'],
    ['Whr', 'Whn', 'Whb', 'Whq', 'Whk', 'Whb', 'Whn', 'Whr'],
  ];

  const isEven = (num) => num % 2 === 0;

  for (let i = 0; i < 8; i += 1) {
    const rows = [];
    for (let j = 0; j < 8; j += 1) {
      const type = boardRep[j][i];
      if (isEven(i) && isEven(j)) {
        rows.push(
          <Square color="white">
            <Piece type={type} />
          </Square>,
        );
      } else if (!isEven(i) && !isEven(j)) {
        rows.push(
          <Square color="white">
            <Piece type={type} />
          </Square>,
        );
      } else {
        rows.push(
          <Square color="black">
            <Piece type={type} />
          </Square>,
        );
      }
    }
    board.push(<div className="board__rows">{rows}</div>);
  }

  return <div className="board">{board}</div>;
};
