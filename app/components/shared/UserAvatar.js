/* @flow */
import React from 'react';
import classNames from 'classnames';

type Props = {
  user: {
    name: string,
    avatar?: { url: string }
  },
  className?: string,
  style?: Object
};

export default class UserAvatar extends React.PureComponent {
  props: Props;

  render() {
    return (
      <img
        src={this.props.user.avatar.url}
        className={classNames("circle border border-gray bg-white", this.props.className)}
        alt={this.props.user.name}
        title={this.props.user.name}
        style={this.props.style}
      />
    );
  }
}
