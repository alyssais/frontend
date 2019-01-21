/* @flow */
import React from 'react';
import classNames from 'classnames';

export type Props = {
  className?: string,
  children?: number | string | React.Element | Array<any>
};

const FormInputHelp = (props: Props) => {
  const { className, children, ...props } = props;
  if (!children) {
    return null;
  }

  return (
    <p
      className={classNames('mt1 mb0 p0 dark-gray', className)}
      {...props}
    >
      {children}
    </p>
  );
};

export default FormInputHelp;
