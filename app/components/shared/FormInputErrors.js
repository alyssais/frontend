/* @flow */
import React from 'react';
import classNames from 'classnames';

export type Props = {
  className?: string,
  errors?: Array<number | string | React.Element | Array<any>>
};

const FormInputErrors = (props: Props) => {
  const { className, errors, ...props } = props;
  if (errors.length < 1) {
    return null;
  }

  return (
    <p className={classNames('mt1 mb2 p0 red', className)} {...props}>
      {errors.reduce(
        (acc, item, index) => {
          const separator = (
            index > 0
              ? [', ']
              : []
          );

          return acc.concat(separator).concat([item]);
        },
        []
      )}
    </p>
  );
};

FormInputErrors.defaultProps = {
  errors: []
};

export default FormInputErrors;
