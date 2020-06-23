import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Square } from '../Square/Square';
import { Piece } from '../Piece/Piece';

import './Board.scss';

export const Board = ({ boardRep, onClick }) => {
  const [boardArr, setBoardArr] = useState(boardRep);

  useEffect(() => {
    setBoardArr(boardRep);
  }, [boardRep]);

  const board = [];
  const isEven = (num) => num % 2 === 0;

  for (let i = 0; i < 8; i += 1) {
    const rows = [];
    for (let j = 0; j < 8; j += 1) {
      const type = boardArr[j][i];
      if (isEven(i) && isEven(j)) {
        rows.push(
          <Square type={type} coord={[j, i]} onClick={onClick} color="white">
            <Piece type={type} />
          </Square>,
        );
      } else if (!isEven(i) && !isEven(j)) {
        rows.push(
          <Square type={type} coord={[j, i]} onClick={onClick} color="white">
            <Piece type={type} />
          </Square>,
        );
      } else {
        rows.push(
          <Square type={type} coord={[j, i]} onClick={onClick} color="black">
            <Piece type={type} />
          </Square>,
        );
      }
    }
    board.push(<div className="board__rows">{rows}</div>);
  }

  return <div className="board">{board}</div>;
};

Board.propTypes = {
  boardRep: PropTypes.array,
  onClick: PropTypes.func,
};
