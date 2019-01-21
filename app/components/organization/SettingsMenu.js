/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';

import Menu from 'app/components/shared/Menu';
import permissions from 'app/lib/permissions';

type Props = {
  organization?: {
    name: string,
    slug: string,
    members?: { count: number },
    invitations?: { count: number },
    teams?: { count: number },
    permissions?: {
      organizationUpdate: { allowed: boolean },
      organizationMemberView: { allowed: boolean },
      teamView: { allowed: boolean },
      teamEnabledChange: { allowed: boolean },
      notificationServiceUpdate: { allowed: boolean },
      organizationBillingUpdate: { allowed: boolean },
      auditEventsView: { allowed: boolean }
    }
  },
  relay: Object
};

class SettingsMenu extends React.Component {
  props: Props;

  componentDidMount() {
    this.props.relay.forceFetch({ isMounted: true });
  }

  render() {
    return (
      <div>
        <Menu>
          <Menu.Header>{this.props.organization.name}</Menu.Header>
          {this.renderButtons()}
        </Menu>

        <Menu>
          <Menu.Button
            href={`/user/settings`}
            label="Personal Settings"
          />
        </Menu>
      </div>
    );
  }

  renderButtons() {
    return permissions(this.props.organization.permissions).collect(
      {
        allowed: "organizationUpdate",
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="settings"
            href={`/organizations/${this.props.organization.slug}/settings`}
            label="Settings"
          />
        )
      },
      {
        always: "organizationMemberView",
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="users"
            link={`/organizations/${this.props.organization.slug}/users`}
            count={this.calculateUsersCount()}
            label="Users"
          />
        )
      },
      {
        any: [
          "teamEnabledChange",
          "teamView"
        ],
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="teams"
            link={`/organizations/${this.props.organization.slug}/teams`}
            count={this.props.organization.teams && this.props.organization.teams.count}
            label="Teams"
          />
        )
      },
      {
        allowed: "auditEventsView",
        and: () => Features.AuditLogsLaunch,
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="eye"
            link={`/organizations/${this.props.organization.slug}/audit-log`}
            label="Audit Log"
          />
        )
      },
      {
        allowed: "notificationServiceUpdate",
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="notification-services"
            href={`/organizations/${this.props.organization.slug}/services`}
            label="Notification Services"
          />
        )
      },
      {
        allowed: "organizationUpdate",
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="sso"
            link={`/organizations/${this.props.organization.slug}/sso`}
            label="Single Sign On"
          />
        )
      },
      {
        allowed: "organizationBillingUpdate",
        render: (idx) => (
          <Menu.Button
            key={idx}
            icon="billing"
            href={`/organizations/${this.props.organization.slug}/billing`}
            label="Billing"
          />
        )
      }
    );
  }

  calculateUsersCount() {
    if (this.props.organization.members) {
      return this.props.organization.members.count + this.props.organization.invitations.count;
    }
  }
}

export default Relay.createContainer(SettingsMenu, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        members @include(if: $isMounted) {
          count
        }
        invitations(state: PENDING) @include(if: $isMounted) {
          count
        }
        teams @include(if: $isMounted) {
          count
        }
        permissions {
          organizationUpdate {
            allowed
          }
          organizationMemberView {
            allowed
          }
          notificationServiceUpdate {
            allowed
          }
          organizationBillingUpdate {
            allowed
          }
          teamView {
            allowed
          }
          teamEnabledChange {
            allowed
          }
          auditEventsView {
            allowed
          }
        }
      }
    `
  }
});
