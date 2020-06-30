import React from 'react';
import PropTypes from 'prop-types';

import { Square } from '../Square/Square';
import { Piece } from '../Piece/Piece';

import './Board.scss';

export const Board = ({ boardRep, legalMovesBoard, onClick }) => {
  const board = [];
  const isEven = (num) => num % 2 === 0;
  let number = 0;

  for (let i = 0; i < 8; i += 1) {
    const rows = [];
    number += i;
    for (let j = 0; j < 8; j += 1) {
      const isAttacked = legalMovesBoard[j][i];
      const { type, color, moved, isActive } = boardRep[j][i];
      const coord = [j, i];
      if (isEven(i) && isEven(j)) {
        rows.push(
          <Square
            key={coord}
            type={type}
            coord={coord}
            isAttacked={isAttacked}
            onClick={onClick}
            color="white"
            pieceColor={color}
            moved={moved}
            isActive={isActive}
          >
            <Piece color={color} type={type} />
          </Square>,
        );
      } else if (!isEven(i) && !isEven(j)) {
        rows.push(
          <Square
            key={coord}
            type={type}
            coord={coord}
            isAttacked={isAttacked}
            onClick={onClick}
            color="white"
            pieceColor={color}
            moved={moved}
            isActive={isActive}
          >
            <Piece color={color} type={type} />
          </Square>,
        );
      } else {
        rows.push(
          <Square
            key={coord}
            type={type}
            coord={coord}
            isAttacked={isAttacked}
            onClick={onClick}
            color="black"
            pieceColor={color}
            moved={moved}
            isActive={isActive}
          >
            <Piece color={color} type={type} />
          </Square>,
        );
      }
    }
    board.push(
      <div key={number} className="board__rows">
        {rows}
      </div>,
    );
  }

  return <div className="board">{board}</div>;
};

Board.propTypes = {
  boardRep: PropTypes.array,
  legalMovesBoard: PropTypes.array,
  onClick: PropTypes.func,
};
