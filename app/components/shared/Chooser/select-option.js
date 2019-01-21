/* @flow */
import React from 'react';
import classNames from 'classnames';

import Spinner from 'app/components/shared/Spinner';
import Icon from 'app/components/shared/Icon';

import Option from './option';

export type SelectOptionProps = {
  value: string,
  label: string,
  description: number | string | React.Element | Array<any>,
  saving?: boolean,
  selected?: boolean
};

function SelectOption(props: SelectOptionProps) {
  return (
    <Option value={props.value} className={classNames("btn block hover-bg-silver", { "bg-silver": props.selected })}>
      <div className="flex items-top">
        <div className="flex-none">
          <SelectIcon saving={props.saving} selected={props.selected} />
        </div>
        <div>
          <span className="semi-bold block">{props.label}</span>
          <small className="regular dark-gray">{props.description}</small>
        </div>
      </div>
    </Option>
  );
}

SelectOption.displayName = "Chooser.SelectOption";

export type SelectIconProps = {
  saving: boolean,
  selected: boolean
};

function SelectIcon(props: SelectIconProps) {
  const size = 25;

  if (props.saving) {
    return (
      <div className="inline-block relative" style={{ width: size, height: size }}>
        <Spinner className="fit absolute" size={16} color={false} style={{ left: 3 }} />
      </div>
    );
  }

  const tickColor = props.selected ? "green" : "dark-gray";

  return (
    <Icon icon="permission-small-tick" className={classNames(tickColor, "relative")} style={{ width: size, height: size, top: -3, left: -2 }} />
  );
}

export default SelectOption;
