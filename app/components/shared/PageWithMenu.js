/* @flow */
import React from 'react';
type Props = { children: number | string | React.Element | Array<any> };

export default class PageWithMenu extends React.PureComponent {
  props: Props;

  render() {
    const children = React.Children.toArray(this.props.children);

    return (
      <div className="container">
        <div className="clearfix mxn2">
          <div className="md-col md-col-3 px2">
            {children[0]}
          </div>
          <div className="md-col md-col-9 px2">
            {children.slice(1)}
          </div>
        </div>
      </div>
    );
  }
}
