import { ReactNode } from "react";
import { useAtom } from "jotai";
import { ChannelEntity } from "../types";
import { ThemeAtom, CurrentChannelAtom } from "../state-atoms";

export interface CommonChannelListProps {
  children?: ReactNode;
  /** Option to pass a list of channels, including metadata, to render on the list. */
  channels: ChannelEntity[] | string[];
  /** Channels are sorted alphabetically by default, you can override that by providing a sorter function */
  sort?: (a: ChannelEntity, b: ChannelEntity) => -1 | 0 | 1;
  /** Option to provide an extra actions renderer to add custom action buttons to each channel. */
  extraActionsRenderer?: (channel: ChannelEntity) => JSX.Element;
  /** Option to provide a custom channel renderer to override default themes and CSS variables. */
  channelRenderer?: (channel: ChannelEntity) => JSX.Element;
  /** Callback run when a user clicked one of the channels. Can be used to switch the current channel. */
  onChannelSwitched?: (channel: ChannelEntity) => unknown;
}

/**
 * Renders an interactive list of channels.
 *
 * It can represent all channels of the application, only
 * channels joined by the current user, all channels available to be joined, or whatever else is
 * passed into it. A common pattern in chat applications is to render two instances of the
 * component - one visible all the time to show joined channels, and another one hidden inside a
 * modal with channels available to join. Make sure to handle the onChannelSwitched event to switch
 * the current channel passed to the Chat provider.
 */
export const useChannelListCore = (props: CommonChannelListProps) => {
  const [currentChannel] = useAtom(CurrentChannelAtom);
  const [theme] = useAtom(ThemeAtom);

  /*
  /* Helper functions
  */
  const isChannelActive = (ch: ChannelEntity) => {
    return currentChannel === ch.id;
  };

  const channelSorter = (a: ChannelEntity, b: ChannelEntity) => {
    if (props.sort) return props.sort(a, b);
    return a?.name?.localeCompare(b.name as string, "en", { sensitivity: "base" });
  };

  const channelFromString = (channel: ChannelEntity | string) => {
    if (typeof channel === "string") {
      return {
        id: channel,
        name: channel,
      };
    }
    return channel;
  };

  /*
  /* Commands
  */

  const switchChannel = (channel: ChannelEntity) => {
    if (props.onChannelSwitched) props.onChannelSwitched(channel);
  };

  return { channelFromString, channelSorter, isChannelActive, switchChannel, theme };
};
