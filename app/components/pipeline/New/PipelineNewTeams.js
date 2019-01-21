/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import FormInputLabel from 'app/components/shared/FormInputLabel';
import FormInputHelp from 'app/components/shared/FormInputHelp';
import FormInputErrors from 'app/components/shared/FormInputErrors';
import MemberTeamRow from 'app/components/member/MemberTeamRow';

const filterAllowedTeams = (connection) => {
  const teams = [];
  for (const edge of connection.edges) {
    if (edge.node.permissions.pipelineView.allowed) {
      teams.push(edge.node);
    }
  }

  return teams;
};

type Props = { organization: Object };

class PipelineNewTeams extends React.Component {
  state = {
    teams: [],
    errors: [],
    required: false
  };

  constructor(initialProps: Props) {
    super(initialProps);

    // Super hacky way of pre-populating the state from the browser. When the
    // New Pipeline form becomes 100% Relay, we can ditch. But for now, we need
    // this bridge in here so we can preselect teams when we load the page.
    if (window._pipelineNewTeamsState) {
      const state = window._pipelineNewTeamsState;

      // If this field has been marked as required, and there's only 1 possible
      // option in the list, just pre-select it.
      const teams = filterAllowedTeams(initialProps.organization.teams);
      if (state.required && state.teams.length === 0 && teams.length === 1) {
        state.teams = [teams[0].uuid];
      }

      this.state = state;
    }
  }

  props: Props;

  render() {
    // Collect all the teams that we're allowed to see pipelines on
    const teams = filterAllowedTeams(this.props.organization.teams);

    // If there aren't any teams don't bother rendering anything!
    if (teams.length === 0) {
      return null;
    }

    return (
      <div>
        {this.state.teams.map((uuid) => <input key={uuid} type="hidden" name="project[team_ids][]" value={uuid} />)}
        <FormInputLabel label="Teams" errors={this.state.errors && this.state.errors.length > 0} required={this.state.required} />
        <FormInputHelp>The teams who will be given access this pipeline.</FormInputHelp>
        <div className="flex flex-wrap content-around mxn1 mt1">
          {teams.map((team) => (
            <MemberTeamRow
              key={team.uuid}
              team={team}
              checked={this.state.teams.includes(team.uuid)}
              onChange={this.handleTeamChange}
            />
          ))}
        </div>
        <FormInputErrors errors={this.state.errors} />
      </div>
    );
  }

  handleTeamChange = (team) => {
    let teams;
    const teamIndex = this.state.teams.indexOf(team.uuid);

    if (teamIndex === -1) {
      // adding
      teams = this.state.teams.concat([team.uuid]);
    } else {
      // removing
      teams = this.state.teams.concat();
      teams.splice(teamIndex, 1);
    }

    this.setState({ teams });
  };
}

export default Relay.createContainer(PipelineNewTeams, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        teams(first: 50) {
          edges {
            node {
              ${MemberTeamRow.getFragment('team')}
              uuid
              permissions {
                pipelineView {
                  allowed
                }
              }
            }
          }
        }
      }
    `
  }
});
