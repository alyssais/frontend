// @flow

import PropTypes from 'prop-types';
import React from 'react';
import { getTypeInfo, types as CardType } from 'credit-card-type';

import CreditCardInput from 'app/components/shared/CreditCardInput';
import labelled from 'app/components/shared/labelledFormComponent';
const FormCreditCardField = labelled(CreditCardInput);

import FormInputLabel from 'app/components/shared/FormInputLabel';
import FormInputErrors from 'app/components/shared/FormInputErrors';
import FormTextField from 'app/components/shared/FormTextField';
import FormSelect from 'app/components/shared/FormSelect';

import ValidationErrors from 'app/lib/ValidationErrors';

type Props = {
  onChange: Function,
  errors?: Array<Object>,
  disabled?: boolean
};

type State = {
  type: ?string
};

class BillingCreditCardForm extends React.Component<Props, State> {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.array,
    disabled: PropTypes.bool
  };

  state = {
    type: null
  }

  render() {
    const cardInfo = getTypeInfo(this.state.type);
    const errors = new ValidationErrors(this.props.errors);

    return (
      <div>
        <div className="ml3 mt3 mr3 mb2">
          <FormTextField
            label="Name on Card"
            autoComplete="cc-name"
            required={true}
            disabled={this.props.disabled}
            onChange={this.handleNameChange}
            errors={errors.findForField("name")}
          />
        </div>

        <div className="clearfix px2">
          <div className="lg-col lg-col-7 px1 flex items-top">
            <div className="flex-auto">
              <FormCreditCardField
                label="Card Number"
                className="tabular-numerals"
                required={true}
                disabled={this.props.disabled}
                onChange={this.handleCardNumberChange}
                errors={errors.findForField("number")}
              />
            </div>

            <div style={{ marginTop: 27 }} className="ml1">
              {this.renderCreditCardLogo(CardType.VISA)}
              {this.renderCreditCardLogo(CardType.MASTERCARD)}
              {this.renderCreditCardLogo(CardType.AMERICAN_EXPRESS)}
            </div>
          </div>

          <div className="sm-col sm-col-8 lg-col lg-col-3 px1">
            <div className="mb2">
              <FormInputLabel label="Expiration" required={true} />

              <div className="flex items-center">
                {this.renderMonthSelect()}
                <div className="dark-gray bold center" style={{ width: 25 }}>/</div>
                {this.renderYearSelect()}
              </div>

              {this.renderExpiryError(errors)}
            </div>
          </div>

          <div className="sm-col sm-col-4 lg-col lg-col-2 px1">
            <FormTextField
              label={cardInfo ? cardInfo.code.name : 'Code'}
              maxLength={cardInfo ? cardInfo.code.size : 4}
              className="tabular-numerals"
              autoComplete="cc-csc"
              type="tel"
              name="cvc"
              required={true}
              disabled={this.props.disabled}
              onChange={this.handleCVCChange}
              errors={errors.findForField("cvc")}
            />
          </div>
        </div>

        <div className="clearfix px2 mb2">
          <div className="lg-col lg-col-9 px1">
            <FormSelect
              label="Country"
              options={window._billing.countries}
              required={true}
              disabled={this.props.disabled}
              onChange={this.handleCountryChange}
              errors={errors.findForField("country")}
            />
          </div>

          <div className="lg-col lg-col-3 px1">
            <FormTextField
              label="Postal Code"
              required={true}
              disabled={this.props.disabled}
              onChange={this.handlePostCodeChange}
              errors={errors.findForField("postcode")}
            />
          </div>
        </div>
      </div>
    );
  }

  renderExpiryError(errors: Object) {
    const errorMessages = ['month', 'year'].reduce(
      (acc, field) => (acc.concat(errors.findForField(field))),
      []
    );

    return (
      <FormInputErrors errors={errorMessages} />
    );
  }

  renderMonthSelect() {
    return (
      <div className="flex-auto flex">
        <select className="select flex-auto" autoComplete="cc-exp-month" onChange={this.handleMonthChange} disabled={this.props.disabled}>
          <option />
          <option value="1">01</option>
          <option value="2">02</option>
          <option value="3">03</option>
          <option value="4">04</option>
          <option value="5">05</option>
          <option value="6">06</option>
          <option value="7">07</option>
          <option value="8">08</option>
          <option value="9">09</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
      </div>
    );
  }

  renderYearSelect() {
    const year = new Date().getFullYear();

    const options = [];
    for (let yy = year; yy <= (year + 10); yy++) {
      options.push(
        <option key={yy} value={yy}>{yy - 2000}</option>
      );
    }

    return (
      <div className="flex-auto flex">
        <select className="select flex-auto" autoComplete="cc-exp-year" onChange={this.handleYearChange} disabled={this.props.disabled}>
          <option />
          {options}
        </select>
      </div>
    );
  }

  renderCreditCardLogo(type: string) {
    return (
      <img
        src={require(`./card-${type}.svg`)}
        alt={getTypeInfo(type).niceType}
        style={{
          height: 30,
          width: 48,
          transition: 'opacity 200ms ease-in-out',
          opacity: (this.state.type === type) ? 1 : 0.3
        }}
        className="ml1"
      />
    );
  }

  handleNameChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.onChange('name', event.target.value);
  };

  handleCardNumberChange = (cardNumber: string, type: string) => {
    this.setState({ type });

    this.props.onChange('number', cardNumber);
    this.props.onChange('type', type);
  };

  handleMonthChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.onChange('month', event.target.value);
  };

  handleYearChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.onChange('year', event.target.value);
  };

  handleCVCChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.onChange('cvc', event.target.value);
  };

  handleCountryChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.onChange('country', event.target.value);
  };

  handlePostCodeChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.onChange('postcode', event.target.value);
  };
}

export default BillingCreditCardForm;
