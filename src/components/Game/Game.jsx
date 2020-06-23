import React, { useState } from 'react';

import './Game.scss';
import { Board } from '../Board/Board';

export const Game = () => {
  const [boardRep, setBoardRep] = useState([
    ['Blr', 'Bln', 'Blb', 'Blq', 'Blk', 'Blb', 'Bln', 'Blr'],
    ['Blp', 'Blp', 'Blp', 'Blp', 'Blp', 'Blp', 'Blp', 'Blp'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['Whp', 'Whp', 'Whp', 'Whp', 'Whp', 'Whp', 'Whp', 'Whp'],
    ['Whr', 'Whn', 'Whb', 'Whq', 'Whk', 'Whb', 'Whn', 'Whr'],
  ]);
  const [currentPiece, setCurentPiece] = useState('');
  const [firstClick, setFirstClick] = useState(true);

  const movePiece = (coord, type) => {
    const coordFirst = coord[0];
    const coordSecond = coord[1];
    const copyBoardRep = [...boardRep];
    setFirstClick(!firstClick);
    if (firstClick && type !== '') {
      copyBoardRep[coordFirst][coordSecond] = '';
      setCurentPiece(type);
    } else {
      copyBoardRep[coordFirst][coordSecond] = currentPiece;
      setCurentPiece('');
    }
    setBoardRep(copyBoardRep);
  };

  const onClick = (coord, type) => {
    movePiece(coord, type);
  };

  return <Board boardRep={boardRep} onClick={onClick} />;
};
