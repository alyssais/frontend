/* @flow */
import React from 'react';
import classNames from 'classnames';

type Props = {
  children: number | string | React.Element | Array<any>,
  className?: string
};

export default class ErrorMessage extends React.PureComponent {
  props: Props;

  static displayName = "Autocomplete.ErrorMessage";

  render() {
    const classes = classNames(this.props.className, "px2 py2 dark-gray");

    return (
      <li className={classes}>{this.props.children}</li>
    );
  }
}
