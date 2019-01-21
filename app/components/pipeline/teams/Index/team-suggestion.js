/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';

import TeamLabels from 'app/components/team/Labels';
import Emojify from 'app/components/shared/Emojify';

type Props = { team: {
  name: string,
  description: string,
  slug: string
} };

class TeamSuggestion extends React.PureComponent {
  props: Props;

  static displayName = "Pipeline.Teams.TeamSuggestion";

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

export default Relay.createContainer(TeamSuggestion, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        name
        description
        slug
        ${TeamLabels.getFragment('team')}
      }
    `
  }
});
