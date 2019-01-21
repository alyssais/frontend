/* @flow */
import React from 'react';
type Props = { children: number | string | React.Element | Array<any> };

export default class PermissionSelectOptionDescriptions extends React.PureComponent {
  props: Props;

  render() {
    return (
      <div className="pointer-events-none" style={{ marginTop: 8, marginLeft: -4 }}>
        {this.props.children}
      </div>
    );
  }
}
