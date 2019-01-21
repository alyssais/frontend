/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';

import Dropdown from 'app/components/shared/Dropdown';
import Chooser from 'app/components/shared/Chooser';
import Emojify from 'app/components/shared/Emojify';
import Icon from 'app/components/shared/Icon';

type Props = {
  selected?: string,
  organization: Object,
  onTeamChange: Function
};

class Teams extends React.Component {
  props: Props;

  render() {
    // Collect all the teams that we're allowed to see pipelines on
    const teams = [];
    for (const edge of this.props.organization.teams.edges) {
      if (edge.node.permissions.pipelineView.allowed) {
        teams.push(edge.node);
      }
    }

    // Don't render the select if there aren't any teams that can be viewed
    if (teams.length === 0) {
      return null;
    }

    return (
      <Dropdown className="ml4" width={300} ref={(dropdownNode) => this.dropdownNode = dropdownNode}>
        <button className="h3 px0 py1 m0 light dark-gray inline-block btn" style={{ fontSize: 16 }}>
          <div className="flex">
            <span className="flex items-center">
              <span className="truncate">
                {this.renderLabel()}
              </span>
            </span>
            <span className="flex items-center">
              <Icon icon="down-triangle" style={{ width: 8, height: 8, marginLeft: '.5em' }} />
            </span>
          </div>
        </button>

        <Chooser selected={null} onSelect={this.handleDropdownSelect}>
          {this.renderOptions(teams)}
          <Chooser.Option value="" className="btn block hover-bg-silver">
            <div>All teams</div>
          </Chooser.Option>
        </Chooser>
      </Dropdown>
    );
  }

  renderLabel() {
    if (this.props.selected) {
      for (const edge of this.props.organization.teams.edges) {
        if (edge.node.slug === this.props.selected) {
          return (
            <Emojify className="block" text={edge.node.name} />
          );
        }
      }
    }

    return "All teams";
  }

  renderOptions(teams) {
    return teams.map((team) =>
      (<Chooser.Option key={team.id} value={team.slug} className="btn block hover-bg-silver line-height-3">
        <Emojify className="block" text={team.name} />
        {team.description && <Emojify className="block dark-gray regular h5 mt1" text={team.description} />}
      </Chooser.Option>)
    );
  }

  handleDropdownSelect = (slug) => {
    this.dropdownNode.setShowing(false);
    this.props.onTeamChange(slug);
  };
}

export default Relay.createContainer(Teams, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        teams(first: 100) {
          edges {
            node {
              id
              name
              slug
              description
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
