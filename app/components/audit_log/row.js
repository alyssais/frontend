import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';

import FriendlyTime from '../shared/FriendlyTime';
import RevealableDownChevron from '../shared/Icon/RevealableDownChevron';
import Panel from '../shared/Panel';
import UserAvatar from '../shared/UserAvatar';

import AuditLogDrawer from './Drawer';

import { indefiniteArticleFor } from '../../lib/words';

import cssVariables from '../../css';

const TransitionMaxHeight = styled.div`
  transition: max-height 400ms;
`;

class AuditLogRow extends React.PureComponent {
  static propTypes = {
    auditEvent: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      occurredAt: PropTypes.string.isRequired,
      actor: PropTypes.shape({
        name: PropTypes.string,
        node: PropTypes.shape({
          name: PropTypes.string,
          avatar: PropTypes.shape({
            url: PropTypes.string
          })
        })
      }).isRequired,
      subject: PropTypes.shape({
        name: PropTypes.string,
        node: PropTypes.shape({
          name: PropTypes.string
        })
      }).isRequired,
      context: PropTypes.shape({
        __typename: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    isExpanded: false,
    loading: false
  };

  getContextName() {
    return this.props.auditEvent.context.__typename.replace(/^Audit|Context$/g, '');
  }

  render() {
    const actorName = this.props.auditEvent.actor.name || this.props.auditEvent.actor.node && this.props.auditEvent.actor.node.name;

    return (
      <Panel.Row>
        <div>
          <div
            className="flex items-center cursor-pointer hover-bg-silver mxn3 py2 px3"
            style={{
              marginTop: -10,
              // this is a hack to give the expandable section
              // a top border, without it taking up any space
              boxShadow: `0 1px 0 ${cssVariables['--gray']}`
            }}
            onClick={this.handleHeaderClick}
          >
            <div className="flex-auto flex items-center">
              {this.props.auditEvent.actor.node && (
                <div className="flex-none self-start icon-mr">
                  <UserAvatar
                    style={{ width: 39, height: 39 }}
                    user={this.props.auditEvent.actor.node}
                  />
                </div>
              )}
              <div className="flex-auto md-flex lg-flex items-center">
                <h2 className="flex-auto line-height-3 font-size-1 h4 regular m0">
                  <span className="semi-bold">{actorName}</span>
                  <br />
                  {this.renderEventSentence()}
                </h2>
                <FriendlyTime
                  className="flex-none dark-gray"
                  value={this.props.auditEvent.occurredAt}
                />
              </div>
            </div>
            <div className="flex-none ml2">
              <RevealableDownChevron
                className="dark-gray"
                revealed={this.state.isExpanded}
              />
            </div>
          </div>
          <TransitionMaxHeight
            className="mxn3 overflow-hidden"
            style={{
              marginBottom: -10,
              maxHeight: this.state.isExpanded ? '80vh' : 0,
              overflowY: 'auto',
              overflowScrolling: 'touch',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <AuditLogDrawer
              auditEvent={this.props.auditEvent}
              hasExpanded={this.props.relay.variables.hasExpanded}
              loading={this.state.loading}
            />
          </TransitionMaxHeight>
        </div>
      </Panel.Row>
    );
  }

  renderEventSentence() {
    const { type, subject } = this.props.auditEvent;

    // "ORGANIZATION_CREATED" => ["Organization", "Created"]
    const eventTypeSplit = type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase());

    // Last word of event type is the verb
    const eventVerb = eventTypeSplit.pop();

    // The remainder is presumed to be the subject type
    const eventSubjectType = eventTypeSplit.join(' ').toLowerCase();

    // Default subject - something like "a pipeline," "an organization"
    let renderedSubject = `${indefiniteArticleFor(eventSubjectType)} ${eventSubjectType}`;

    // Check we have a name for the subject, with fallback to the node if present
    const subjectName = subject.name || subject.node && subject.node.name;

    if (subjectName) {
      renderedSubject = `${eventSubjectType} “${subjectName}”`;

      if (type === 'ORGANIZATION_CREATED') {
        renderedSubject = `${renderedSubject} 🎉`;
      }
    }

    return `${eventVerb} ${renderedSubject}`;
  }

  handleHeaderClick = () => {
    const isExpanded = !this.state.isExpanded;

    this.setState({
      loading: true,
      isExpanded
    }, () => {
      this.props.relay.setVariables(
        {
          hasExpanded: true
        },
        (readyState) => {
          if (readyState.done) {
            this.setState({ loading: false });
          }
        }
      );
    });
  };
}

export default Relay.createContainer(AuditLogRow, {
  initialVariables: {
    hasExpanded: false
  },

  fragments: {
    auditEvent: ({ hasExpanded }) => Relay.QL`
      fragment on AuditEvent {
        ${AuditLogDrawer.getFragment('auditEvent', { hasExpanded })}
        uuid
        type
        occurredAt
        actor {
          name
          node {
            ...on User {
              name
              avatar {
                url
              }
            }
          }
        }
        subject {
          name
          node {
            ...on Organization {
              name
            }
            ...on Pipeline {
              name
            }
          }
        }
        context {
          __typename
        }
      }
    `
  }
});
