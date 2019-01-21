/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import PipelineScheduleUpdateMutation from 'app/mutations/PipelineScheduleUpdate';
import GraphQLErrors from 'app/constants/GraphQLErrors';

import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';

import Form from './Form';

type Props = { pipelineSchedule: {
  uuid: string,
  cronline: string,
  label?: string,
  commit?: string,
  branch?: string,
  message?: string,
  enabled: boolean,
  env?: Array<string>,
  pipeline: {
    slug: string,
    organization: { slug: string }
  }
} };

class Edit extends React.Component {
  props: Props;

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    saving: false,
    errors: null
  };

  render() {
    return (
      <DocumentTitle title={`Update`}>
        <form onSubmit={this.handleFormSubmit}>
          <Panel>
            <Panel.Header>Update Schedule</Panel.Header>

            <Panel.Section>
              <Form
                pipeline={this.props.pipelineSchedule.pipeline}
                errors={this.state.errors}
                cronline={this.props.pipelineSchedule.cronline}
                label={this.props.pipelineSchedule.label}
                commit={this.props.pipelineSchedule.commit}
                branch={this.props.pipelineSchedule.branch}
                message={this.props.pipelineSchedule.message}
                enabled={this.props.pipelineSchedule.enabled}
                env={this.props.pipelineSchedule.env.join("\n")}
                ref={(form) => this.form = form}
              />
            </Panel.Section>

            <Panel.Footer>
              <Button loading={this.state.saving ? "Saving schedule…" : false} theme="success">Save Schedule</Button>
            </Panel.Footer>
          </Panel>
        </form>
      </DocumentTitle>
    );
  }

  handleFormSubmit = (evt) => {
    evt.preventDefault();

    this.setState({ saving: true });

    // NOTE: `this.form.refs.component` is used because `this.form` is a RelayContainer!
    const data = this.form.refs.component.getFormData();
    const mutation = new PipelineScheduleUpdateMutation({ ...data, pipelineSchedule: this.props.pipelineSchedule });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationError
    });
  };

  handleMutationError = (transaction) => {
    const error = transaction.getError();
    if (error) {
      if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
        this.setState({ errors: transaction.getError().source.errors });
      } else {
        alert(error);
      }
    }

    this.setState({ saving: false });
  };

  handleMutationSuccess = () => {
    const pipeline = this.props.pipelineSchedule.pipeline;
    const organization = this.props.pipelineSchedule.pipeline.organization;

    this.context.router.push(`/${organization.slug}/${pipeline.slug}/settings/schedules/${this.props.pipelineSchedule.uuid}`);
  };
}

export default Relay.createContainer(Edit, {
  fragments: {
    pipelineSchedule: () => Relay.QL`
      fragment on PipelineSchedule {
        ${PipelineScheduleUpdateMutation.getFragment('pipelineSchedule')}
        uuid
        cronline
        label
        commit
        branch
        message
        enabled
        env
        pipeline {
          ${Form.getFragment('pipeline')}
          slug
          organization {
            slug
          }
        }
      }
    `
  }
});
