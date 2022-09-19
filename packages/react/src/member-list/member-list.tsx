import React, { FC } from "react";
import {
  CommonMemberListProps,
  UserEntity,
  getNameInitials,
  getPredefinedColor,
  useMemberListCore,
} from "@pubnub/common-chat-components";
import "./member-list.scss";

export type MemberListProps = CommonMemberListProps;

/**
 * Renders a list of members.
 *
 * It can represent all users of the application, only members of
 * the current channel, users currently subscribed/present on the channel, or whatever else is passed
 * into it. Custom memberRenderer can be used to modify how the users are rendered. For example
 * you can add presence indicators.
 */
export const MemberList: FC<MemberListProps> = (props: MemberListProps) => {
  const { clickMember, isOwnMember, isPresentMember, memberFromString, memberSorter, theme } =
    useMemberListCore(props);

  /*
  /* Renderers
  */

  const renderMember = (member: UserEntity) => {
    if (props.memberRenderer) return props.memberRenderer(member);
    const youString = isOwnMember(member.id) ? props.selfText : "";

    return (
      <div key={member.id} className="pn-member" onClick={() => clickMember(member)}>
        <div
          className="pn-member__avatar"
          style={{ backgroundColor: getPredefinedColor(member.id) }}
        >
          {member.profileUrl ? (
            <img src={member.profileUrl} alt="User avatar" />
          ) : (
            getNameInitials(member.name || member.id)
          )}
          {isPresentMember(member.id) && <i className="pn-member__presence"></i>}
        </div>
        <div className="pn-member__main">
          <p className="pn-member__name">
            {member.name} {youString}
          </p>
          <p className="pn-member__title">{member.custom?.title}</p>
        </div>
        <div className="pn-member__actions">
          {props.extraActionsRenderer && props.extraActionsRenderer(member)}
        </div>
      </div>
    );
  };

  return (
    <div className={`pn-member-list pn-member-list--${theme}`}>
      {(props.members as string[]).map(memberFromString).sort(memberSorter).map(renderMember)}
      <>{props.children}</>
    </div>
  );
};

MemberList.defaultProps = {
  members: [],
  presentMembers: [],
  onMemberClicked: null,
  selfText: "(You)",
};
