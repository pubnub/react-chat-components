import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import {
  CurrentChannelMembershipsAtom,
  CurrentChannelOccupancyAtom,
  ThemeAtom,
} from "../state-atoms";
import "./occupancy-indicator.scss";

export interface OccupancyIndicatorProps {
  /** Show members currently present/subscribed to the channel */
  showPresentMembers?: boolean;
  /** Show number of total memberships to the channel */
  showTotalMembers?: boolean;
  /** A callback run on component click */
  onClick?: () => unknown;
}

export const OccupancyIndicator: FC<OccupancyIndicatorProps> = (props: OccupancyIndicatorProps) => {
  const theme = useRecoilValue(ThemeAtom);
  const members = useRecoilValue(CurrentChannelMembershipsAtom);
  const presentMembers = useRecoilValue(CurrentChannelOccupancyAtom);

  return (
    <div
      className={`pn-occupancy-indicator pn-occupancy-indicator--${theme}`}
      onClick={props.onClick}
    >
      {props.showPresentMembers && <span>{presentMembers.length}</span>}
      {props.showTotalMembers && <span> / {members.length}</span>}
    </div>
  );
};

OccupancyIndicator.defaultProps = {
  showPresentMembers: true,
  showTotalMembers: true,
};
