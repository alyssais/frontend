import Relay from 'react-relay/classic';

class TeamDelete extends Relay.Mutation {
  static fragments = {
    team: () => Relay.QL`
      fragment on Team {
        id
        organization {
          id
        }
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        teamDelete
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on TeamDeletePayload {
        deletedTeamID,
        organization {
          id
          slug
          teams {
            count
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on TeamDeletePayload {
                  organization {
                    teams {
                      count
                    }
                  }
          }
        `
      ]
    }, {
      type: 'NODE_DELETE',
      parentName: 'organization',
      parentID: this.props.team.organization.id,
      connectionName: 'teams',
      deletedIDFieldName: 'deletedTeamID'
    }];
  }

  getVariables() {
    return { id: this.props.team.id };
  }
}

export default TeamDelete;
