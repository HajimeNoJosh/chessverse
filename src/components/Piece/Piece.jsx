import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
      case 'Pawn':
        return <WhitePawn />;
      case 'Knight':
        return <WhiteKnight />;
      case 'Bishop':
        return <WhiteBishop />;
      case 'Rook':
        return <WhiteRook />;
      case 'Queen':
        return <WhiteQueen />;
      case 'King':
        return <WhiteKing />;
      default:
        return null;
    }
  } else {
    switch (type) {
      case 'Pawn':
        return <BlackPawn />;
      case 'Knight':
        return <BlackKnight />;
      case 'Bishop':
        return <BlackBishop />;
      case 'Rook':
        return <BlackRook />;
      case 'Queen':
        return <BlackQueen />;
      case 'King':
        return <BlackKing />;
      default:
        return null;
    }
  }
}

export const Piece = ({ type, color }) => (
  <span className={classnames('piece')}>{getPiece(type, color)}</span>
);

Piece.propTypes = {
  type: PropTypes.oneOf([
    'Pawn',
    'Knight',
    'Bishop',
    'Rook',
    'Queen',
    'King',
    '',
  ]),
  color: PropTypes.oneOf(['white', 'black']),
};

Piece.defaultProps = {};
