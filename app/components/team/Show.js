/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import PageHeader from 'app/components/shared/PageHeader';
import Emojify from 'app/components/shared/Emojify';
import permissions from 'app/lib/permissions';
import TabControl from 'app/components/shared/TabControl';
import TeamLabels from './Labels';

import Pipelines from './Pipelines';
import Members from './Members';

type Props = {
  team?: {
    name: string,
    description?: string,
    slug: string,
    members: { count?: number },
    pipelines: { count?: number },
    organization: {
      name: string,
      slug: string
    },
    permissions: { teamUpdate: Object }
  },
  children: number | string | React.Element | Array<any>
};

class TeamShow extends React.Component {
  props: Props;

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    removing: false,
    selectedTab: 0
  };

  render() {
    // If the team doesn't exist, that means that it's just been deleted. And
    // since we require all the team to render this component, we'll just
    // short-circut the re-render when it's gone. This isn't great, maybe
    // there's a beter way?
    if (!this.props.team) {
      return null;
    }

    return (
      <DocumentTitle title={`${this.props.team.name} · ${this.props.team.organization.name} Team`}>
        <div>
          <PageHeader followedByTabs={true}>
            <div className="flex items-center">
              <h1 className="h1 m0 p0 block"><Emojify text={this.props.team.name} /></h1>
              <TeamLabels team={this.props.team} />
            </div>
            <PageHeader.Description><Emojify text={this.props.team.description || "No description"} /></PageHeader.Description>
          </PageHeader>

          {this.renderTabs()}

          {this.props.children}
        </div>
      </DocumentTitle>
    );
  }

  renderTabs() {
    const tabContent = permissions(this.props.team.permissions).collect(
      {
        always: true,
        render: (idx) => (
          <TabControl.Tab
            key={idx}
            to={`/organizations/${this.props.team.organization.slug}/teams/${this.props.team.slug}/members`}
            badge={this.props.team.members.count}
          >
            Members
          </TabControl.Tab>
        )
      },
      {
        always: true,
        render: (idx) => (
          <TabControl.Tab
            key={idx}
            to={`/organizations/${this.props.team.organization.slug}/teams/${this.props.team.slug}/pipelines`}
            badge={this.props.team.pipelines.count}
          >
            Pipelines
          </TabControl.Tab>
        )
      },
      {
        allowed: "teamUpdate",
        render: (idx) => (
          <TabControl.Tab
            key={idx}
            to={`/organizations/${this.props.team.organization.slug}/teams/${this.props.team.slug}/settings`}
          >
            Settings
          </TabControl.Tab>
        )
      }
    );

    return (
      <TabControl>
        {tabContent}
      </TabControl>
    );
  }
}

export default Relay.createContainer(TeamShow, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        ${Pipelines.getFragment('team')}
        ${Members.getFragment('team')}
        members {
          count
        }
        pipelines {
          count
        }
        name
        description
        slug
        ${TeamLabels.getFragment('team')}
        organization {
          name
          slug
        }
        permissions {
          teamUpdate {
            allowed
          }
        }
      }
    `
  }
});
