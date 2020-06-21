import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Square.scss';

export const Square = ({ color, children }) => (
  <div className={classnames('square', `square__${color}`)}>{children}</div>
);

Square.propTypes = {
  color: PropTypes.oneOf(['white', 'black']),
  children: PropTypes.node,
};

Square.defaultProps = {};
