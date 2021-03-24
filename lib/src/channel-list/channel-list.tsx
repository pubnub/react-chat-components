import React, { FC, ReactNode } from "react";
import { useRecoilValue } from "recoil";
import { ChannelMetadataObject, ObjectCustom } from "pubnub";
import { ThemeAtom, CurrentChannelAtom } from "../state-atoms";
import "./channel-list.scss";

export interface ChannelListProps {
  children?: ReactNode;
  /** Pass a list of channels, including metadata, to render on the list */
  channelList: ChannelMetadataObject<ObjectCustom>[] | string[];
  /** Channels are sorted alphabetically by default, you can override that by providing a sorter function */
  sort?: (
    a: ChannelMetadataObject<ObjectCustom>,
    b: ChannelMetadataObject<ObjectCustom>
  ) => -1 | 0 | 1;
  /** Provide an additional channel filter to hide some of the channels */
  filter?: (channel: ChannelMetadataObject<ObjectCustom>) => boolean;
  /** Provide custom channel renderer to override default themes and CSS variables. */
  channelRenderer?: (channel: ChannelMetadataObject<ObjectCustom>) => JSX.Element;
  /** A callback run when user clicked one of the channels. Can be used to switch current channel. */
  onChannelSwitched?: (channel: ChannelMetadataObject<ObjectCustom>) => unknown;
}

/**
 * Renders an interactive list of channels. It can represent all channels of the application, only
 * channels joined by the current user, all channels available to be joined or whatever else is
 * passed into it. A common patttern in Chat Applications is to render two instances of the
 * component - one visible all the time to show joined channels, and another one hidden inside of a
 * modal with channels available to join. Make sure to handle onChannelSwitched event to switch
 * current channel passed to the Chat provider, or whatever else is expected.
 */
export const ChannelList: FC<ChannelListProps> = (props: ChannelListProps) => {
  const channel = useRecoilValue(CurrentChannelAtom);
  const theme = useRecoilValue(ThemeAtom);

  /*
  /* Helper functions
  */
  const isChannelActive = (ch: ChannelMetadataObject<ObjectCustom>) => {
    return channel === ch.id;
  };

  const channelSorter = (
    a: ChannelMetadataObject<ObjectCustom>,
    b: ChannelMetadataObject<ObjectCustom>
  ) => {
    if (props.sort) return props.sort(a, b);
    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  };

  const channelFilter = (channel: ChannelMetadataObject<ObjectCustom>) => {
    if (props.filter) return props.filter(channel);
    return true;
  };

  const channelFromString = (channel: ChannelMetadataObject<ObjectCustom> | string) => {
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

  const switchChannel = (channel: ChannelMetadataObject<ObjectCustom>) => {
    if (props.onChannelSwitched) props.onChannelSwitched(channel);
  };

  /*
  /* Renderers
  */

  const renderChannel = (channel: ChannelMetadataObject<ObjectCustom>) => {
    if (props.channelRenderer) return props.channelRenderer(channel);
    const channelActive = isChannelActive(channel);
    const activeClass = channelActive ? "pn-channel--active" : "";

    return (
      <div
        key={channel.id}
        className={`pn-channel ${activeClass}`}
        onClick={() => switchChannel(channel)}
      >
        {channel.custom?.thumb && (
          <img
            className="pn-channel__thumb"
            src={channel.custom?.thumb as string}
            alt="Channel thumb"
          />
        )}
        <div className="pn-channel__title">
          <p className="pn-channel__name">{channel.name}</p>
          {channel.description && <p className="pn-channel__description">{channel.description}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className={`pn-channel-list pn-channel-list--${theme}`}>
      {(props.channelList as string[])
        .map(channelFromString)
        .filter(channelFilter)
        .sort(channelSorter)
        .map(renderChannel)}

      <>{props.children}</>
    </div>
  );
};
