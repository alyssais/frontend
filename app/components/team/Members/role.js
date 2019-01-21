/* @flow */
import React from 'react';

import Chooser from 'app/components/shared/Chooser';
import Dropdown from 'app/components/shared/Dropdown';
import PermissionSelectOptionDescriptions from 'app/components/shared/PermissionSelectOptionDescriptions';
import PermissionDescription from 'app/components/shared/PermissionDescription';

import TeamMemberRoleConstants from 'app/constants/TeamMemberRoleConstants';

type Props = {
  teamMember: {
    role: string,
    permissions?: { teamMemberUpdate: { allowed: boolean } }
  },
  onRoleChange: Function,
  savingNewRole?: string
};

export default class MemberRole extends React.PureComponent {
  props: Props;

  static displayName = "Team.Pipelines.Role";

  render() {
    if (this.props.teamMember.permissions.teamMemberUpdate.allowed) {
      return this.renderDropdownWithChooser();
    }
    return (
      <span className="dark-gray">{this.label(this.props.teamMember.role)}</span>
    );

  }

  renderDropdownWithChooser() {
    const saving = this.props.savingNewRole;

    return (
      <Dropdown width={270}>
        <div className="underline-dotted cursor-pointer inline-block regular">{this.label(this.props.teamMember.role)}</div>

        <Chooser selected={this.props.teamMember.role} onSelect={this.props.onRoleChange}>
          <Chooser.SelectOption
            value={TeamMemberRoleConstants.MAINTAINER}
            saving={saving === TeamMemberRoleConstants.MAINTAINER}
            selected={this.props.teamMember.role === TeamMemberRoleConstants.MAINTAINER}
            label={this.label(TeamMemberRoleConstants.MAINTAINER)}
            description={
              <PermissionSelectOptionDescriptions>
                <PermissionDescription allowed={true} permission="add and remove pipelines" />
                <PermissionDescription allowed={true} permission="add and remove users" />
              </PermissionSelectOptionDescriptions>
            }
          />
          <Chooser.SelectOption
            value={TeamMemberRoleConstants.MEMBER}
            saving={saving === TeamMemberRoleConstants.MEMBER}
            selected={this.props.teamMember.role === TeamMemberRoleConstants.MEMBER}
            label={this.label(TeamMemberRoleConstants.MEMBER)}
            description={
              <PermissionSelectOptionDescriptions>
                <PermissionDescription allowed={true} permission="add and remove pipelines" />
                <PermissionDescription allowed={false} permission="add or remove users" />
              </PermissionSelectOptionDescriptions>
            }
          />
        </Chooser>
      </Dropdown>
    );
  }

  label(value) {
    switch (value) {
      case TeamMemberRoleConstants.MAINTAINER:
        return "Team Maintainer";
      case TeamMemberRoleConstants.MEMBER:
        return "Team Member";
    }
  }
}
