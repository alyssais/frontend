/* @flow */
/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';

import Favorite from '../../../app/components/icons/Favorite';

type Props = { favorited: boolean };

// Make a real button so we can test what it's really like
class FavoriteButton extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = { favorited: props.favorited };
  }
  props: Props;
  shouldComponentUpdate() { return true; }
  render() {
    return (
      <button className="btn p0 dark-gray line-height-0" onClick={this.handleClick}>
        <Favorite favorite={this.state.favorited} />
      </button>
    );
  }
  handleClick = () => {
    this.setState({ favorited: !this.state.favorited });
  }
}

storiesOf('Icons', module)
  .add('Favorite', () => <FavoriteButton favorited={true} />);

export const Sketch = () => (
  <div>
    <span data-sketch-symbol="Icons/Favorite/On"><FavoriteButton favorited={true} /></span>
    <span data-sketch-symbol="Icons/Favorite/Off"><FavoriteButton favorited={false} /></span>
  </div>
);