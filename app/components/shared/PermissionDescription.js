/* @flow */
import React from 'react';

import Icon from './Icon';

type Props = {
  allowed: boolean,
  permission: string
};

export default class PermissionDescription extends React.PureComponent {
  props: Props;

  render() {
    const { allowed, permission } = this.props;

    const icon = allowed ? 'permission-small-tick' : 'permission-small-cross';
    const words = allowed ? `Can ${permission}.` : `Can not ${permission}.`;

    return (
      <div className="flex mt1" style={{ lineHeight: 1.4 }}>
        <Icon icon={icon} className="dark-gray flex-none" style={{ width: 16, height: 16, marginRight: 3 }} />
        {words}
      </div>
    );
  }
}