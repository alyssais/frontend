/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';
import permissions from 'app/lib/permissions';

import Row from './row';

type Props = {
  pipeline: {
    name: string,
    schedules: { edges?: Array<{ node: {
      id: string,
      failedAt?: string
    } }> },
    permissions: { pipelineScheduleCreate: { allowed: boolean } }
  },
  params: {
    organization: string,
    pipeline: string
  }
};

class Index extends React.Component {
  props: Props;

  render() {
    return (
      <DocumentTitle title={`Schedules · ${this.props.pipeline.name}`}>
        <React.Fragment>
          {this.renderFailureMessage()}
          <Panel>
            <Panel.Header>Schedules</Panel.Header>

            <Panel.IntroWithButton>
              <span>Build schedules automatically create builds at specified intervals.</span>
              {this.renderNewScheduleButton()}
            </Panel.IntroWithButton>
            {this.renderScheduleRows()}
          </Panel>
        </React.Fragment>
      </DocumentTitle>
    );
  }

  renderFailureMessage() {
    const schedules = this.props.pipeline.schedules.edges;

    const failedSchedules = schedules.filter((edge) => edge.node.failedAt);

    const plural = failedSchedules.length !== 1;

    if (failedSchedules.length > 0) {
      return (
        <div className="mb4 p2 border border-red rounded red flex items-center">
          <span className="m1">
            {plural ? 'Several of your schedules have' : 'One of your schedules has'} been automatically disabled due to {plural ? 'errors' : 'an error'}.
          </span>
        </div>
      );
    }

    return null;
  }

  renderNewScheduleButton() {
    return permissions(this.props.pipeline.permissions).check(
      {
        allowed: "pipelineScheduleCreate",
        render: () => <Button link={`/${this.props.params.organization}/${this.props.params.pipeline}/settings/schedules/new`}>New Schedule</Button>
      }
    );
  }

  renderScheduleRows() {
    const schedules = this.props.pipeline.schedules.edges;

    if (schedules.length > 0) {
      return schedules.map((edge) => {
        return (
          <Row key={edge.node.id} pipelineSchedule={edge.node} />
        );
      });
    }

    return null;
  }
}

export default Relay.createContainer(Index, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        name
        schedules(first: 100) {
          edges {
            node {
              id
              failedAt
              ${Row.getFragment("pipelineSchedule")}
            }
          }
        }
        permissions {
          pipelineScheduleCreate {
            allowed
            code
            message
          }
        }
      }
    `
  }
});
