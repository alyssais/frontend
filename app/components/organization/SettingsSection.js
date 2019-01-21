/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';

import PageWithMenu from 'app/components/shared/PageWithMenu';
import SettingsMenu from './SettingsMenu';

type Props = {
  organization: Object,
  children: number | string | React.Element | Array<any>
};

class SettingsSection extends React.PureComponent {
  props: Props;

  render() {
    return (
      <PageWithMenu>
        <SettingsMenu organization={this.props.organization} />
        {this.props.children}
      </PageWithMenu>
    );
  }
}

export default Relay.createContainer(SettingsSection, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        ${SettingsMenu.getFragment('organization')}
      }
    `
  }
});
