/* @flow */
import React from 'react';
type Props = { children: number | string | React.Element | Array<any> };

export default class PageWithContainer extends React.PureComponent {
  props: Props;

  render() {
    return (
      <div className="container">{this.props.children}</div>
    );
  }
}
