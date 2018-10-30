// @flow

import * as React from "react";
import { createRefetchContainer, graphql, fetchQuery, commitMutation } from 'react-relay/compat';
import DocumentTitle from 'react-document-title';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import Button from 'app/components/shared/Button';
import Icon from "app/components/shared/Icon";
import PageHeader from "app/components/shared/PageHeader";
import WorkflowProgress from "app/components/shared/WorkflowProgress";
import TwoFactorConfigureRecoveryCodes from './TwoFactorConfigureRecoveryCodes';
import TwoFactorConfigureActivate from './TwoFactorConfigureActivate';
import TwoFactorConfigureComplete from './TwoFactorConfigureComplete';
import TotpCreateMutation from './TotpCreateMutation';
import TotpDeleteMutation from './TotpDeleteMutation';
// Required for Relay fragments...
import TwoFactor from 'app/components/user/TwoFactor'; // eslint-disable-line
import RecoveryCodeList from 'app/components/RecoveryCodeList'; // eslint-disable-line
import type { RelayProp } from 'react-relay';
import type { TwoFactorConfigure_viewer } from './__generated__/TwoFactorConfigure_viewer.graphql';

const STEPS = {
  RECOVERY_CODES: 'RECOVERY_CODES',
  ACTIVATE_TOTP: 'ACTIVATE_TOTP',
  COMPLETE: 'COMPLETE'
};

type StepType = $Keys<typeof STEPS>;
type TotpType = $PropertyType<TotpType, 'totp'>;
type RecoveryCodesType = $PropertyType<TotpType, 'recoveryCodes'>;

function getNextStep(currentStep: StepType): ?StepType {
  switch (currentStep) {
    case STEPS.RECOVERY_CODES: return STEPS.ACTIVATE_TOTP;
    case STEPS.ACTIVATE_TOTP: return STEPS.COMPLETE;
    case STEPS.COMPLETE: return STEPS.COMPLETE;
  }
}

type Props = {
  relay: RelayProp,
  viewer: TwoFactorConfigure_viewer
};

type State = {
  step: StepType,
  newTotpConfig: ?{
    totp: TotpType,
    provisioningUri: string
  }
};

class TwoFactorConfigure extends React.Component<Props, State> {
  state = {
    step: STEPS.RECOVERY_CODES,
    newTotpConfig: null
  };

  get recoveryCodes(): RecoveryCodesType {
    if (this.state.newTotpConfig) {
      return this.state.newTotpConfig.totp.recoveryCodes;
    }
    if (this.props.viewer.totp) {
      return this.props.viewer.totp.recoveryCodes;
    }
    return null;
  }

  get provisioningUri(): string {
    if (this.state.newTotpConfig) {
      return this.state.newTotpConfig.provisioningUri;
    }
    return '';
  }

  get hasActivatedTotp(): boolean {
    return this.props.viewer.totp ? true : false;
  }

  get steps(): Array<StepType> {
    if (this.hasActivatedTotp) {
      return [STEPS.RECOVERY_CODES, STEPS.ACTIVATE_TOTP, STEPS.COMPLETE];
    }
    return [STEPS.RECOVERY_CODES, STEPS.ACTIVATE_TOTP, STEPS.COMPLETE];
  }

  currentStepIndex(currentStep: StepType): number {
    return this.steps.indexOf(currentStep);
  }

  componentWillUnmount() {
    if (this.state.step !== STEPS.COMPLETE && this.state.newTotpConfig) {
      TotpDeleteMutation({
        environment: this.props.relay.environment,
        variables: {
          input: {
            id: this.state.newTotpConfig.totp.id
          }
        }
      });
    }
  }

  render() {
    return (
      <DocumentTitle title="Configure Two-Factor Authentication">
        <div className="container">
          <PageHeader>
            <PageHeader.Icon>
              <Icon
                icon="placeholder"
                style={{ width: 34, height: 34, marginTop: 3, marginLeft: 3 }}
              />
            </PageHeader.Icon>
            <PageHeader.Title>
              {this.props.viewer.totp ? 'Reconfigure' : 'Configure'} Two-Factor Authentication
            </PageHeader.Title>
            <PageHeader.Menu>
              <WorkflowProgress
                className="mr4"
                stepCount={this.steps.length}
                currentStepIndex={this.currentStepIndex(this.state.step)}
              />
              {this.state.step === STEPS.COMPLETE ? (
                <Button theme="success" outline={true} link="/user/two-factor">Done</Button>
              ) : (
                <Button theme="default" outline={true} link="/user/two-factor">Cancel</Button>
              )}
            </PageHeader.Menu>
          </PageHeader>
          <div className="col-12 lg-col-7 mx-auto">
            {this.renderCurrentStep()}
          </div>
        </div>
      </DocumentTitle>
    );
  }

