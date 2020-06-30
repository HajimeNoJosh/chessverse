import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Square.scss';

export const Square = ({
  color,
  coord,
  type,
  pieceColor,
  children,
  onClick,
  isAttacked,
  moved,
  isActive,
}) => (
  <button
    onClick={() => onClick(coord, type, pieceColor, moved)}
    className={classnames(
      'square',
      `square__${color}`,
      isAttacked && `square__atacked--${isAttacked}`,
      isActive && `square__isActive`,
    )}
    type="button"
  >
    {children}
  </button>
);

Square.propTypes = {
  color: PropTypes.oneOf(['white', 'black']),
  children: PropTypes.node,
  onClick: PropTypes.func,
  coord: PropTypes.array,
  type: PropTypes.string,
  isAttacked: PropTypes.string,
  pieceColor: PropTypes.string,
  moved: PropTypes.bool,
  isActive: PropTypes.bool,
};

Square.defaultProps = {};
