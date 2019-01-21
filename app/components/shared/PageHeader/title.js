/* @flow */
import React from 'react';
import classNames from 'classnames';

type Props = {
  children: number | string | React.Element | Array<any>,
  className?: string
};

class Title extends React.PureComponent {
  props: Props;

  static displayName = "PageHeader.Title";

  render() {
    return (
      <h1 className={classNames('h1 m0 p0', this.props.className)}>
        {this.props.children}
      </h1>
    );
  }
}

export default Title;
