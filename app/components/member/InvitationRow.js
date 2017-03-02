import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import Button from '../shared/Button';
import Panel from '../shared/Panel';

import OrganizationInvitationResend from '../../mutations/OrganizationInvitationResend';

class InvitationRow extends React.Component {
  static propTypes = {
    organizationInvitation: React.PropTypes.shape({
      uuid: React.PropTypes.string.isRequired,
      email: React.PropTypes.string.isRequired
    }).isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <Panel.Row key={this.props.organizationInvitation.uuid}>
        <div className="flex flex-stretch items-center">
          <div className="flex-auto">
            <div className="m0">
              {this.props.organizationInvitation.email}
            </div>
          </div>
          <div className="flex-none">
            <Button className="ml1" theme="default" outline={true} onClick={this.handleResendInvitationClick}>Resend Invitation</Button>
            <Button className="ml1" theme="default" outline={true}>Revoke</Button>
          </div>
        </div>
      </Panel.Row>
    );
  }

  handleResendInvitationClick = () => {
    // Show the resending indicator
    this.setState({ resending: true });

    const mutation = new OrganizationInvitationResend({
      organizationInvitation: this.props.organizationInvitation
    });

    // Run the mutation
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleResendInvitationMutationSuccess,
      onFailure: this.handleResendInvitationMutationFailure
    });
  }

  handleResendInvitationMutationSuccess = (response) => {
    // TODO: something
    console.log("👌🏼");
  }

  handleResendInvitationMutationFailure = (transaction) => {
    // Hide the removing indicator
    this.setState({ resending: false });

    alert(transaction.getError());
  }
}

export default Relay.createContainer(InvitationRow, {
  fragments: {
    organizationInvitation: () => Relay.QL`
      fragment on OrganizationInvitation {
        uuid
        email
        ${OrganizationInvitationResend.getFragment('organizationInvitation')}
      }
    `
  }
});
