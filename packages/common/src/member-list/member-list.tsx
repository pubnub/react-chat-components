import { ReactNode } from "react";
import { usePubNub } from "pubnub-react";
import { useAtom } from "jotai";
import { UserEntity } from "../types";
import { ThemeAtom } from "../state-atoms";

export interface CommonMemberListProps {
  children?: ReactNode;
  /** Option to pass a list of members, including metadata, to render on the list. */
  members: UserEntity[] | string[];
  /** Option to pass a list of present member IDs to mark them with a presence indicator. */
  presentMembers?: string[];
  /** This text will be added after current user's name */
  selfText?: string;
  /** Members are sorted by presence and alphabetically by default, you can override that by providing a sorter function */
  sort?: (a: UserEntity, b: UserEntity) => -1 | 0 | 1;
  /** Provide extra actions renderer to add custom action buttons to each member */
  extraActionsRenderer?: (member: UserEntity) => JSX.Element;
  /** Option to provide a custom user renderer to override themes and CSS variables. */
  memberRenderer?: (member: UserEntity) => JSX.Element;
  /** A callback run when user clicked one of the members. */
  onMemberClicked?: (member: UserEntity) => unknown;
}

/**
 * Renders a list of members.
 *
 * It can represent all users of the application, only members of
 * the current channel, users currently subscribed/present on the channel, or whatever else is passed
 * into it. Custom memberRenderer can be used to modify how the users are rendered. For example
 * you can add presence indicators.
 */
export const useMemberListCore = (props: CommonMemberListProps) => {
  const pubnub = usePubNub();
  const [theme] = useAtom(ThemeAtom);

  /*
  /* Helper functions
  */

  const isOwnMember = (uuid: string) => {
    return pubnub.getUUID() === uuid;
  };

  const isPresentMember = (uuid: string) => {
    return props.presentMembers?.includes(uuid);
  };

  const memberSorter = (a, b) => {
    if (props.sort) return props.sort(a, b);

    if (isOwnMember(a.id)) return -1;
    if (isOwnMember(b.id)) return 1;

    if (isPresentMember(a.id) && !isPresentMember(b.id)) return -1;
    if (isPresentMember(b.id) && !isPresentMember(a.id)) return 1;

    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  };

  const memberFromString = (member: UserEntity | string) => {
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

  const clickMember = (member: UserEntity) => {
    if (props.onMemberClicked) props.onMemberClicked(member);
  };

  return {
    clickMember,
    isOwnMember,
    isPresentMember,
    memberFromString,
    memberSorter,
    theme,
  };
};
