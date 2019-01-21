/* @flow */
import React from 'react';
import classNames from 'classnames';

type Props = {
  label: number | string | React.Element | Array<any>,
  children?: number | string | React.Element | Array<any>,
  errors?: boolean,
  required?: boolean
};

class FormInputLabel extends React.PureComponent {
  props: Props;

  render() {
    return (
      <label>
        <div className={classNames("bold mb1", { "red": this.props.errors })}>
          {this.props.label}
          {this.props.required && <span className="dark-gray h6 semi-bold"> — Required</span>}
        </div>
        {this.props.children}
      </label>
    );
  }
}

export default FormInputLabel;
