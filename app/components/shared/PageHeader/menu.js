/* @flow */
import React from 'react';
import classNames from 'classnames';

type Props = {
  children: number | string | React.Element | Array<any>,
  className?: string
};

export default class Menu extends React.PureComponent {
  props: Props;
  static displayName = 'PageHeader.Menu';

  render() {
    const { className, children } = this.props;

    return (
      <div className={classNames('flex items-center', className)}>
        {children}
      </div>
    );
  }
}