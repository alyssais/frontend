/* @flow */
import React from 'react';

import Spinner from 'app/components/shared/Spinner';

type Props = {};

export default class Loader extends React.PureComponent {
  props: Props;
  static displayName = "Autocomplete.Loader";

  render() {
    return (
      <li className="center py3"><Spinner /></li>
    );
  }
}
