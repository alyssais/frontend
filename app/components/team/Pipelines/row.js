/* @flow */
import React from 'react';

import Button from 'app/components/shared/Button';
import Emojify from 'app/components/shared/Emojify';
import Panel from 'app/components/shared/Panel';
import Spinner from 'app/components/shared/Spinner';

import FlashesStore from 'app/stores/FlashesStore';
import permissions from 'app/lib/permissions';

import AccessLevel from './access-level';

type Props = {
  teamPipeline: {
    accessLevel?: string,
    pipeline: {
      name: string,
      url: string,
      repository: { url: string }
    },
    permissions?: {
      teamPipelineUpdate: { allowed: boolean },
      teamPipelineDelete: { allowed: boolean }
    }
  },
  onAccessLevelChange: Function,
  onRemoveClick: Function,
  relay: Object
};

export default class Row extends React.PureComponent {
  props: Props;

  static displayName = "Team.Pipelines.Row";

  state = {
    savingNewAccessLevel: null,
    removing: false
  }

  render() {
    const pipeline = this.props.teamPipeline.pipeline;

    return (
      <Panel.Row>
        <div>
          <a
            className="truncate lime hover-lime text-decoration-none hover-underline block"
            href={pipeline.url}
            title={pipeline.name}
          >
            <Emojify text={pipeline.name} />
          </a>
          <small
            className="truncate dark-gray block"
            title={pipeline.repository.url}
          >
            {pipeline.repository.url}
          </small>
        </div>
        <Panel.RowActions className="ml2">
          {this.renderActions()}
        </Panel.RowActions>
      </Panel.Row>
    );
  }

  renderActions() {
    const transactions = this.props.relay.getPendingTransactions(this.props.teamPipeline);
    const transaction = transactions ? transactions[0] : null;

    if (transaction) {
      return (
        <Spinner size={18} color={false} />
      );
    }

    return permissions(this.props.teamPipeline.permissions).collect(
      {
        always: true,
        render: (idx) => (
          <AccessLevel
            key={idx}
            teamPipeline={this.props.teamPipeline}
            onAccessLevelChange={this.handleAccessLevelChange}
            saving={this.state.savingNewAccessLevel}
          />
        )
      },
      {
        allowed: "teamPipelineDelete",
        render: (idx) => (
          <Button
            key={idx}
            loading={this.state.removing ? "Removing…" : false}
            theme={"default"}
            outline={true}
            className="ml3"
            onClick={this.handlePipelineRemove}
          >
            Remove
          </Button>
        )
      }
    );
  }

  handleAccessLevelChange = (accessLevel) => {
    this.setState({ savingNewAccessLevel: accessLevel });

    this.props.onAccessLevelChange(this.props.teamPipeline, accessLevel, (error) => {
      this.setState({ savingNewAccessLevel: null });

      if (error) {
        FlashesStore.flash(FlashesStore.ERROR, error);
      }
    });
  };

  handlePipelineRemove = (evt) => {
    if (confirm("Remove the pipeline from this team?")) {
      evt.preventDefault();

      this.performPipelineRemove(false);
    }
  };

  performPipelineRemove = (force) => {
    this.setState({ removing: true });

    this.props.onRemoveClick(this.props.teamPipeline, force, (error) => {
      this.setState({ removing: false });

      if (error) {
        if (!force && error.source && error.source.type === "must_force_error") {
          if (confirm(error.source.errors[0].message + "\n\nAre you sure you want to remove this pipeline from this team?")) {
            this.performPipelineRemove(true);
          }
        } else {
          FlashesStore.flash(FlashesStore.ERROR, error);
        }
      }
    });
  };
}
