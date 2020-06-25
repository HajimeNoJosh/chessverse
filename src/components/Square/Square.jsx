import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Square.scss';

export const Square = ({ color, coord, type, children, onClick, isActive }) => (
  <button
    onClick={() => onClick(coord, type)}
    className={classnames(
      'square',
      `square__${color}`,
      isActive && `square__active`,
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
  isActive: PropTypes.bool,
};

Square.defaultProps = {};
