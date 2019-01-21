/* @flow */
import React from 'react';

import parseEmoji from 'app/lib/parseEmoji';

type Props = {
  text?: string,
  title?: string,
  className?: string,
  style?: Object
};

export default class Emojify extends React.PureComponent {
  props: Props;

  render() {
    const spanProps = {};
    const html = parseEmoji(this.props.text);

    if (html !== this.props.text) {
      spanProps.dangerouslySetInnerHTML = { __html: html };
      spanProps.title = this.props.text;
    } else {
      spanProps.children = this.props.text;
    }

    if (this.props.title) {
      spanProps.title = this.props.title;
    }

    return (
      <span
        className={this.props.className}
        style={this.props.style}
        {...spanProps}
      />
    );
  }
}
