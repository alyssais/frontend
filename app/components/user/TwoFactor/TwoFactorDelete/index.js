// @flow

import React from "react";
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import Button from 'app/components/shared/Button';
import PageHeader from "app/components/shared/PageHeader";
import Panel from 'app/components/shared/Panel';
import Icon from "app/components/shared/Icon";

type ViewerType = {
  totp: ?{
    id: string
  }
};

type Props = {
  viewer: ViewerType,
  relay: Object
};

type State = {
  deletingTOTP: boolean,
  deletedTOTP: boolean
};

type TOTPDeleteReturnType = {
  totpDelete: {
    viewer: ViewerType
  }
};

class TwoFactorDelete extends React.PureComponent<Props, State> {
  state = {
    deletingTOTP: false,
    deletedTOTP: false
  };

  render() {
    return (
      <div style={{ padding: '20px' }}>
        <PageHeader>
          <PageHeader.Icon>
            <Icon
              icon="placeholder"
              style={{ width: 34, height: 34, marginTop: 3, marginLeft: 3 }}
            />
          </PageHeader.Icon>
          <PageHeader.Title>
            Remove Two-Factor Authentication
          </PageHeader.Title>
        </PageHeader>
        <div>
          {this.renderCurrentStatus()}
        </div>
      </div>
    );
  }

  renderCurrentStatus() {
    if (this.state.deletedTOTP) {
      return this.renderDeletedStatus();
    }

    if (!this.props.viewer.totp) {
      return (
        <Panel className="mb3">
          <Panel.Section>
            Two-factor authentication is not currently activated on your account, so we canʼt deactivate it!
          </Panel.Section>
        </Panel>
      );
    }

    return (
      <React.Fragment>
        <p>Two-factor authentication is currently activated. We recommend keeping two-factor authentication activated to help secure your account.</p>
        <p>Removing two-factor authentication will take effect immediately. You may reconfigure two-factor authentication at any time.</p>
      <Button
        className="col-12"
        theme="error"
        outline={true}
        onClick={this.handleDeleteClick}
        loading={this.state.deletingTOTP && "Removing two-factor authentication…"}
      >
        Remove Two-Factor Authentication
      </Button>
      </React.Fragment>
    );
  }

  renderDeletedStatus() {
    return (
      <Panel className="mb4">
        <Panel.Section>
          <p>Two-factor authentication has been removed from your account.</p>
        </Panel.Section>
        <Panel.Section>
          <p>Need to configure two-factor authentication again?</p>
          <Button
            theme="success"
            link="/user/two-factor/configure"
          >
            Configure Two-Factor Authentication
          </Button>
        </Panel.Section>
      </Panel>
    );
  }

  handleDeleteClick = () => {
    if (!this.props.viewer.totp) {
      throw new Error('TOTP Delete called without an active TOTP configuration (This should not be possible!)');
    }

    const totpId = this.props.viewer.totp.id;

    this.setState({ deletingTOTP: true }, () => {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation TwoFactorDeleteMutation($input: TOTPDeleteInput!) {
            totpDelete(input: $input) {
              clientMutationId
              viewer {
                totp {
                  id
                }
              }
            }
          }
        `,
        variables: { input: { id: totpId } },
        onCompleted: this.handleDeleteMutationComplete,
        onError: this.handleDeleteMutationError
      });
    });
  };

  handleDeleteMutationComplete = (mutationResult: TOTPDeleteReturnType) => {
    this.setState({
      deletingTOTP: false,
      deletedTOTP: !mutationResult.totpDelete.viewer.totp
    });
  };

  handleDeleteMutationError = (error) => {
    if (error) {
      if (error.source && error.source.type === GraphQLErrors.ESCALATION_ERROR) {
        location.reload();
      } else {
        // if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
        //   this.setState({ errors: error.source.errors });
        // } else {
        alert(JSON.stringify(error));
      }
    }
  };
}

export default createFragmentContainer(TwoFactorDelete, {
  viewer: graphql`
    fragment TwoFactorDelete_viewer on Viewer {
      totp {
        id
      }
    }
  `
});
