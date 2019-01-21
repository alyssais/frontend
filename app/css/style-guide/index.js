/* @flow */
import React from 'react';

import Typography from './typography';

export type Props = { children?: number | string | React.Element | Array<any> };

const Section = function(props: Props) {
  return <div className="my4">{props.children}</div>;
};

// Useful when authoring our base CSS styles
//
// We don't yet have a static page/route to render this, so at the moment
// you just have to insert it into pages as you need it.
//
// For example:
//
//   import CSSStyleGuide from '../../css/style-guide';
//
//   class SomeComponent extends React.Component {
//     render() {
//       return (
//         <div>
//           <CSSStyleGuide />
//         </div>
//       );
//     }
//   }
export default class CSSStyleGuide extends React.PureComponent {
  render() {
    return (
      <div>
        <Section><Typography /></Section>
      </div>
    );
  }
}
