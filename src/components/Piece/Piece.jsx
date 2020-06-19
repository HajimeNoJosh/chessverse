import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Piece.scss';

import BlackPawn from '../../assets/svg/blackpawn.svg';
import WhitePawn from '../../assets/svg/whitepawn.svg';
import BlackKnight from '../../assets/svg/blackknight.svg';
import WhiteKnight from '../../assets/svg/whiteknight.svg';
import BlackBishop from '../../assets/svg/blackbishop.svg';
import WhiteBishop from '../../assets/svg/whitebishop.svg';
import BlackRook from '../../assets/svg/blackrook.svg';
import WhiteRook from '../../assets/svg/whiterook.svg';
import BlackQueen from '../../assets/svg/blackqueen.svg';
import WhiteQueen from '../../assets/svg/whitequeen.svg';
import BlackKing from '../../assets/svg/blackking.svg';
import WhiteKing from '../../assets/svg/whiteking.svg';

function getPiece(type, color) {
  if (color === 'white') {
    switch (type) {
      case 'pawn':
        return <WhitePawn />;
      case 'knight':
        return <WhiteKnight />;
      case 'bishop':
        return <WhiteBishop />;
      case 'rook':
        return <WhiteRook />;
      case 'queen':
        return <WhiteQueen />;
      case 'king':
        return <WhiteKing />;
      default:
        return null;
    }
  } else if (color === 'black') {
    switch (type) {
      case 'pawn':
        return <BlackPawn />;
      case 'knight':
        return <BlackKnight />;
      case 'bishop':
        return <BlackBishop />;
      case 'rook':
        return <BlackRook />;
      case 'queen':
        return <BlackQueen />;
      case 'king':
        return <BlackKing />;
      default:
        return null;
    }
  } else {
    return null;
  }
}

export const Piece = ({ type, color }) => (
  <span className={classnames('piece')}>{getPiece(type, color)}</span>
);

Piece.propTypes = {
  type: PropTypes.oneOf(['knight', 'bishop', 'rook', 'pawn', 'queen', 'king']),
  color: PropTypes.oneOf(['white', 'black']),
};

Piece.defaultProps = {};
