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
  // This helper function is for finding the opposite color of the current player
  const whichColor = () => {
    if (player === 'white') {
      return 'black';
    }
    return 'white';
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

  const continueLoop = (coord, piece) => {
    const coordFirst = coord[0];
    const coordSecond = coord[1];
    return (
      boardRep[coordFirst][coordSecond] === '' ||
      boardRep[coordFirst][coordSecond].type === piece
    );
  };

  const filterOutOfBoundary = (coord) =>
    coord[0] <= 7 && coord[0] >= 0 && coord[1] <= 7 && coord[1] >= 0;

  const getPawnMoves = (coord, color, moved) => {
    const tempMoves = [coord];
    if (moved) {
      for (let i = 1; i < 2; i += 1) {
        let tempArray = [];
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
        let tempArray = [];
        if (color === 'white') {
          const checkCoord = [coord[0] - i, coord[1]];
          if (boardRep[checkCoord[0]][checkCoord[1]] !== '') {
            break;
          }
          if (continueLoop(checkCoord)) {
            tempArray = [coord[0] - i, coord[1]];
          }
        } else {
          const checkCoord = [coord[0] + i, coord[1]];
          if (boardRep[checkCoord[0]][checkCoord[1]] !== '') {
            break;
          }
          if (continueLoop(checkCoord)) {
            tempArray = [coord[0] + i, coord[1]];
          }
        }
        tempMoves.push(tempArray);
      }
    }
    // For taking with pawns
    if (color === 'white') {
      const coordUp = coord[0] - 1;
      const coordRight = coord[1] + 1;
      const coordLeft = coord[1] - 1;

      if (
        coordUp < 8 &&
        coordUp >= 0 &&
        coordRight < 8 &&
        coordRight >= 0 &&
        coordLeft < 8 &&
        coordLeft >= 0
      ) {
        if (boardRep[coordUp][coordRight].color === 'black') {
          tempMoves.push([coordUp, coordRight]);
        }
        if (boardRep[coordUp][coordLeft].color === 'black') {
          tempMoves.push([coordUp, coordLeft]);
        }
      }
    } else if (color === 'black') {
      const coordDown = coord[0] + 1;
      const coordRight = coord[1] + 1;
      const coordLeft = coord[1] - 1;
      if (
        coordDown < 8 &&
        coordDown >= 0 &&
        coordRight < 8 &&
        coordRight >= 0 &&
        coordLeft < 8 &&
        coordLeft >= 0
      ) {
        if (boardRep[coordDown][coordRight].color === 'white') {
          tempMoves.push([coordDown, coordRight]);
        }
        if (boardRep[coordDown][coordLeft].color === 'white') {
          tempMoves.push([coordDown, coordLeft]);
        }
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

    const inBoundary = tempMoves.filter((move) => filterOutOfBoundary(move));

    const finalMoves = inBoundary.filter((move) => continueLoop(move, 'King'));

    setLegalMoves(finalMoves);
    const filteredCoord = finalMoves.filter(
      (move) => coord.toString() !== move.toString(),
    );
    setActiveLegalMoves(filteredCoord, color);
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

    const inBoundary = tempMoves.filter((move) => filterOutOfBoundary(move));

    const finalLegalMoves = inBoundary.filter(
      (move) => boardRep[move[0]][move[1]].color !== player,
    );

    finalLegalMoves.push(coord);

    setLegalMoves(finalLegalMoves);
    const filteredCoord = finalLegalMoves.filter(
      (move) => coord.toString() !== move.toString(),
    );
    setActiveLegalMoves(filteredCoord, color);
  };

  const getRookMoves = (coord, color) => {
    const tempMoves = [coord];
    const generateUp = () => {
      const tempUpMoves = [];
      for (let i = coord[0] - 1; i >= 0; i -= 1) {
        if (boardRep[i][coord[1]].color === color) {
          break;
        } else if (boardRep[i][coord[1]].color === whichColor()) {
          tempUpMoves.push([i, coord[1]]);
          break;
        }
        tempUpMoves.push([i, coord[1]]);
      }
      tempMoves.push(...tempUpMoves);
    };
    const generateDown = () => {
      const tempDownMoves = [];
      for (let i = coord[0] + 1; i < 8; i += 1) {
        if (boardRep[i][coord[1]].color === color) {
          break;
        } else if (boardRep[i][coord[1]].color === whichColor()) {
          tempDownMoves.push([i, coord[1]]);
          break;
        }
        tempDownMoves.push([i, coord[1]]);
      }
      tempMoves.push(...tempDownMoves);
    };
    const generateRight = () => {
      const tempRightMoves = [];
      for (let i = coord[1] + 1; i < 8; i += 1) {
        if (boardRep[coord[0]][i].color === color) {
          break;
        } else if (boardRep[coord[0]][i].color === whichColor()) {
          tempRightMoves.push([coord[0], i]);
          break;
        }
        tempRightMoves.push([coord[0], i]);
      }
      tempMoves.push(...tempRightMoves);
    };
    const generateLeft = () => {
      const tempLeftMoves = [];
      for (let i = coord[1] - 1; i >= 0; i -= 1) {
        if (boardRep[coord[0]][i].color === color) {
          break;
        } else if (boardRep[coord[0]][i].color === whichColor()) {
          tempLeftMoves.push([coord[0], i]);
          break;
        }
        tempLeftMoves.push([coord[0], i]);
      }
      tempMoves.push(...tempLeftMoves);
    };
    generateUp();
    generateDown();
    generateLeft();
    generateRight();

    setLegalMoves(tempMoves);
    const filteredCoord = tempMoves.filter(
      (move) => coord.toString() !== move.toString(),
    );
    setActiveLegalMoves(filteredCoord, color);
  };

  const getBishopMoves = (coord, color) => {
    const tempMoves = [coord];
    const generateUpRight = () => {
      const tempUpRightMoves = [];
      let num = 0;
      for (let i = coord[0] - 1; i >= 0; i -= 1) {
        num += 1;
        const newCoord = coord[1] + num;
        if (newCoord < 8 && newCoord >= 0) {
          if (boardRep[i][newCoord].color === color) {
            break;
          } else if (boardRep[i][newCoord].color === whichColor()) {
            tempUpRightMoves.push([i, coord[1] + num]);
            break;
          }
          tempUpRightMoves.push([i, coord[1] + num]);
        }
      }
      tempMoves.push(...tempUpRightMoves);
    };
    const generateDownRight = () => {
      const tempUpDownMoves = [];
      let num = 0;
      for (let i = coord[0] + 1; i < 8; i += 1) {
        num += 1;
        const newCoord = coord[1] + num;
        if (newCoord < 8 && newCoord >= 0) {
          if (boardRep[i][newCoord].color === color) {
            break;
          } else if (boardRep[i][newCoord].color === whichColor()) {
            tempUpDownMoves.push([i, coord[1] + num]);
            break;
          }
          tempUpDownMoves.push([i, coord[1] + num]);
        }
      }
      tempMoves.push(...tempUpDownMoves);
    };
    const generateDownLeft = () => {
      const tempDownLefttMoves = [];
      let num = 0;
      for (let i = coord[0] + 1; i < 8; i += 1) {
        num += 1;
        const newCoord = coord[1] - num;
        if (newCoord < 8 && newCoord >= 0) {
          if (boardRep[i][newCoord].color === color) {
            break;
          } else if (boardRep[i][newCoord].color === whichColor()) {
            tempDownLefttMoves.push([i, coord[1] - num]);
            break;
          }
          tempDownLefttMoves.push([i, coord[1] - num]);
        }
      }
      tempMoves.push(...tempDownLefttMoves);
    };
    const generateUpLeft = () => {
      const tempUpLeftMoves = [];
      let num = 0;
      for (let i = coord[0] - 1; i >= 0; i -= 1) {
        num += 1;
        const newCoord = coord[1] - num;
        if (newCoord < 8 && newCoord >= 0) {
          if (boardRep[i][newCoord].color === color) {
            break;
          } else if (boardRep[i][newCoord].color === whichColor()) {
            tempUpLeftMoves.push([i, coord[1] - num]);
            break;
          }
          tempUpLeftMoves.push([i, coord[1] - num]);
        }
      }
      tempMoves.push(...tempUpLeftMoves);
    };
    generateUpRight();
    generateDownRight();
    generateDownLeft();
    generateUpLeft();

    setLegalMoves(tempMoves);
    const filteredCoord = tempMoves.filter(
      (move) => coord.toString() !== move.toString(),
    );
    setActiveLegalMoves(filteredCoord, color);
  };

  const getQueenMoves = (coord, color) => {
    const tempMoves = [coord];
    const generateUpRight = () => {
      const tempUpRightMoves = [];
      let num = 0;
      for (let i = coord[0] - 1; i >= 0; i -= 1) {
        num += 1;
        const newCoord = coord[1] + num;
        if (newCoord < 8 && newCoord >= 0) {
          if (boardRep[i][newCoord].color === color) {
            break;
          } else if (boardRep[i][newCoord].color === whichColor()) {
            tempUpRightMoves.push([i, coord[1] + num]);
            break;
          }
          tempUpRightMoves.push([i, coord[1] + num]);
        }
      }
      tempMoves.push(...tempUpRightMoves);
    };
    const generateDownRight = () => {
      const tempUpDownMoves = [];
      let num = 0;
      for (let i = coord[0] + 1; i < 8; i += 1) {
        num += 1;
        const newCoord = coord[1] + num;
        if (newCoord < 8 && newCoord >= 0) {
          if (boardRep[i][newCoord].color === color) {
            break;
          } else if (boardRep[i][newCoord].color === whichColor()) {
            tempUpDownMoves.push([i, coord[1] + num]);
            break;
          }
          tempUpDownMoves.push([i, coord[1] + num]);
        }
      }
      tempMoves.push(...tempUpDownMoves);
    };
    const generateDownLeft = () => {
      const tempDownLefttMoves = [];
      let num = 0;
      for (let i = coord[0] + 1; i < 8; i += 1) {
        num += 1;
        const newCoord = coord[1] - num;
        if (newCoord < 8 && newCoord >= 0) {
          if (boardRep[i][newCoord].color === color) {
            break;
          } else if (boardRep[i][newCoord].color === whichColor()) {
            tempDownLefttMoves.push([i, coord[1] - num]);
            break;
          }
          tempDownLefttMoves.push([i, coord[1] - num]);
        }
      }
      tempMoves.push(...tempDownLefttMoves);
    };
    const generateUpLeft = () => {
      const tempUpLeftMoves = [];
      let num = 0;
      for (let i = coord[0] - 1; i >= 0; i -= 1) {
        num += 1;
        const newCoord = coord[1] - num;
        if (newCoord < 8 && newCoord >= 0) {
          if (boardRep[i][newCoord].color === color) {
            break;
          } else if (boardRep[i][newCoord].color === whichColor()) {
            tempUpLeftMoves.push([i, coord[1] - num]);
            break;
          }
          tempUpLeftMoves.push([i, coord[1] - num]);
        }
      }
      tempMoves.push(...tempUpLeftMoves);
    };
    const generateUp = () => {
      const tempUpMoves = [];
      for (let i = coord[0] - 1; i >= 0; i -= 1) {
        if (boardRep[i][coord[1]].color === color) {
          break;
        } else if (boardRep[i][coord[1]].color === whichColor()) {
          tempUpMoves.push([i, coord[1]]);
          break;
        }
        tempUpMoves.push([i, coord[1]]);
      }
      tempMoves.push(...tempUpMoves);
    };
    const generateDown = () => {
      const tempDownMoves = [];
      for (let i = coord[0] + 1; i < 8; i += 1) {
        if (boardRep[i][coord[1]].color === color) {
          break;
        } else if (boardRep[i][coord[1]].color === whichColor()) {
          tempDownMoves.push([i, coord[1]]);
          break;
        }
        tempDownMoves.push([i, coord[1]]);
      }
      tempMoves.push(...tempDownMoves);
    };
    const generateRight = () => {
      const tempRightMoves = [];
      for (let i = coord[1] + 1; i < 8; i += 1) {
        if (boardRep[coord[0]][i].color === color) {
          break;
        } else if (boardRep[coord[0]][i].color === whichColor()) {
          tempRightMoves.push([coord[0], i]);
          break;
        }
        tempRightMoves.push([coord[0], i]);
      }
      tempMoves.push(...tempRightMoves);
    };
    const generateLeft = () => {
      const tempLeftMoves = [];
      for (let i = coord[1] - 1; i >= 0; i -= 1) {
        if (boardRep[coord[0]][i].color === color) {
          break;
        } else if (boardRep[coord[0]][i].color === whichColor()) {
          tempLeftMoves.push([coord[0], i]);
          break;
        }
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
    const filteredCoord = tempMoves.filter(
      (move) => coord.toString() !== move.toString(),
    );
    setActiveLegalMoves(filteredCoord, color);
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
