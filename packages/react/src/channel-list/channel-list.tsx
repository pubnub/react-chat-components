import React, { FC } from "react";
import {
  ChannelEntity,
  CommonChannelListProps,
  useChannelListCore,
} from "@pubnub/common-chat-components";
import "./channel-list.scss";

export type ChannelListProps = CommonChannelListProps;

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
  const { channelFromString, channelSorter, isChannelActive, switchChannel, theme } =
    useChannelListCore(props);

  /*
  /* Renderers
  */
  const renderChannel = (channel: ChannelEntity) => {
    if (props.channelRenderer) return props.channelRenderer(channel);
    const channelActive = isChannelActive(channel);
    const activeClass = channelActive ? "pn-channel--active" : "";

    return (
      <div
        key={channel.id}
        className={`pn-channel ${activeClass}`}
        onClick={() => switchChannel(channel)}
      >
        {channel.custom?.profileUrl && (
          <img
            className="pn-channel__thumb"
            src={channel.custom?.profileUrl as string}
            alt="Channel thumb"
          />
        )}
        <div className="pn-channel__title">
          <p className="pn-channel__name">{channel.name || channel.id}</p>
          {channel.description && <p className="pn-channel__description">{channel.description}</p>}
        </div>
        <div className="pn-channel__actions">
          {props.extraActionsRenderer && props.extraActionsRenderer(channel)}
        </div>
      </div>
    );
  };

  return (
    <div className={`pn-channel-list pn-channel-list--${theme}`}>
      {(props.channels as string[]).map(channelFromString).sort(channelSorter).map(renderChannel)}
      <>{props.children}</>
    </div>
  );
};
