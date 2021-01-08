import React, { FC } from "react";
import { UserData } from "pubnub";
import { usePubNub } from "pubnub-react";
import { useRecoilValue } from "recoil";
import {
  ThemeAtom,
  UsersMetaAtom,
  CurrentChannelMembershipsAtom,
  CurrentChannelOccupancyAtom,
} from "../state-atoms";
import "./member-list.scss";

export interface MemberListProps {
  /** Users to show on the list
   * "members" (default) = users associated with current channel in PubNub Objects storage
   * "subscribers" = users subscribed to the current channel (you don't need to be a member to subscribe)
   */
  show?: "members" | "subscribers";
  /** Provide custom user renderer to override themes and CSS variables. */
  userRenderer?: (props: UserRendererProps) => JSX.Element;
}

export interface UserRendererProps {
  member: UserData;
  memberPresent: boolean;
}

/**
 * Fetches all memberships for the current channel from PubNub Objects storage and displays them as a list of users.
 * The component also marks currently subscribed users as active.
 */
export const MemberList: FC<MemberListProps> = (props: MemberListProps) => {
  const pubnub = usePubNub();

  const users = useRecoilValue(UsersMetaAtom);
  const theme = useRecoilValue(ThemeAtom);
  const members = useRecoilValue(CurrentChannelMembershipsAtom);
  const presentMembers = useRecoilValue(CurrentChannelOccupancyAtom);

  /*
  /* Helper functions
  */

  const isOwnMember = (uuid: string) => {
    return pubnub.getUUID() === uuid;
  };

  const memberSorter = (a, b) => {
    const pres = presentMembers;

    if (isOwnMember(a.id)) return -1;
    if (isOwnMember(b.id)) return 1;

    if (pres.includes(a.id) && !pres.includes(b.id)) return -1;
    if (pres.includes(b.id) && !pres.includes(a.id)) return 1;

    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  };

  const userFromString = (uuid) => ({
    id: uuid,
    name: uuid,
  });

  /*
  /* Renderers
  */

  const renderMember = (member) => {
    const youString = isOwnMember(member.id) ? "(You)" : "";
    const memberPresent = presentMembers.includes(member.id);

    if (props.userRenderer) return props.userRenderer({ member, memberPresent });

    return (
      <div key={member.id} className="pn-member">
        <div className="pn-member__avatar">
          {member?.profileUrl && <img src={member.profileUrl} alt="User avatar " />}
          {!member?.profileUrl && <div className="pn-member__avatar-placeholder" />}
        </div>
        {props.show !== "subscribers" && memberPresent && <span className="pn-member__presence" />}
        <div className="pn-member__main">
          <p className="pn-member__name">
            {member.name} {youString}
          </p>
          <p className="pn-member__title">{member?.custom?.title}</p>
        </div>
      </div>
    );
  };

  const renderUsers = ((type) => {
    switch (type) {
      case "subscribers":
        return presentMembers.map((id) => users.find((u) => u.id === id) || userFromString(id));
      default:
        return members.map((id) => users.find((u) => u.id === id) || userFromString(id));
    }
  })(props.show);

  return (
    <div className={`pn-member-list pn-member-list--${theme}`}>
      {[...renderUsers].sort((a, b) => memberSorter(a, b)).map((m) => renderMember(m))}
    </div>
  );
};

MemberList.defaultProps = {
  show: "members",
};
