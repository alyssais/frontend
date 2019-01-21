/* @flow */
import React from 'react';
import classNames from 'classnames';

type Props = {
  style?: Object,
  className?: string,
  children?: number | string | React.Element | Array<any>,
  onMouseEnter?: Function
};

export default class DropdownButton extends React.PureComponent {
  props: Props;

  static displayName = "Navigation.DropdownButton";

  render() {
    return (
      <button style={this.props.style} className={classNames("btn black hover-lime focus-lime semi-bold line-height-3", this.props.className)} onMouseEnter={this.props.onMouseEnter}>
        <div className="flex items-center flex-none">
          {this.props.children}
        </div>
      </button>
    );
  }
}
