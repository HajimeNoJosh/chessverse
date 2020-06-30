import React, { useReducer } from 'react';

import { AppStates } from '../../app/states';
import './Game.scss';
import { Board } from '../Board/Board';
import { boardInitialize } from './BoardInitialize';

const initialState = {
  boardRep: boardInitialize(),
  legalMovesBoard: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ],
  appState: AppStates.Initial,
  currentPiece: '',
  firstClick: true,
  player: 'white',
  firstCoord: [],
  legalMoves: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'setPlayerBlack':
      return {
        ...state,
        player: 'black',
      };
    case 'setPlayerWhite':
      return {
        ...state,
        player: 'white',
      };
    case 'illegalMove':
      return {
        ...state,
        boardRep: action.copyBoardRep,
        player: state.currentPiece.color,
        curentPiece: '',
        firstCoord: [],
        legalMoves: [],
        legalMovesBoard: [
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
        ],
        firstClick: true,
      };
    case 'clearLegalMoves':
      return {
        ...state,
        legalMoves: [],
        legalMovesBoard: [
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
        ],
      };
    case 'firstClick':
      return {
        ...state,
        currentPiece: {
          type: action.pieceClicked.type,
          color: action.pieceClicked.color,
          moved: action.pieceClicked.moved,
        },
        firstCoord: action.pieceClicked.coord,
        appState: AppStates.Play,
      };
    case 'sameSquare':
      return {
        ...state,
        currentPiece: '',
        firstCoord: [],
      };
    case 'secondClick':
      return {
        ...state,
        currentPiece: '',
        firstCoord: [],
      };
    case 'endClick':
      return {
        ...state,
        firstClick: !state.firstClick,
        boardRep: action.copyBoardRep,
      };
    case 'movesForPieces':
      return {
        ...state,
        legalMoves: action.moves,
      };
    case 'legalMovesBoard':
      return {
        ...state,
        legalMovesBoard: action.copyLegalMoves,
      };

    default:
      throw new Error();
  }
}

