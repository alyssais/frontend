/* @flow */
import React from 'react';

type Props = {
  id: number | string | React.Element | Array<any>,
  values?: Array<string>
};

class FormDataList extends React.PureComponent {
  props: Props;

  render() {
    return (
      <datalist id={this.props.id}>
        {this.props.values.map((value) => <option key={value} value={value} />)}
      </datalist>
    );
  }
}

export default FormDataList;
