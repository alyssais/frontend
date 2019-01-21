/* @flow */
import React from 'react';
import classNames from 'classnames';

import FormInputErrors from './FormInputErrors';
import FormInputHelp from './FormInputHelp';

type Props = {
  label: number | string | React.Element | Array<any>,
  name?: string,
  defaultChecked?: boolean,
  checked?: boolean,
  help?: number | string | React.Element | Array<any>,
  disabled?: boolean,
  onChange?: Function,
  errors?: Array<any>
};

export default class FormCheckbox extends React.PureComponent {
  props: Props;

  render() {
    return (
      <div className="mb2">
        <label className="inline-block pl4 cursor-pointer">
          <input
            name={this.props.name}
            type="checkbox"
            defaultChecked={this.props.defaultChecked}
            checked={this.props.checked}
            onChange={this.props.onChange}
            className="absolute checkbox"
            style={{
              marginLeft: "-20px",
              cursor: this.props.disabled ? "not-allowed" : "inherit"
            }}
            disabled={this.props.disabled}
            ref={(_checkbox) => this._checkbox = _checkbox}
          />
          <span className={classNames('semi-bold', { red: this._hasErrors() })}>{this.props.label}</span><br />
          <FormInputHelp>{this.props.help}</FormInputHelp>
        </label>
        <FormInputErrors errors={this.props.errors} />
      </div>
    );
  }

  _hasErrors() {
    return this.props.errors && this.props.errors.length > 0;
  }
}
