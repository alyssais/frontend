/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';

import Panel from 'app/components/shared/Panel';
import ShowMoreFooter from 'app/components/shared/ShowMoreFooter';

import Row from './row';
import Chooser from './chooser';

const INITIAL_PAGE_SIZE = 5;
const PAGE_SIZE = 20;

type Props = {
  organizationMember?: {
    uuid: string,
    organization: { permissions: { teamAdmin: { allowed: boolean } } },
    teams: {
      count: number,
      edges: Array<{ node: Object }>
    }
  },
  relay: Object
};

class TeamMemberships extends React.PureComponent {
  props: Props;

  static displayName = "Member.Teams";

  state = {
    loading: false
  };

  render() {
    return (
      <div>
        {this.renderTeamAddButton()}
        <Panel>
          {this.renderTeams()}
          <ShowMoreFooter
            connection={this.props.organizationMember.teams}
            label="teams"
            loading={this.state.loading}
            onShowMore={this.handleShowMoreTeams}
          />
        </Panel>
      </div>
    );
  }

  renderTeamAddButton() {
    if (this.props.organizationMember.organization.permissions.teamAdmin.allowed) {
      return (
        <Chooser
          organizationMember={this.props.organizationMember}
          onChoose={this.handleTeamMemberAdd}
        />
      );
    }
  }

  handleTeamMemberAdd = () => {
    this.props.relay.forceFetch();
  };

  renderTeams() {
    const teams = this.props.organizationMember.teams.edges;

    if (!teams.length) {
      return (
        <div className="p3">
          This user is not a member of any teams.
        </div>
      );
    }

    return teams.map(({ node }) => (
      <Row
        key={node.id}
        teamMember={node}
      />
    ));
  }

  handleShowMoreTeams = () => {
    this.setState({ loading: true });

    let { teamsPageSize } = this.props.relay.variables;

    teamsPageSize += PAGE_SIZE;

    this.props.relay.setVariables(
      { teamsPageSize },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loading: false });
        }
      }
    );
  };
}

export default Relay.createContainer(TeamMemberships, {
  initialVariables: {
    teamsPageSize: INITIAL_PAGE_SIZE
  },

  fragments: {
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        uuid
        user {
          id
        }
        organization {
          permissions {
            teamAdmin {
              allowed
            }
          }
        }
        teams(first: $teamsPageSize, order: NAME) {
          ${ShowMoreFooter.getFragment('connection')}
          count
          edges {
            node {
              id
              ${Row.getFragment('teamMember')}
            }
          }
        }
        ${Chooser.getFragment('organizationMember')}
      }
    `
  }
});
