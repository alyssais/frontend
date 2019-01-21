/* @flow */
import React from 'react';

import Spinner from './Spinner';

type Props = {};

export default class SectionLoader extends React.PureComponent {
  props: Props;
  render() {
    return (
      <div className="center my4">
        <Spinner />
      </div>
    );
  }
}
