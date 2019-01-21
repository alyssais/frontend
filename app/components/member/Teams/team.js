/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';

import TeamLabels from 'app/components/team/Labels';
import Emojify from 'app/components/shared/Emojify';

type Props = { team: {
  name: string,
  description: string
} };

class Team extends React.PureComponent {
  props: Props;

  static displayName = "Member.Edit.TeamMemberships.Chooser.Team";

  render() {
    return (
      <div>
        <div className="flex items-center">
          <Emojify text={this.props.team.name} className="semi-bold truncate" />
          <TeamLabels team={this.props.team} />
        </div>
        <div className="m0 p0 dark-gray truncate"><Emojify text={this.props.team.description || "n/a"} /></div>
      </div>
    );
  }
}

export default Relay.createContainer(Team, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        name
        description
        ${TeamLabels.getFragment('team')}
      }
    `
  }
});
