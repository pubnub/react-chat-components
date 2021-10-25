import React, { FC, ReactNode } from "react";
import { UUIDMetadataObject, ObjectCustom } from "pubnub";
import { usePubNub } from "pubnub-react";
import { useAtom } from "jotai";
import { ThemeAtom } from "../state-atoms";
import { getNameInitials, getPredefinedColor } from "../helpers";
import "./member-list.scss";

export interface MemberListProps {
  children?: ReactNode;
  /** Option to pass a list of members, including metadata, to render on the list. */
  members: UUIDMetadataObject<ObjectCustom>[] | string[];
  /** Option to pass a list of present member IDs to mark them with a presence indicator. */
  presentMembers?: string[];
  /** This text will be added after current user's name */
  selfText?: string;
  /** Provide extra actions renderer to add custom action buttons to each member */
  extraActionsRenderer?: (member: UUIDMetadataObject<ObjectCustom>) => JSX.Element;
  /** Option to provide a custom user renderer to override themes and CSS variables. */
  memberRenderer?: (member: UUIDMetadataObject<ObjectCustom>) => JSX.Element;
  /** A callback run when user clicked one of the members. */
  onMemberClicked?: (member: UUIDMetadataObject<ObjectCustom>) => unknown;
}

/**
 * Renders a list of members. It can represent all users of the application, only members of
 * the current channel, users currently subscribed/present on the channel, or whatever else is passed
 * into it. Custom memberRenderer can be used to modify how the users are rendered. For example
 * you can add presence indicators.
 */
export const MemberList: FC<MemberListProps> = (props: MemberListProps) => {
  const pubnub = usePubNub();
  const [theme] = useAtom(ThemeAtom);

  /*
  /* Helper functions
  */

  const isOwnMember = (uuid: string) => {
    return pubnub.getUUID() === uuid;
  };

  const isPresentMember = (uuid: string) => {
    return props.presentMembers.includes(uuid);
  };

  const memberSorter = (a, b) => {
    if (isOwnMember(a.id)) return -1;
    if (isOwnMember(b.id)) return 1;

    if (isPresentMember(a.id) && !isPresentMember(b.id)) return -1;
    if (isPresentMember(b.id) && !isPresentMember(a.id)) return 1;

    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  };

  const memberFromString = (member: UUIDMetadataObject<ObjectCustom> | string) => {
    if (typeof member === "string") {
      return {
        id: member,
        name: member,
      };
    }
    return member;
  };

  /*
  /* Commands
  */

  const clickMember = (member: UUIDMetadataObject<ObjectCustom>) => {
    if (props.onMemberClicked) props.onMemberClicked(member);
  };

  /*
  /* Renderers
  */

  const renderMember = (member: UUIDMetadataObject<ObjectCustom>) => {
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
