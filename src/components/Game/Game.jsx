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

  const [legalMovesBoard, setLegalMovesBoard] = useState([
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
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
    setActiveLegalMoves(tempMoves, type);
  };

  const getKingMoves = (coord, type) => {
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
    setActiveLegalMoves(tempMoves, type);
  };

  const getKnightMoves = (coord, type) => {
    const generateLegalMoves = [
      [-2, 1],
      [-1, 2],
      [0, 0],
      [1, 2],
      [2, 1],
      [-2, -1],
      [-1, -2],
      [1, -2],
      [2, -1],
    ];
    const reducer = (acc, curr) => [
      ...acc,
      [coord[0] + curr[0], coord[1] + curr[1]],
    ];

    const tempMoves = generateLegalMoves.reduce(reducer, []);

    setLegalMoves(tempMoves);
    setActiveLegalMoves(tempMoves, type);
  };

  const getRookMoves = (coord, type) => {
    const tempMoves = [];
    const generateUp = () => {
      const tempUpMoves = [];
      for (let i = coord[0]; i >= 0; i -= 1) {
        tempUpMoves.push([i, coord[1]]);
      }
      tempMoves.push(...tempUpMoves);
    };
    const generateDown = () => {
      const tempUpMoves = [];
      for (let i = coord[0]; i < 8; i += 1) {
        tempUpMoves.push([i, coord[1]]);
      }
      tempMoves.push(...tempUpMoves);
    };
    const generateRight = () => {
      const tempRightMoves = [];
      for (let i = coord[1]; i < 8; i += 1) {
        tempRightMoves.push([coord[0], i]);
      }
      tempMoves.push(...tempRightMoves);
    };
    const generateLeft = () => {
      const tempLeftMoves = [];
      for (let i = coord[1]; i >= 0; i -= 1) {
        tempLeftMoves.push([coord[0], i]);
      }
      tempMoves.push(...tempLeftMoves);
    };
    generateUp();
    generateDown();
    generateLeft();
    generateRight();

    setLegalMoves(tempMoves);
    setActiveLegalMoves(tempMoves, type);
  };

  const getBishopMoves = (coord, type) => {
    const tempMoves = [];
    const generateUpRight = () => {
      const tempUpRightMoves = [];
      let num = 0;
      for (let i = coord[0]; i >= 0; i -= 1) {
        tempUpRightMoves.push([i, coord[1] + num]);
        num += 1;
      }
      tempMoves.push(...tempUpRightMoves);
    };
    const generateDownRight = () => {
      const tempUpDownMoves = [];
      let num = 0;
      for (let i = coord[0]; i < 8; i += 1) {
        tempUpDownMoves.push([i, coord[1] + num]);
        num += 1;
      }
      tempMoves.push(...tempUpDownMoves);
    };
    const generateDownLeft = () => {
      const tempDownLefttMoves = [];
      let num = 0;
      for (let i = coord[0]; i < 8; i += 1) {
        tempDownLefttMoves.push([i, coord[1] - num]);
        num += 1;
      }
      tempMoves.push(...tempDownLefttMoves);
    };
    const generateUpLeft = () => {
      const tempUpLeftMoves = [];
      let num = 0;
      for (let i = coord[0]; i >= 0; i -= 1) {
        tempUpLeftMoves.push([i, coord[1] - num]);
        num += 1;
      }

      tempMoves.push(...tempUpLeftMoves);
    };
    generateUpRight();
    generateDownRight();
    generateDownLeft();
    generateUpLeft();

    setLegalMoves(tempMoves);
    setActiveLegalMoves(tempMoves, type);
  };

  const getQueenMoves = (coord, type) => {
    const tempMoves = [];
    const generateUpRight = () => {
      const tempUpRightMoves = [];
      let num = 0;
      for (let i = coord[0]; i >= 0; i -= 1) {
        tempUpRightMoves.push([i, coord[1] + num]);
        num += 1;
      }
      tempMoves.push(...tempUpRightMoves);
    };
    const generateDownRight = () => {
      const tempUpDownMoves = [];
      let num = 0;
      for (let i = coord[0]; i < 8; i += 1) {
        tempUpDownMoves.push([i, coord[1] + num]);
        num += 1;
      }
      tempMoves.push(...tempUpDownMoves);
    };
    const generateDownLeft = () => {
      const tempDownLefttMoves = [];
      let num = 0;
      for (let i = coord[0]; i < 8; i += 1) {
        tempDownLefttMoves.push([i, coord[1] - num]);
        num += 1;
      }
      tempMoves.push(...tempDownLefttMoves);
    };
    const generateUpLeft = () => {
      const tempUpLeftMoves = [];
      let num = 0;
      for (let i = coord[0]; i >= 0; i -= 1) {
        tempUpLeftMoves.push([i, coord[1] - num]);
        num += 1;
      }

      tempMoves.push(...tempUpLeftMoves);
    };
    const generateUp = () => {
      const tempUpMoves = [];
      for (let i = coord[0]; i >= 0; i -= 1) {
        tempUpMoves.push([i, coord[1]]);
      }
      tempMoves.push(...tempUpMoves);
    };
    const generateDown = () => {
      const tempUpMoves = [];
      for (let i = coord[0]; i < 8; i += 1) {
        tempUpMoves.push([i, coord[1]]);
      }
      tempMoves.push(...tempUpMoves);
    };
    const generateRight = () => {
      const tempRightMoves = [];
      for (let i = coord[1]; i < 8; i += 1) {
        tempRightMoves.push([coord[0], i]);
      }
      tempMoves.push(...tempRightMoves);
    };
    const generateLeft = () => {
      const tempLeftMoves = [];
      for (let i = coord[1]; i >= 0; i -= 1) {
        tempLeftMoves.push([coord[0], i]);
      }
      tempMoves.push(...tempLeftMoves);
    };
    generateUp();
    generateDown();
    generateLeft();
    generateRight();
    generateUpRight();
    generateDownRight();
    generateDownLeft();
    generateUpLeft();

    setLegalMoves(tempMoves);
    setActiveLegalMoves(tempMoves, type);
  };

  const setActiveLegalMoves = (tempMoves, type) => {
    if (type.substring(0, 2) === player) {
      const copyLegalMoves = [...legalMovesBoard];
      for (let i = 0; i < tempMoves.length; i += 1) {
        const coord = tempMoves[i];

        if (coord[0] <= 7 && coord[0] >= 0 && coord[1] <= 7 && coord[1] >= 0) {
          copyLegalMoves[coord[0]][coord[1]] = true;
          setLegalMovesBoard(copyLegalMoves);
        }
      }
    }
  };

  const getLegalMoves = (coord, type) => {
    if (firstClick) {
      if (type === 'Whp') {
        getPawnMoves(coord, type);
      } else if (type === 'Blp') {
        getPawnMoves(coord, type);
      } else if (type === 'Whk' || type === 'Blk') {
        getKingMoves(coord, type);
      } else if (type === 'Whn' || type === 'Bln') {
        getKnightMoves(coord, type);
      } else if (type === 'Whr' || type === 'Blr') {
        getRookMoves(coord, type);
      } else if (type === 'Whb' || type === 'Blb') {
        getBishopMoves(coord, type);
      } else if (type === 'Whq' || type === 'Blq') {
        getQueenMoves(coord, type);
      }
    } else {
      setLegalMovesBoard([
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
      ]);
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

  return (
    <Board
      boardRep={boardRep}
      legalMovesBoard={legalMovesBoard}
      onClick={onClick}
    />
  );
};
