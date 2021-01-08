import React, { FC, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { usePubNub } from "pubnub-react";
import { Channel } from "../types";
import {
  ThemeAtom,
  CurrentChannelAtom,
  ChannelsMetaAtom,
  CurrentUserMembershipsAtom,
  SubscribeChannelsAtom,
} from "../state-atoms";
import { getPubnubUserChannels } from "../commands";
import LeaveIcon from "./leave.svg";
import "./channel-list.scss";

export interface ChannelListProps {
  /** Channels to show on the list.
   * "all" (default) = all channels stored in PubNub Objects and/or provided via Chat wrapper
   * "subscriptions" = only subscribed channels, fed by subscriptionChannels option of the wrapper
   * "memberships" = only channels associated with current user in PubNub Objects storage
   * "non-memberships" = only channels that the current user is not a member of */
  show?: "all" | "subscriptions" | "memberships" | "non-memberships";
  /** Provide custom channel renderer to override default themes and CSS variables. */
  channelRenderer?: (props: ChannelRendererProps) => JSX.Element;
  /** A callback run when user joined a channel */
  onChannelJoined?: (channel: Channel) => unknown;
  /** A callback run when user left a channel */
  onChannelLeft?: (channel: Channel) => unknown;
  /** A callback run when user switched to a channel */
  onChannelSwitched?: (channel: Channel) => unknown;
}

export interface ChannelRendererProps {
  channel: Channel;
}

/**
 * Redners an interactive list of channels.
 */
export const ChannelList: FC<ChannelListProps> = (props: ChannelListProps) => {
  const pubnub = usePubNub();

  const channel = useRecoilValue(CurrentChannelAtom);
  const theme = useRecoilValue(ThemeAtom);
  const channels = useRecoilValue(ChannelsMetaAtom);
  const subscribeChannels = useRecoilValue(SubscribeChannelsAtom);
  const [joinedChannels, setJoinedChannels] = useRecoilState(CurrentUserMembershipsAtom);

  /*
  /* Helper functions
  */

  const isChannelJoined = (channel: Channel) => {
    return joinedChannels.includes(channel.id);
  };

  const isChannelActive = (ch: Channel) => {
    return channel === ch.id;
  };

  const channelSorter = (a, b) => {
    if (isChannelJoined(a) && !isChannelJoined(b)) return -1;
    if (!isChannelJoined(a) && isChannelJoined(b)) return 1;

    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  };

  const channelFromString = (name) => ({
    id: name,
    name,
  });

  /*
  /* Commands
  */
  const fetchMemberships = async () => {
    try {
      const joinedChannels = await getPubnubUserChannels(pubnub, pubnub.getUUID());
      setJoinedChannels(joinedChannels);
    } catch (e) {
      console.error(e);
    }
  };

  const joinChannel = async (channel: Channel) => {
    try {
      await pubnub.objects.setMemberships({ channels: [channel.id] });
      setJoinedChannels([...joinedChannels, channel.id]);
      if (props.onChannelJoined) props.onChannelJoined(channel);
      switchChannel(channel);
    } catch (e) {
      console.error(e);
    }
  };

  const leaveChannel = async (channel: Channel) => {
    try {
      await pubnub.objects.removeMemberships({ channels: [channel.id] });
      setJoinedChannels([...joinedChannels.filter((id) => id !== channel.id)]);
      if (props.onChannelLeft) props.onChannelLeft(channel);
    } catch (e) {
      console.error(e);
    }
  };

  const switchChannel = (channel: Channel) => {
    if (props.onChannelSwitched) props.onChannelSwitched(channel);
  };

  /*
  /* Lifecycle
  */

  useEffect(() => {
    if (!pubnub) return;
    if (!joinedChannels.length) fetchMemberships();
  }, [channel]);

  /*
  /* Renderers
  */

  const renderChannel = (channel) => {
    const channelJoined = isChannelJoined(channel);
    const channelActive = isChannelActive(channel);
    const joinedClass = channelJoined ? "joined" : "unjoined";
    const activeClass = channelActive ? "pn-channel--active" : "";

    if (props.channelRenderer) return props.channelRenderer({ channel });

    return (
      <div
        key={channel.id}
        className={`pn-channel pn-channel--${joinedClass} ${activeClass}`}
        onClick={() => {
          isChannelJoined(channel) ? switchChannel(channel) : joinChannel(channel);
        }}
      >
        {props.show === "all" && channelJoined && <span className="pn-channel__membership" />}

        <div className="pn-channel__title">
          <p className="pn-channel__name">{channel.name}</p>
          <p className="pn-channel__description">{channel?.description}</p>
        </div>

        {channelJoined && (
          <span
            className="pn-channel__leave"
            onClick={(e) => {
              leaveChannel(channel);
              e.stopPropagation();
            }}
          >
            <LeaveIcon />
          </span>
        )}
      </div>
    );
  };

  const renderChannels = ((type) => {
    switch (type) {
      case "subscriptions":
        return subscribeChannels.map(
          (name) => channels.find((ch) => ch.id === name) || channelFromString(name)
        );
      case "memberships":
        return channels.filter((c) => joinedChannels.includes(c.id));
      case "non-memberships":
        return channels.filter((c) => !joinedChannels.includes(c.id));
      default:
        return channels;
    }
  })(props.show);

  return (
    <div className={`pn-channel-list pn-channel-list--${theme}`}>
      {[...renderChannels].sort((a, b) => channelSorter(a, b)).map((m) => renderChannel(m))}
    </div>
  );
};

ChannelList.defaultProps = {
  show: "all",
};
