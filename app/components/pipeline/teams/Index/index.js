import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import Emojify from 'app/components/shared/Emojify';
import Panel from 'app/components/shared/Panel';

import Chooser from './chooser';
import Row from './row';

class PipelineTeamIndex extends React.Component {
  static propTypes = {
    pipeline: PropTypes.shape({
      name: PropTypes.string.isRequired,
      organization: PropTypes.object.isRequired,
      teams: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              id: PropTypes.string.isRequired
            }).isRequired
          }).isRequired
        )
      }).isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Teams · ${this.props.pipeline.name}`}>
        <div>
          <Panel>
            <Panel.Header>Teams</Panel.Header>
            <Panel.IntroWithButton>
              <span>Teams allow you to control who has access to this pipeline.</span>
              <Chooser
                pipeline={this.props.pipeline}
                onChoose={this.handleTeamChoose}
              />
            </Panel.IntroWithButton>
            {this.renderRows()}
          </Panel>
        </div>
      </DocumentTitle>
    );
  }

  renderRows() {
    if (this.props.pipeline.teams.edges.length > 0) {
      return this.props.pipeline.teams.edges.map((edge) => {
        return (
          <Row
            key={edge.node.id}
            teamPipeline={edge.node}
            organization={this.props.pipeline.organization}
          />
        );
      });
    }

    return (
      <Panel.Row>
        <div className="dark-gray py2 center">
          <Emojify text="This Pipeline has not been added to any teams yet" />
        </div>
      </Panel.Row>
    );
  }

  handleTeamChoose = () => {
    this.props.relay.forceFetch();
  };
}

export default Relay.createContainer(PipelineTeamIndex, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        name
        ${Chooser.getFragment('pipeline')}
        organization {
          ${Row.getFragment('organization')}
        }
        teams(first: 500) {
          edges {
            node {
              id
              ${Row.getFragment('teamPipeline')}
            }
          }
        }
      }
    `
  }
});
