/* @flow */
import React from 'react';
import classNames from 'classnames';

type Props = {
  tag: string,
  children: number | string | React.Element | Array<any>,
  className?: string,
  unselectedClassName?: string,
  selectedClassName?: string,
  value: any,
  data?: any
};

class Option extends React.Component {
  props: Props;

  static displayName = "Chooser.Option";

  static contextTypes = {
    chooser: PropTypes.object.isRequired
  };

  static defaultProps = {
    tag: 'div'
  };

  render() {
    const selectionClasses = this.context.chooser.isSelected(this.props.value) ? this.props.selectedClassName : this.props.unselectedClassName;
    const classes = classNames(this.props.className, selectionClasses);

    return React.createElement(this.props.tag, { className: classes, onClick: this.handleClick }, this.props.children);
  }

  handleClick = (evt) => {
    evt.preventDefault();

    this.context.chooser.handleChoiceClick(this.props.value, this.props.data);
  }
}

export default Option;
