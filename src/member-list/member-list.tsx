import React, { FC, ReactNode } from "react";
import { UserData } from "pubnub";
import { usePubNub } from "pubnub-react";
import { useRecoilValue } from "recoil";
import { ThemeAtom } from "../state-atoms";
import "./member-list.scss";

export interface MemberListProps {
  children?: ReactNode;
  /** Pass a list of members, including metadata, to render on the list */
  memberList: UserData[] | string[];
  /** Members are sorted alphabetically by default, you can override that by providing a sorter function */
  sort?: (a: UserData, b: UserData) => -1 | 0 | 1;
  /** Provide an additional member filter to hide some of the members */
  filter?: (member: UserData) => boolean;
  /** Provide custom user renderer to override themes and CSS variables. */
  memberRenderer?: (member: UserData) => JSX.Element;
}

/**
 * Renders a list of members. It can represent all users of the application, only members of
 * the current channel, users currently subscribed/present on the channel or whatever else is passed
 * into it. Custom memberRenderer can be used to modify how the users are rendered, so for example
 * presence indicators can be added.
 */
export const MemberList: FC<MemberListProps> = (props: MemberListProps) => {
  const pubnub = usePubNub();
  const theme = useRecoilValue(ThemeAtom);

  /*
  /* Helper functions
  */

  const isOwnMember = (uuid: string) => {
    return pubnub.getUUID() === uuid;
  };

  const memberSorter = (a, b) => {
    if (props.sort) return props.sort(a, b);

    if (isOwnMember(a.id)) return -1;
    if (isOwnMember(b.id)) return 1;

    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  };

  const memberFilter = (member: UserData) => {
    if (props.filter) return props.filter(member);
    return true;
  };

  const memberFromString = (member: UserData | string) => {
    if (typeof member === "string") {
      return {
        id: member,
        name: member,
      };
    }
    return member;
  };

  /*
  /* Renderers
  */

  const renderMember = (member) => {
    if (props.memberRenderer) return props.memberRenderer(member);
    const youString = isOwnMember(member.id) ? "(You)" : "";

    return (
      <div key={member.id} className="pn-member">
        <div className="pn-member__avatar">
          {member?.profileUrl && <img src={member.profileUrl} alt="User avatar " />}
          {!member?.profileUrl && <div className="pn-member__avatar-placeholder" />}
        </div>
        <div className="pn-member__main">
          <p className="pn-member__name">
            {member.name} {youString}
          </p>
          <p className="pn-member__title">{member?.custom?.title}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`pn-member-list pn-member-list--${theme}`}>
      {(props.memberList as string[])
        .map(memberFromString)
        .filter(memberFilter)
        .sort(memberSorter)
        .map(renderMember)}

      <>{props.children}</>
    </div>
  );
};
