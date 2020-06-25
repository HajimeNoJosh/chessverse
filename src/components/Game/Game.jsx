import React, { useState } from 'react';

import './Game.scss';
import { Board } from '../Board/Board';
import { boardInitialize } from './BoardInitialize';

export const Game = () => {
  const [boardRep, setBoardRep] = useState(boardInitialize());

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
  const [player, setPlayer] = useState('white');
  const [firstCoord, setFirstCoord] = useState([]);
  const [legalMoves, setLegalMoves] = useState([]);

  const setPlayerTurn = () => {
    if (player === 'white') {
      setPlayer('black');
    } else {
      setPlayer('white');
    }
  };

  const movePiece = (coord, type, color, moved) => {
    const coordFirst = coord[0];
    const coordSecond = coord[1];
    const copyBoardRep = [...boardRep];

    if ((firstClick && type === '') || (firstClick && color !== player)) {
      return;
    }

    if (!firstClick) {
      if (!checkLegalMove(coord)) {
        return;
      }
      setLegalMoves([]);
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

    if (firstClick) {
      copyBoardRep[coordFirst][coordSecond] = '';
      setCurentPiece({ type, color, moved });
      setFirstCoord(coord);
    } else if (coord.toString() === firstCoord.toString()) {
      copyBoardRep[coordFirst][coordSecond] = currentPiece;
      setCurentPiece('');
      setFirstCoord([]);
    } else {
      const copyCurrentPiece = { ...currentPiece };
      copyCurrentPiece.moved = true;
      copyBoardRep[coordFirst][coordSecond] = copyCurrentPiece;
      setCurentPiece('');
      setPlayerTurn();
      setFirstCoord([]);
    }

    setFirstClick(!firstClick);
    setBoardRep(copyBoardRep);
  };

  const continueLoop = (coord) => {
    const coordFirst = coord[0];
    const coordSecond = coord[1];
    return boardRep[coordFirst][coordSecond] === '';
  };

  const getPawnMoves = (coord, color, moved) => {
    const tempMoves = [coord];
    if (moved) {
      for (let i = 1; i < 2; i += 1) {
        let tempArray = null;
        if (color === 'white') {
          const checkCoord = [coord[0] - i, coord[1]];
          if (continueLoop(checkCoord)) {
            tempArray = [coord[0] - i, coord[1]];
          }
        } else {
          const checkCoord = [coord[0] + i, coord[1]];
          if (continueLoop(checkCoord)) {
            tempArray = [coord[0] + i, coord[1]];
          }
        }
        tempMoves.push(tempArray);
      }
    } else {
      for (let i = 1; i <= 2; i += 1) {
        let tempArray = null;
        if (color === 'white') {
          const checkCoord = [coord[0] - i, coord[1]];
          if (continueLoop(checkCoord)) {
            tempArray = [coord[0] - i, coord[1]];
          }
        } else {
          const checkCoord = [coord[0] + i, coord[1]];
          if (continueLoop(checkCoord)) {
            tempArray = [coord[0] + i, coord[1]];
          }
        }
        tempMoves.push(tempArray);
      }
    }

    setLegalMoves(tempMoves);
    if (tempMoves.length > 0) {
      const filterdMoves = tempMoves.filter(
        (move) => move.toString() !== coord.toString(),
      );
      setActiveLegalMoves(filterdMoves, color);
    } else {
      setActiveLegalMoves(tempMoves, color);
    }
  };

  const getKingMoves = (coord, color) => {
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
    setActiveLegalMoves(tempMoves, color);
  };

  const getKnightMoves = (coord, color) => {
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
    setActiveLegalMoves(tempMoves, color);
  };

  const getRookMoves = (coord, color) => {
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
    setActiveLegalMoves(tempMoves, color);
  };

  const getBishopMoves = (coord, color) => {
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
    setActiveLegalMoves(tempMoves, color);
  };

  const getQueenMoves = (coord, color) => {
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
    setActiveLegalMoves(tempMoves, color);
  };

  const getLegalMoves = (coord, type, color, moved) => {
    if (firstClick) {
      if (type === 'Pawn') {
        getPawnMoves(coord, color, moved);
      } else if (type === 'King') {
        getKingMoves(coord, color);
      } else if (type === 'Knight') {
        getKnightMoves(coord, color);
      } else if (type === 'Rook') {
        getRookMoves(coord, color);
      } else if (type === 'Bishop') {
        getBishopMoves(coord, color);
      } else if (type === 'Queen') {
        getQueenMoves(coord, color);
      }
    }
  };

  const setActiveLegalMoves = (tempMoves, color) => {
    if (color === player) {
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

  const onClick = (coord, type, color, moved) => {
    getLegalMoves(coord, type, color, moved);
    movePiece(coord, type, color, moved);
  };

  return (
    <Board
      boardRep={boardRep}
      legalMovesBoard={legalMovesBoard}
      onClick={onClick}
    />
  );
};
