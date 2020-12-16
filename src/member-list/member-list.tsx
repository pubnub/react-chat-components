import React, { FC, useEffect } from "react";
import { UserData } from "pubnub";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  ThemeAtom,
  PubnubAtom,
  CurrentChannelAtom,
  UsersMetaAtom,
  CurrentChannelMembershipsAtom,
  CurrentChannelOccupancyAtom,
} from "../state-atoms";
import { getPubnubChannelMembers } from "../commands";
import "./member-list.scss";

export interface MemberListProps {
  /** Users to show on the list
   * "members" (default) = users associated with current channel in PubNub Objects storage
   * "subscribers" = users subscribed to the current channel (you don't need to be a member to subscribe)
   */
  show?: "members" | "subscribers";
  /** Provide custom member renderer if themes and CSS variables aren't enough */
  memberRenderer?: (props: MemberRendererProps) => JSX.Element;
}

export interface MemberRendererProps {
  member: UserData;
  memberPresent: boolean;
}

/**
 * Fetches all memberships for the current channel from PubNub Objects storage and displays them as a list of users.
 * The component also marks currently subscribed users as active.
 */
export const MemberList: FC<MemberListProps> = (props: MemberListProps) => {
  const pubnub = useRecoilValue(PubnubAtom);
  const channel = useRecoilValue(CurrentChannelAtom);
  const users = useRecoilValue(UsersMetaAtom);
  const theme = useRecoilValue(ThemeAtom);
  const [members, setMembers] = useRecoilState(CurrentChannelMembershipsAtom);
  const [presentMembers, setPresentMembers] = useRecoilState(CurrentChannelOccupancyAtom);

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

  /*
  /* Commands
  */

  const fetchMembers = async () => {
    try {
      const members = await getPubnubChannelMembers(pubnub, channel);
      setMembers(members);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPresence = async () => {
    try {
      const response = await pubnub.hereNow({ channels: [channel] });
      const presentMembers = response.channels[channel].occupants.map((u) => u.uuid);
      setPresentMembers(presentMembers);
    } catch (e) {
      console.error(e);
    }
  };

  /*
  /* Lifecycle
  */

  useEffect(() => {
    if (!pubnub) return;
    if (!members.length) fetchMembers();
    if (!presentMembers.length) fetchPresence();
  }, [channel]);

  /*
  /* Renderers
  */

  const renderMember = (member) => {
    const youString = isOwnMember(member.id) ? "(You)" : "";
    const memberPresent = presentMembers.includes(member.id);

    if (props.memberRenderer) return props.memberRenderer({ member, memberPresent });

    return (
      <div key={member.id} className="pn-member">
        {member.profileUrl && (
          <div className="pn-member__avatar">
            <img src={member.profileUrl} alt="User avatar " />
          </div>
        )}
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
        return users.filter((u) => presentMembers.includes(u.id));
      default:
        return users.filter((u) => members.includes(u.id));
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
