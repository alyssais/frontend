/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';

import FriendlyTime from 'app/components/shared/FriendlyTime';
import Panel from 'app/components/shared/Panel';

type Props = { build: {
  id: string,
  url: string,
  number: number,
  createdAt: string
} };

class Build extends React.PureComponent {
  props: Props;

  render() {
    return (
      <Panel.RowLink key={this.props.build.id} href={this.props.build.url}>
        <div className="flex flex-stretch items-center line-height-1" style={{ minHeight: '3em' }}>
          <span className="mr-auto">Build #{this.props.build.number}</span>
          <span className="dark-gray regular mr2 flex-none"><FriendlyTime value={this.props.build.createdAt} /></span>
        </div>
      </Panel.RowLink>
    );
  }
}

export default Relay.createContainer(Build, {
  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        id
        url
        number
        createdAt
      }
    `
  }
});
