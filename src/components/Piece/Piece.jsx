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

function getPiece(type) {
  switch (type) {
    case 'Whp':
      return <WhitePawn />;
    case 'Whn':
      return <WhiteKnight />;
    case 'Whb':
      return <WhiteBishop />;
    case 'Whr':
      return <WhiteRook />;
    case 'Whq':
      return <WhiteQueen />;
    case 'Whk':
      return <WhiteKing />;
    case 'Blp':
      return <BlackPawn />;
    case 'Bln':
      return <BlackKnight />;
    case 'Blb':
      return <BlackBishop />;
    case 'Blr':
      return <BlackRook />;
    case 'Blq':
      return <BlackQueen />;
    case 'Blk':
      return <BlackKing />;
    default:
      return null;
  }
}

export const Piece = ({ type }) => (
  <span className={classnames('piece')}>{getPiece(type)}</span>
);

Piece.propTypes = {
  type: PropTypes.oneOf([
    'Whp',
    'Whn',
    'Whb',
    'Whr',
    'Whq',
    'Whk',
    'Blp',
    'Bln',
    'Blb',
    'Blr',
    'Blq',
    'Blk',
    '',
  ]),
};

Piece.defaultProps = {};