  renderCurrentStep() {
    switch (this.state.step) {
      case STEPS.RECOVERY_CODES:
        return (
          <TwoFactorConfigureRecoveryCodes
            onNextStep={this.handleNextStep}
            recoveryCodes={this.recoveryCodes}
            onCreateNewTotp={this.handleCreateNewTotp}
            onRegenerateRecoveryCodes={this.handleRegenerateRecoveryCodes}
            hasActivatedTotp={this.hasActivatedTotp}
          />
        );
      case STEPS.ACTIVATE_TOTP:
        return (
          <TwoFactorConfigureActivate
            onNextStep={this.handleNextStep}
            hasActivatedTotp={this.hasActivatedTotp}
            provisioningUri={this.provisioningUri}
            onActivateOtp={this.handleActivateOtp}
          />
        );
      case STEPS.COMPLETE:
        return (
          <TwoFactorConfigureComplete />
        );
    }
  }

  handleNextStep = () => {
    const step = getNextStep(this.state.step);
    if (step) {
      this.setState({ step });
    }
  }

  refetchTotpById = (id: string): Promise<*> => {
    return fetchQuery(
      this.props.relay.environment,
      graphql`
        query TwoFactorConfigureRefetchNewTotpConfigQuery($id: ID!) {
          viewer {
            totp(id: $id) {
              id
              recoveryCodes {
                ...TwoFactorConfigureRecoveryCodes_recoveryCodes
              }
            }
          }
        }
      `,
      {
        id
      }
    );
  }

  handleCreateNewTotp = (callback?: () => void) => {
    TotpCreateMutation({
      environment: this.props.relay.environment,
      onCompleted: ({ totpCreate }) => {
        this.refetchTotpById(totpCreate.totp.id).then(({ viewer: { totp } }) => {
          this.setState({ newTotpConfig: { totp, provisioningUri: totpCreate.provisioningUri } }, () => {
            if (callback) {
              callback();
            }
          });
        });
      }
    });
  }

  handleRegenerateRecoveryCodes = (callback?: () => void) => {
    if (this.state.newTotpConfig) {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation TwoFactorConfigureRecoveryCodeRegenerateMutation($input: TOTPRecoveryCodesRegenerateInput!) {
            totpRecoveryCodesRegenerate(input: $input) {
              totp {
                id
              }
            }
          }
        `,
        variables: { input: { totpId: this.state.newTotpConfig.totp.id } },
        onCompleted: ({ totpRecoveryCodesRegenerate: { totp } }) => {
          this.refetchTotpById(totp.id).then(({ viewer: { totp } }) => {
            this.setState({ newTotpConfig: { ...this.state.newTotpConfig, totp } }, () => {
              if (callback) {
                callback();
              }
            });
          });
        }
      });
    }
  }

  handleActivateOtp = (token: string, callback?: (errors: *) => void) => {
    if (this.state.newTotpConfig) {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation TwoFactorConfigureActivateMutation($input: TOTPActivateInput!) {
            totpActivate(input: $input) {
              viewer {
                ...TwoFactor_viewer
              }
            }
          }
        `,
        variables: { input: { id: this.state.newTotpConfig.totp.id, token } },
        onCompleted: () => {
          if (callback) {
            callback();
          }
        },
        onError: (error) => {
          if (error) {
            if (error.source && error.source.type) {
              switch (error.source.type) {
                case GraphQLErrors.ESCALATION_ERROR:
                  location.reload();
                  return;
                case GraphQLErrors.RECORD_VALIDATION_ERROR:
                  if (callback) {
                    callback(error.source.errors);
                  }
                  return;
                default:
                  return;
              }
            } else {
              alert(error);
            }
          }
          if (callback) {
            callback(error.source.errors);
          }
        }
      });
    }
  }
}

export default createRefetchContainer(
  TwoFactorConfigure,
  graphql`
    fragment TwoFactorConfigure_viewer on Viewer {
      id
      totp {
        id
        recoveryCodes {
          ...TwoFactorConfigureRecoveryCodes_recoveryCodes
        }
      }
    }
  `,
  graphql`
    query TwoFactorConfigureRefetchQuery {
      viewer {
        ...TwoFactorConfigure_viewer
      }
    }
  `
);