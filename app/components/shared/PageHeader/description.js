/* @flow */
import React from 'react';
import classNames from 'classnames';

type Props = {
  children: number | string | React.Element | Array<any>,
  className?: string
};

export default class Description extends React.PureComponent {
  props: Props;
  static displayName = 'PageHeader.Description';

  render() {
    const { className, children } = this.props;

    return (
      <div className={classNames('dark-gray mt1 max-width-2', className)}>
        {children}
      </div>
    );
  }
}
