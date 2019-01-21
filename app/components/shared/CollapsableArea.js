/* @flow */
import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import RevealableDownChevron from './Icon/RevealableDownChevron';

const TransitionMaxHeight = styled.div`
  transition: max-height 400ms;
`;

type Props = {
  children: number | string | React.Element | Array<any>,
  collapsed?: boolean,
  label: string,
  onToggle: Function,
  // TODO: maxHeight is a bit of a hack, and might break for responsive
  // pages. We could instead use JS to calculate the height, and remove this
  // property altogether.
  maxHeight: number
};

// Helps to create collapsable area's, such as optional sets of form fields.
// It's up to the responsibility of the caller to set the tabIndex to -1 for
// any focusable elements (such as text inputs) when the area is collapsed
export default class CollapsableArea extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      uuid: uuid(),
      animating: false
    };
  }

  props: Props;

  static defaultProps = {
    collapsed: true
  }

  render() {
    return (
      <div>
        <button
          type="button"
          className="unstyled-button bold lime hover-dark-lime outline-none"
          aria-expanded={!this.props.collapsed}
          aria-controls={this.state.uuid}
          onClick={this.handleButtonClick}
        >
          {this.props.label}
          <RevealableDownChevron
            revealed={!this.props.collapsed}
            style={{ marginLeft: 6, marginTop: -1 }}
          />
        </button>
        <TransitionMaxHeight
          className={classNames("relative", {
            // We don't want to hide any input outlines when the form is expanded
            "overflow-hidden": this.props.collapsed || this.state.animating
          })}
          aria-expanded={!this.props.collapsed}
          id={this.state.uuid}
          style={{ maxHeight: this.props.collapsed ? 0 : this.props.maxHeight }}
          onTransitionEnd={this.handleOptionsHeightTransitionEnd}
        >
          <div className="pt1">
            {this.props.children}
          </div>
        </TransitionMaxHeight>
      </div>
    );
  }

  handleButtonClick = (event) => {
    event.preventDefault();

    this.setState({ animating: true });

    this.props.onToggle(event);
  }

  handleOptionsHeightTransitionEnd = () => {
    this.setState({ animating: false });
  }
}