export const Game = () => {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  const {
    boardRep,
    legalMovesBoard,
    currentPiece,
    firstClick,
    player,
    firstCoord,
    legalMoves,
  } = state;

  const setPlayerTurn = () => {
    if (player === 'white') {
      dispatch({ type: 'setPlayerBlack' });
    } else {
      dispatch({ type: 'setPlayerWhite' });
    }
  };
  // This helper function is for finding the opposite color of the current player
  const whichColor = () => {
    if (player === 'white') {
      return 'black';
    }
    return 'white';
  };

  // Should use reducer helper to change state around as much as I do in this function
  const movePiece = (coord, type, color, moved) => {
    const coordFirst = coord[0];
    const coordSecond = coord[1];
    const copyBoardRep = [...boardRep];

    if ((firstClick && type === '') || (firstClick && color !== player)) {
      return;
    }

    if (!firstClick) {
      if (!checkLegalMove(coord)) {
        copyBoardRep[firstCoord[0]][firstCoord[1]] = {
          isActive: false,
          type: currentPiece.type,
          color: currentPiece.color,
          moved: currentPiece.moved,
        };
        dispatch({ type: 'illegalMove', copyBoardRep });
        return;
      }
      dispatch({ type: 'clearLegalMoves' });
    }

    if (firstClick) {
      copyBoardRep[coordFirst][coordSecond] = {
        isActive: true,
        type,
        color,
      };
      const pieceClicked = { type, color, moved, coord };
      dispatch({ type: 'firstClick', pieceClicked });
    } else if (coord.toString() === firstCoord.toString()) {
      copyBoardRep[coordFirst][coordSecond] = currentPiece;
      dispatch({ type: 'sameSquare' });
    } else {
      const copyCurrentPiece = { ...currentPiece };
      copyCurrentPiece.moved = true;
      copyBoardRep[coordFirst][coordSecond] = copyCurrentPiece;
      copyBoardRep[firstCoord[0]][firstCoord[1]] = '';
      dispatch({ type: 'secondClick' });
      setPlayerTurn();
    }

    dispatch({ type: 'endClick', copyBoardRep });
  };

  // This should not have to exist, there are other ways of doing this

  const continueLoop = (coord, piece, color) => {
    if (piece === 'King') {
      const coordFirst = coord[0];
      const coordSecond = coord[1];
      return (
        boardRep[coordFirst][coordSecond] === '' ||
        boardRep[coordFirst][coordSecond].type === piece ||
        boardRep[coordFirst][coordSecond].color !== color
      );
    }
    const coordFirst = coord[0];
    const coordSecond = coord[1];
    return (
      boardRep[coordFirst][coordSecond] === '' ||
      boardRep[coordFirst][coordSecond].type === piece
    );
  };

  const filterOutOfBoundary = (coord) =>
    coord[0] <= 7 && coord[0] >= 0 && coord[1] <= 7 && coord[1] >= 0;

  // Pawn really needs a refactor

  const getPawnMoves = (coord, color, moved) => {
    const tempMoves = [coord];
    // For taking with pawns
    if (color === 'white') {
      const generateNeighbors = [
        [-1, -1],
        [-1, 1],
      ];

      const pieceReducer = (acc, curr) => [
        ...acc,
        [coord[0] + curr[0], coord[1] + curr[1]],
      ];
      const tempPawnCaptures = generateNeighbors.reduce(pieceReducer, []);
      const inBoundary = tempPawnCaptures.filter((move) =>
        filterOutOfBoundary(move),
      );

      inBoundary.forEach((element) => {
        if (boardRep[element[0]][element[1]].color === 'black') {
          tempMoves.push([element[0], element[1]]);
        }
      });
    } else if (color === 'black') {
      const generateNeighbors = [
        [1, -1],
        [1, 1],
      ];

      const pieceReducer = (acc, curr) => [
        ...acc,
        [coord[0] + curr[0], coord[1] + curr[1]],
      ];
      const tempPawnCaptures = generateNeighbors.reduce(pieceReducer, []);
      const inBoundary = tempPawnCaptures.filter((move) =>
        filterOutOfBoundary(move),
      );

      inBoundary.forEach((element) => {
        if (boardRep[element[0]][element[1]].color === 'white') {
          tempMoves.push([element[0], element[1]]);
        }
      });
    }

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

    const filterOutEmptyArray = tempMoves.filter((move) => move.length !== 0);

    if (filterOutEmptyArray.length > 0) {
      const filterdMoves = filterOutEmptyArray.filter(
        (move) => move.toString() !== coord.toString(),
      );
      setActiveLegalMoves(filterdMoves, color);
    } else {
      setActiveLegalMoves(filterOutEmptyArray, color);
    }
    return filterOutEmptyArray;
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
    const pieceReducer = (acc, curr) => [
      ...acc,
      [coord[0] + curr[0], coord[1] + curr[1]],
    ];
    const tempMoves = generateNeighbors.reduce(pieceReducer, []);

    const inBoundary = tempMoves.filter((move) => filterOutOfBoundary(move));

    const finalMoves = inBoundary.filter((move) =>
      continueLoop(move, 'King', color),
    );

    const filteredCoord = finalMoves.filter(
      (move) => coord.toString() !== move.toString(),
    );
    setActiveLegalMoves(filteredCoord, color);
    return finalMoves;
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
    const pieceReducer = (acc, curr) => [
      ...acc,
      [coord[0] + curr[0], coord[1] + curr[1]],
    ];

    const tempMoves = generateLegalMoves.reduce(pieceReducer, []);

    const inBoundary = tempMoves.filter((move) => filterOutOfBoundary(move));

    const finalLegalMoves = inBoundary.filter(
      (move) => boardRep[move[0]][move[1]].color !== player,
    );

    finalLegalMoves.push(coord);

    const filteredCoord = finalLegalMoves.filter(
      (move) => coord.toString() !== move.toString(),
    );
    setActiveLegalMoves(filteredCoord, color);
    return finalLegalMoves;
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

    const filteredCoord = tempMoves.filter(
      (move) => coord.toString() !== move.toString(),
    );
    setActiveLegalMoves(filteredCoord, color);
    return tempMoves;
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

    const filteredCoord = tempMoves.filter(
      (move) => coord.toString() !== move.toString(),
    );
    setActiveLegalMoves(filteredCoord, color);
    return tempMoves;
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

    const filteredCoord = tempMoves.filter(
      (move) => coord.toString() !== move.toString(),
    );
    setActiveLegalMoves(filteredCoord, color);
    return tempMoves;
  };

  const settingLegalMoves = (coord, type, color, moved) => {
    if (firstClick) {
      if (type === 'Pawn') {
        const moves = getPawnMoves(coord, color, moved);
        dispatch({ type: 'movesForPieces', moves, coord });
      } else if (type === 'King') {
        const moves = getKingMoves(coord, color, moved);
        dispatch({ type: 'movesForPieces', moves });
      } else if (type === 'Knight') {
        const moves = getKnightMoves(coord, color);
        dispatch({ type: 'movesForPieces', moves });
      } else if (type === 'Rook') {
        const moves = getRookMoves(coord, color);
        dispatch({ type: 'movesForPieces', moves });
      } else if (type === 'Bishop') {
        const moves = getBishopMoves(coord, color);
        dispatch({ type: 'movesForPieces', moves });
      } else if (type === 'Queen') {
        const moves = getQueenMoves(coord, color);
        dispatch({ type: 'movesForPieces', moves });
      }
    }
  };

  // Active meaning the squares that the piece can move too are shown to the user

  const setActiveLegalMoves = (tempMoves, color) => {
    if (color === player) {
      const copyLegalMoves = [...legalMovesBoard];
      for (let i = 0; i < tempMoves.length; i += 1) {
        const coord = tempMoves[i];
        if (!boardRep[coord[0]][coord[1]].type) {
          if (
            coord[0] <= 7 &&
            coord[0] >= 0 &&
            coord[1] <= 7 &&
            coord[1] >= 0
          ) {
            copyLegalMoves[coord[0]][coord[1]] = 'noPiece';
            dispatch({ type: 'legalMovesBoard', copyLegalMoves });
          }
        } else if (
          coord[0] <= 7 &&
          coord[0] >= 0 &&
          coord[1] <= 7 &&
          coord[1] >= 0
        ) {
          copyLegalMoves[coord[0]][coord[1]] = 'piece';
          dispatch({ type: 'legalMovesBoard', copyLegalMoves });
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
    settingLegalMoves(coord, type, color, moved);
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
