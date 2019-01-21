/* @flow */
import React from 'react';
type Props = { children: number | string | React.Element | Array<any> };

export default class Header extends React.PureComponent {
  props: Props;

  static displayName = "Menu.Header";

  render() {
    return (
      <div className="border border-gray bg-silver py2 px3 semi-bold rounded-top line-height-4">
        {this.props.children}
      </div>
    );
  }
}
