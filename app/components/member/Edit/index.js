/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';

import MemberEditForm from './form';
import MemberEditRemove from './remove';

type Props = {
  organizationMember: Object,
  viewer: Object
};

class Edit extends React.PureComponent {
  props: Props;

  static displayName = "Member.Edit";

  render() {
    return (
      <div>
        <MemberEditForm organizationMember={this.props.organizationMember} />
        <MemberEditRemove viewer={this.props.viewer} organizationMember={this.props.organizationMember} />
      </div>
    );
  }
}

export default Relay.createContainer(Edit, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${MemberEditRemove.getFragment('viewer')}
      }
    `,
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        ${MemberEditForm.getFragment('organizationMember')}
        ${MemberEditRemove.getFragment('organizationMember')}
      }
    `
  }
});
