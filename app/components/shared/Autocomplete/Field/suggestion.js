/* @flow */
import React from 'react';
import classNames from 'classnames';

type Props = {
  children: number | string | React.Element | Array<any>,
  selected: boolean,
  suggestion: Object,
  onMouseOver: Function,
  onMouseDown: Function,
  className?: string
};

class Suggestion extends React.Component {
  props: Props;

  static displayName = "AutocompleteField.Suggestion";

  static childContextTypes = {
    autoCompletorSuggestion: PropTypes.object
  };

  // Pass suggestion information down to the children of this component so they
  // can handle `selected` highlights if they want
  getChildContext() {
    return {
      autoCompletorSuggestion: {
        selected: this.props.selected,
        data: this.props.suggestion
      }
    };
  }

  render() {
    const classes = classNames(this.props.className, "px2 py1", {
      "bg-blue white": this.props.selected
    });

    return (
      <li className={classes} onMouseDown={this.handleMouseDown} onMouseOver={this.handleMouseOver}>
        {this.props.children}
      </li>
    );
  }

  handleMouseDown = (evt) => {
    evt.preventDefault();
    this.props.onMouseDown(this.props.suggestion);
  }

  handleMouseOver = () => {
    this.props.onMouseOver(this.props.suggestion);
  }
}

export default Suggestion;
