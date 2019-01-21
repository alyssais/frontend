/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import { second } from 'metrick/duration';

import Panel from 'app/components/shared/Panel';
import SearchField from 'app/components/shared/SearchField';
import ShowMoreFooter from 'app/components/shared/ShowMoreFooter';

import FlashesStore from 'app/stores/FlashesStore';

import { formatNumber } from 'app/lib/number';

import TeamPipelineUpdateMutation from 'app/mutations/TeamPipelineUpdate';
import TeamPipelineDeleteMutation from 'app/mutations/TeamPipelineDelete';

import Chooser from './chooser';
import Row from './row';

const PAGE_SIZE = 10;

type Props = {
  team: { pipelines: {
    count: number,
    edges: Array<any>
  } },
  relay: Object,
  className?: string
};

class Pipelines extends React.Component {
  props: Props;

  static displayName = "Team.Pipelines";

  state = {
    loading: false,
    searchingPipelines: false,
    searchingPipelinesIsSlow: false
  };

  render() {
    return (
      <div>
        <Chooser
          team={this.props.team}
          onChoose={this.handleTeamPipelineChoose}
        />
        <Panel className={this.props.className}>
          {this.renderPipelineSearch()}
          {this.renderPipelineSearchInfo()}
          {this.renderPipelines()}
          <ShowMoreFooter
            connection={this.props.team.pipelines}
            label="pipelines"
            loading={this.state.loading}
            searching={this.state.searchingPipelines}
            onShowMore={this.handleShowMorePipelines}
          />
        </Panel>
      </div>
    );
  }

  renderPipelines() {
    if (this.props.team.pipelines.edges.length > 0) {
      return this.props.team.pipelines.edges.map(({ node }) => (
        <Row
          key={node.id}
          teamPipeline={node}
          onRemoveClick={this.handleTeamPipelineRemove}
          onAccessLevelChange={this.handleAccessLevelChange}
          relay={this.props.relay}
        />
      ));
    }

    if (this.props.relay.variables.pipelineSearch) {
      return null;
    }

    return (
      <Panel.Section className="dark-gray">
        There are no pipelines assigned to this team
      </Panel.Section>
    );
  }

  renderPipelineSearch() {
    const { team: { pipelines }, relay: { variables: { pipelineSearch } } } = this.props;

    if (pipelines.edges.length > 0 || pipelineSearch) {
      return (
        <div className="py2 px3">
          <SearchField
            placeholder="Search pipelines…"
            searching={this.state.searchingPipelinesIsSlow}
            onChange={this.handlePipelineSearch}
          />
        </div>
      );
    }

    return null;
  }

  renderPipelineSearchInfo() {
    const { team: { pipelines }, relay: { variables: { pipelineSearch } } } = this.props;

    if (pipelineSearch && pipelines) {
      return (
        <div className="bg-silver semi-bold py2 px3">
          <small className="dark-gray">
            {formatNumber(pipelines.count)} matching pipelines
          </small>
        </div>
      );
    }
  }

  handleTeamPipelineChoose = () => {
    this.props.relay.forceFetch();
  };

  handlePipelineSearch = (pipelineSearch) => {
    this.setState({ searchingPipelines: true });

    if (this.teamSearchIsSlowTimeout) {
      clearTimeout(this.teamSearchIsSlowTimeout);
    }

    this.teamSearchIsSlowTimeout = setTimeout(() => {
      this.setState({ searchingPipelinesIsSlow: true });
    }, 1::second);

    this.props.relay.forceFetch(
      { pipelineSearch },
      (readyState) => {
        if (readyState.done) {
          if (this.teamSearchIsSlowTimeout) {
            clearTimeout(this.teamSearchIsSlowTimeout);
          }
          this.setState({
            searchingPipelines: false,
            searchingPipelinesIsSlow: false
          });
        }
      }
    );
  };

  handleShowMorePipelines = () => {
    this.setState({ loading: true });

    let { pageSize } = this.props.relay.variables;

    pageSize += PAGE_SIZE;

    this.props.relay.setVariables(
      { pageSize },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loading: false });
        }
      }
    );
  };

  handleAccessLevelChange = (teamPipeline, accessLevel, callback) => {
    Relay.Store.commitUpdate(new TeamPipelineUpdateMutation({
      teamPipeline: teamPipeline,
      accessLevel: accessLevel
    }), { onSuccess: () => callback(null), onFailure: (transaction) => callback(transaction.getError()) });
  };

  handleTeamPipelineRemove = (teamPipeline, force, callback) => {
    Relay.Store.commitUpdate(new TeamPipelineDeleteMutation({
      teamPipeline: teamPipeline,
      force: force
    }), { onSuccess: () => callback(null), onFailure: (transaction) => callback(transaction.getError()) });
  };

  handleMutationFailure = (transaction) => {
    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  };
}

export default Relay.createContainer(Pipelines, {
  initialVariables: {
    pageSize: PAGE_SIZE,
    pipelineSearch: null
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        ${Chooser.getFragment('team')}
        pipelines(first: $pageSize, search: $pipelineSearch, order: NAME) {
          ${ShowMoreFooter.getFragment('connection')}
          count
          edges {
            node {
              id
              accessLevel
              pipeline {
                id
                name
                url
                repository {
                  url
                }
              }
              permissions {
                teamPipelineUpdate {
                  allowed
                }
                teamPipelineDelete {
                  allowed
                }
              }
              ${TeamPipelineDeleteMutation.getFragment('teamPipeline')}
              ${TeamPipelineUpdateMutation.getFragment('teamPipeline')}
            }
          }
        }
      }
    `
  }
});
