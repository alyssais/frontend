/* @flow */
import React from 'react';
import classNames from 'classnames';

import Button from 'app/components/shared/Button';

type Props = {
  children: number | string | React.Element | Array<any>,
  suggestion: Object,
  onSelect: Function,
  selectLabel: string,
  className?: string
};

export default class Suggestion extends React.PureComponent {
  props: Props;

  static displayName = "AutocompleteDialog.Suggestion";

  static defaultProps = {
    selectLabel: "Select"
  };

  render() {
    const classes = classNames("px4 py2 flex", this.props.className);

    return (
      <li className={classes}>
        <div className="flex-auto">
          {this.props.children}
        </div>
        <Button
          onClick={this.handleSelectClick}
          className="ml2 flex-none"
          outline={true}
          theme="default"
        >
          {this.props.selectLabel}
        </Button>
      </li>
    );
  }

  handleSelectClick = (evt) => {
    evt.preventDefault();
    this.props.onSelect(this.props.suggestion);
  }
}
