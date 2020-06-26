import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Game } from './Game';

configure({ adapter: new Adapter() });

describe('Game', () => {
  it('renders correctly', () => {
    shallow(<Game />);
  });
});
