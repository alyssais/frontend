/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import Emojify from 'app/components/shared/Emojify';
import TeamLabels from 'app/components/team/Labels';

type Props = {
  team: {
    id: string,
    uuid: string,
    name: string,
    description?: string
  },
  checked: boolean,
  onChange: Function
};

class MemberTeamRow extends React.Component {
  props: Props;

  render() {
    return (
      <div className="col-12 md-col-6 lg-col-4 py1">
        <label className="block cursor-pointer px1 pb1">
          <div className="flex items-start">
            <div className="pr2" style={{ lineHeight: 1.75 }}>
              <input
                className="checkbox"
                type="checkbox"
                checked={this.props.checked}
                onChange={this.handleChange}
              />
            </div>
            <div className="flex flex-column">
              <div className="flex items-center m0 relative" style={{ lineHeight: 1.75 }}>
                <Emojify text={this.props.team.name} className="semi-bold truncate" />
                <TeamLabels team={this.props.team} />
              </div>
              {this._renderDescription()}
            </div>
          </div>
        </label>
      </div>
    );
  }

  handleChange = () => {
    this.props.onChange(this.props.team);
  };

  _renderDescription() {
    if (!this.props.team.description) {
      return null;
    }

    return (
      <div className="m0 p0 dark-gray h5 regular" style={{ lineHeight: 1.4 }}>
        <Emojify text={this.props.team.description} />
      </div>
    );
  }
}

export default createFragmentContainer(MemberTeamRow, graphql`
  fragment MemberTeamRow_team on Team {
    ...TeamLabels_team

    id
    uuid
    name
    description
  }
`);

