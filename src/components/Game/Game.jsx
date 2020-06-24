import React, { useState } from 'react';

import './Game.scss';
import { Board } from '../Board/Board';

export const Game = () => {
  const [boardRep, setBoardRep] = useState([
    ['Blr', 'Bln', 'Blb', 'Blq', 'Blk', 'Blb', 'Bln', 'Blr'],
    ['Blp', 'Blp', 'Blp', 'Blp', 'Blp', 'Blp', 'Blp', 'Blp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['Whp', 'Whp', 'Whp', 'Whp', 'Whp', 'Whp', 'Whp', 'Whp'],
    ['Whr', 'Whn', 'Whb', 'Whq', 'Whk', 'Whb', 'Whn', 'Whr'],
  ]);
  const [currentPiece, setCurentPiece] = useState('');
  const [firstClick, setFirstClick] = useState(true);
  const [player, setPlayer] = useState('Wh');
  const [firstCoord, setFirstCoord] = useState([]);
  const [legalMoves, setLegalMoves] = useState([]);

  const setPlayerTurn = () => {
    if (player === 'Wh') {
      setPlayer('Bl');
    } else {
      setPlayer('Wh');
    }
  };

  const movePiece = (coord, type) => {
    const coordFirst = coord[0];
    const coordSecond = coord[1];
    const copyBoardRep = [...boardRep];

    if (
      (firstClick && type === '') ||
      (firstClick && type.substring(0, 2) !== player)
    ) {
      return;
    }

    if (!firstClick) {
      if (!checkLegalMove(coord)) {
        return;
      }
      setLegalMoves([]);
    }

    if (firstClick) {
      copyBoardRep[coordFirst][coordSecond] = '';
      setCurentPiece(type);
      setFirstCoord(coord);
    } else if (coord.toString() === firstCoord.toString()) {
      copyBoardRep[coordFirst][coordSecond] = currentPiece;
      setCurentPiece('');
      setFirstCoord([]);
    } else {
      copyBoardRep[coordFirst][coordSecond] = currentPiece;
      setCurentPiece('');
      setPlayerTurn();
      setFirstCoord([]);
    }

    setFirstClick(!firstClick);
    setBoardRep(copyBoardRep);
  };

  const getPawnMoves = (coord, type) => {
    const tempMoves = [coord];
    for (let i = 1; i <= 2; i += 1) {
      let tempArray = null;
      if (type === 'Whp') {
        tempArray = [coord[0] - i, coord[1]];
      } else {
        tempArray = [coord[0] + i, coord[1]];
      }

      tempMoves.push(tempArray);
    }
    setLegalMoves(tempMoves);
  };

  const getKingMoves = (coord) => {
    const generateNeighbors = [
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, 1],
      [0, 0],
      [0, -1],
      [1, 1],
      [1, 0],
      [1, -1],
    ];
    const reducer = (acc, curr) => [
      ...acc,
      [coord[0] + curr[0], coord[1] + curr[1]],
    ];

    const tempMoves = generateNeighbors.reduce(reducer, []);

    setLegalMoves(tempMoves);
  };

  const getLegalMoves = (coord, type) => {
    if (firstClick) {
      if (type === 'Whp') {
        getPawnMoves(coord, type);
      } else if (type === 'Blp') {
        getPawnMoves(coord, type);
      } else if (type === 'Whk' || type === 'Blk') {
        getKingMoves(coord);
      }
    }
  };

  const checkLegalMove = (coord) => {
    let moveIsLegal = false;
    if (!firstClick) {
      for (let i = 0; i < legalMoves.length; i += 1) {
        if (legalMoves[i].toString() === coord.toString()) {
          moveIsLegal = true;
        }
      }
    }
    return moveIsLegal;
  };

  const onClick = (coord, type) => {
    getLegalMoves(coord, type);
    movePiece(coord, type);
  };

  return <Board boardRep={boardRep} onClick={onClick} />;
};
