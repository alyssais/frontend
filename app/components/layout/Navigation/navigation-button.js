/* @flow */
import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

type Props = {
  style?: Object,
  className?: string,
  linkIf?: boolean,
  href?: string,
  children?: number | string | React.Element | Array<any>,
  onClick?: Function
};

export default class NavigationButton extends React.PureComponent {
  props: Props;

  static displayName = "Navigation.NavigationButton";

  static defaultProps = {
    linkIf: false
  };

  // NOTE: This uses PureComponent despite using `this.context`
  // as it is *not* possible for a single component instance to
  // move to or from a Router-controlled context in one lifetime
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    const props = {
      style: this.props.style,
      className: classNames("btn black hover-lime focus-lime flex items-center flex-none semi-bold", this.props.className),
      onClick: this.props.onClick
    };

    // If we've requested a link instead of a href (a link is used to navigate
    // through react-router, instead of a regular href) and context.router is
    // present (which means the routing gear has been activated) then create a
    // react-router link - otherwise, just fallback to a regular href.
    if (this.props.linkIf && this.context.router) {
      return (
        <Link to={this.props.href} {...props}>{this.props.children}</Link>
      );
    }

    return (
      <a href={this.props.href} {...props}>{this.props.children}</a>
    );
  }
}
