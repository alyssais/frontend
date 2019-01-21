/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';

import BuildStateSwitcher from 'app/components/build/StateSwitcher';

import PusherStore from 'app/stores/PusherStore';
import CentrifugeStore from 'app/stores/CentrifugeStore';

type Props = {
  pipeline: Object,
  relay: Object,
  className?: string,
  buildState?: string,
  testId?: string
};

class Builds extends React.Component {
  props: Props;

  componentDidMount() {
    PusherStore.on("websocket:event", this.handleWebsocketEvent);
    CentrifugeStore.on("websocket:event", this.handleWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("websocket:event", this.handleWebsocketEvent);
    CentrifugeStore.off("websocket:event", this.handleWebsocketEvent);
  }

  render() {
    return (
      <BuildStateSwitcher
        testId={this.props.testId}
        className={this.props.className}
        buildsCount={this.props.pipeline.builds.count}
        runningBuildsCount={this.props.pipeline.runningBuilds.count}
        scheduledBuildsCount={this.props.pipeline.scheduledBuilds.count}
        state={this.props.buildState}
        path={`/${this.props.pipeline.organization.slug}/${this.props.pipeline.slug}/builds`}
      />
    );
  }

  handleWebsocketEvent = (payload) => {
    if (payload.subevent === "project:updated" && payload.graphql.id === this.props.pipeline.id) {
      this.props.relay.forceFetch();
    }
  };
}

export default Relay.createContainer(Builds, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        id
        slug
        organization {
          slug
        }
        builds {
          count
        }
        scheduledBuilds: builds(state: SCHEDULED) {
          count
        }
        runningBuilds: builds(state: RUNNING) {
          count
        }
      }
    `
  }
});
