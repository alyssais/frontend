/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';

import Panel from 'app/components/shared/Panel';
import Emojify from 'app/components/shared/Emojify';

type Props = { pipelineSchedule: {
  uuid: string,
  cronline: string,
  label?: string,
  commit?: string,
  branch?: string,
  enabled: boolean,
  pipeline: {
    slug: string,
    organization: { slug: string }
  }
} };

class Row extends React.PureComponent {
  props: Props;

  render() {
    const organization = this.props.pipelineSchedule.pipeline.organization;
    const pipeline = this.props.pipelineSchedule.pipeline;

    return (
      <Panel.RowLink to={`/${organization.slug}/${pipeline.slug}/settings/schedules/${this.props.pipelineSchedule.uuid}`}>
        <div className="flex flex-stretch items-center line-height-1" style={{ minHeight: '3em' }}>
          <div className="flex-auto">
            {this.renderLabel()}
            <span className="dark-gray regular">
              {this.props.pipelineSchedule.cronline}
            </span>
          </div>
          <div className="flex flex-none flex-stretch items-center my1 pr3 dark-gray">
            <code className="dark-gray">{this.props.pipelineSchedule.commit}</code>
            <span>&nbsp;/&nbsp;</span>
            {this.props.pipelineSchedule.branch}
          </div>
        </div>
      </Panel.RowLink>
    );
  }

  renderLabel() {
    return (
      <div className="m0 semi-bold mb1">
        {this.props.pipelineSchedule.label && <Emojify text={this.props.pipelineSchedule.label} />}
        {this.props.pipelineSchedule.enabled ? null : (
          <span
            style={{
              fontSize: 12,
              verticalAlign: 'middle'
            }}
            className="mx1 regular border border-red rounded red px1"
          >
            Disabled
          </span>
        )}
      </div>
    );
  }
}

export default Relay.createContainer(Row, {
  fragments: {
    pipelineSchedule: () => Relay.QL`
      fragment on PipelineSchedule {
        uuid
        cronline
        label
        commit
        branch
        enabled
        pipeline {
          slug
          organization {
            slug
          }
        }
      }
    `
  }
});
