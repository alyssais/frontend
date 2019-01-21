/* @flow */
import React from 'react';

import BaseButton from 'app/components/shared/Button';

type Props = { children: number | string | React.Element | Array<any> };

export default class Button extends React.PureComponent {
  props: Props;

  static displayName = "PageHeader.Button";

  render() {
    return (
      <BaseButton {...this.props} theme="default" outline={true} className="ml1">{this.props.children}</BaseButton>
    );
  }
}
