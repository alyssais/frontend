/* @flow */
import React from 'react';

import Option from './option';
import SelectOption from './select-option';

type Props = {
  children: number | string | React.Element | Array<any>,
  className?: string,
  multiple?: boolean,
  selected?: any,
  onSelect: Function
};

class Chooser extends React.Component {
  props: Props;

  static childContextTypes = {
    chooser: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      chooser: this
    };
  }

  render() {
    return (
      <section className={this.props.className}>
        {this.props.children}
      </section>
    );
  }

  isSelected(value) {
    if (this.props.multiple) {
      return this.props.selected.indexOf(value) >= 0;
    }

    return this.props.selected === value;
  }

  handleChoiceClick = (value, data) => {
    this.props.onSelect(value, data);
  }
}

Chooser.Option = Option;
Chooser.SelectOption = SelectOption;

export default Chooser;
