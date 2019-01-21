/* @flow */
import React from 'react';

type Props = {
  href: string,
  children: number | string | React.Element | Array<any>
};

export default class Link extends React.PureComponent {
  props: Props;

  static displayName = "Footer.Link";

  render() {
    return (
      <a href={this.props.href} className={`btn semi-bold hover-lime`}>{this.props.children}</a>
    );
  }
}
