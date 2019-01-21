/* @flow */
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

const DivWithSlightRightMargin = styled('div').attrs({
  className: 'align-middle'
})`
  /* Slightly less than the mr3 (15px) */
  margin-right: 13px;
`;

type Props = {
  children: number | string | React.Element | Array<any>,
  className?: string
};

export default class Icon extends React.PureComponent {
  props: Props;
  static displayName = 'PageHeader.Icon';

  render() {
    const { className, children } = this.props;

    return (
      <DivWithSlightRightMargin className={classNames('flex items-center align-middle', className)}>
        {children}
      </DivWithSlightRightMargin>
    );
  }
}