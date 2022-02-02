import React, { FC, ReactNode } from "react";
import { useAtom } from "jotai";
import { ChannelMetadataObject, ObjectCustom } from "pubnub";
import { ThemeAtom, CurrentChannelAtom } from "../state-atoms";
import "./channel-list.scss";

export interface ChannelListProps {
  children?: ReactNode;
  /** Option to pass a list of channels, including metadata, to render on the list. */
  channels: ChannelMetadataObject<ObjectCustom>[] | string[];
  /** Option to provide an extra actions renderer to add custom action buttons to each channel. */
  extraActionsRenderer?: (channel: ChannelMetadataObject<ObjectCustom>) => JSX.Element;
  titleRenderer?: (channel: ChannelMetadataObject<ObjectCustom>) => JSX.Element;
  /** Option to provide a custom channel renderer to override default themes and CSS variables. */
  channelRenderer?: (channel: ChannelMetadataObject<ObjectCustom>) => JSX.Element;
  /** Callback run when a user clicked one of the channels. Can be used to switch the current channel. */
  onChannelSwitched?: (channel: ChannelMetadataObject<ObjectCustom>) => unknown;
  /** Provide a custom sorter function to sort the channels. */
  channelSorter?: (
    a: ChannelMetadataObject<ObjectCustom>,
    b: ChannelMetadataObject<ObjectCustom>
  ) => number;
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
export const ChannelList: FC<ChannelListProps> = (props: ChannelListProps) => {
  const [currentChannel] = useAtom(CurrentChannelAtom);
  const [theme] = useAtom(ThemeAtom);

  /*
  /* Helper functions
  */
  const isChannelActive = (ch: ChannelMetadataObject<ObjectCustom>) => {
    return currentChannel === ch.id;
  };

  const channelSorter = (
    a: ChannelMetadataObject<ObjectCustom>,
    b: ChannelMetadataObject<ObjectCustom>
  ) => {
    return a?.name?.localeCompare(b.name, "en", { sensitivity: "base" });
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
          {props.titleRenderer ? (
            props.titleRenderer(channel)
          ) : (
            <>
              <p className="pn-channel__name">{channel.name || channel.id}</p>
              {channel.description && (
                <p className="pn-channel__description">{channel.description}</p>
              )}
            </>
          )}
        </div>
        <div className="pn-channel__actions">
          {props.extraActionsRenderer && props.extraActionsRenderer(channel)}
        </div>
      </div>
    );
  };

  return (
    <div className={`pn-channel-list pn-channel-list--${theme}`}>
      {(props.channels as string[])
        .map(channelFromString)
        .sort(props.channelSorter ? props.channelSorter : channelSorter)
        .map(renderChannel)}
      <>{props.children}</>
    </div>
  );
};
