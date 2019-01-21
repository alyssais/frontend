/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import throttle from 'throttleit';
import { seconds } from 'metrick/duration';

import PusherStore from 'app/stores/PusherStore';
import CentrifugeStore from 'app/stores/CentrifugeStore';

import { formatNumber } from 'app/lib/number';

// We need a `requestUpdate` queue above the React component level so
// AgentsCount components will only perform one `forceFetch` in any
// given time window. I wish this was cleaner, kid, I really do.
const requestUpdate = throttle((callback) => callback(), 3::seconds);

type Props = {
  organization?: { agents?: { count: number } },
  relay: Object
};

class AgentsCount extends React.PureComponent {
  props: Props;

  state = {
    agentCount: this.props.organization.agents ? this.props.organization.agents.count : 0
  };

  componentDidMount() {
    PusherStore.on('organization_stats:change', this.handleWebsocketEvent);
    CentrifugeStore.on('organization_stats:change', this.handleWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off('organization_stats:change', this.handleWebsocketEvent);
    CentrifugeStore.off('organization_stats:change', this.handleWebsocketEvent);
  }

  // Like in MyBuilds, we don't take the Pusher data for granted - we instead
  // take it as a cue to update the data store backing the component.
  handleWebsocketEvent = ({ agentsConnectedCount }) => {
    // We need a "global" last agents connected count so we only ask it to update
    // once per changed count. This prevents calls from multiple AgentsCount
    // components triggering repeated forceFetch calls for one Pusher event
    if (AgentsCount.lastAgentsConnectedCount !== agentsConnectedCount) {
      AgentsCount.lastAgentsConnectedCount = agentsConnectedCount;
      requestUpdate(() => this.props.relay.forceFetch());
    }
  };

  // Only once Relay comes back with an updated agentCount do we trust that data!
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.organization.agents) {
      this.setState({ agentCount: nextProps.organization.agents.count });
    }
  };

  render() {
    return (
      <span>
        {formatNumber(this.state.agentCount)}
      </span>
    );
  }
}

export default Relay.createContainer(AgentsCount, {
  fragments: {
    organization: () => Relay.QL`
        fragment on Organization {
          agents {
            count
          }
        }
      `
  }
});
