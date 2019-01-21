/* @flow */
import React from 'react';
import classNames from 'classnames';

import Icon from './Icon';
import Spinner from './Spinner';

type Props = {
  className?: string,
  style?: Object,
  onChange: Function,
  onKeyDown?: Function,
  onFocus?: Function,
  onBlur?: Function,
  defaultValue?: string,
  placeholder: string,
  borderless: boolean,
  searching: boolean,
  autofocus: boolean
};

export default class SearchField extends React.PureComponent {
  props: Props;

  static defaultProps = {
    placeholder: 'Search…',
    borderless: false,
    searching: false,
    autofocus: false
  };

  state = {
    value: ''
  }

  // NOTE: We make the input a controlled component within the
  // context of the search field so that usages can reset the value
  // via defaultValue without controlling the entire component themselves
  UNSAFE_componentWillMount() {
    if (this.props.defaultValue) {
      this.setState({ value: this.props.defaultValue });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState({ value: nextProps.defaultValue || '' });
    }
  }

  componentDidMount() {
    if (this.props.autofocus) {
      this.focus();
    }
  }

  clear() {
    this._inputNode.value = '';
  }

  focus() {
    this._inputNode && this._inputNode.focus();
  }

  blur() {
    this._inputNode && this._inputNode.blur();
  }

  render() {
    const wrapperClassName = classNames(
      'relative',
      { 'dark-gray': !this.state.value },
      this.props.className
    );

    return (
      <div
        className={wrapperClassName}
        style={this.props.style}
      >
        {this.renderIcon()}
        <input
          type="text"
          className={classNames('input', { borderless: this.props.borderless })}
          style={{
            margin: 0,
            paddingLeft: '2em'
          }}
          ref={(_inputNode) => this._inputNode = _inputNode}
          value={this.state.value}
          onChange={this.handleInputChange}
          onKeyDown={this.props.onKeyDown}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }

  renderIcon() {
    const iconSize = '1em';
    const className = 'absolute pointer-events-none';
    const style = { left: '.75em', top: '.68em' };

    if (this.props.searching) {
      return (
        <Spinner
          size={iconSize}
          color={false}
          className={className}
          style={style}
        />
      );
    }

    return (
      <Icon
        icon="search"
        className={className}
        style={{
          color: 'currentColor',
          width: iconSize,
          height: iconSize,
          ...style
        }}
      />
    );
  }

  handleInputChange = (evt) => {
    // Get a copy of the target otherwise the event will be cleared between now
    // and when the timeout happens
    const { value } = evt.target;

    // If a timeout is already present, clear it since the user is still typing
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    // Update the component-level state immediately, so keypresses aren't swallowed
    this.setState({ value });

    // Instead of doing a search on each keypress, do it a few ms after they've
    // stopped typing
    this._timeout = setTimeout(() => {
      this.props.onChange(value);
      delete this._timeout;
    }, 100);
  };
}
