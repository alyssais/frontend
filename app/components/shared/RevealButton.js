/* @flow */
import React from 'react';

import Button from './Button';

type Props = {
  caption?: number | string | React.Element | Array<any>,
  children?: number | string | React.Element | Array<any>
};

class RevealButton extends React.Component {
  props: Props;

  static defaultProps = {
    caption: 'Reveal'
  };

  state = {
    revealed: false
  };

  handleRevealClick = (evt) => {
    evt.preventDefault();

    this.setState(
      { revealed: true },
      () => {
        let range, selection;
        if (this._contentElement) {
          range = document.createRange();
          range.selectNodeContents(this._contentElement);

          selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    );
  };

  render() {
    if (this.state.revealed) {
      return (
        <div className="rounded border border-gray p1" ref={(element) => this._contentElement = element}>{this.props.children}</div>
      );
    }

    return (
      <Button onClick={this.handleRevealClick} outline={true} theme="default">{this.props.caption}</Button>
    );
  }
}

export default RevealButton;
