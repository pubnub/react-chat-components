import React, { useState } from "react";
import { usePubNub } from "pubnub-react";
import { ChannelEntity, ChannelList } from "@pubnub/react-chat-components";

interface PublicChannelsModalProps {
  groupChannelsToJoin: ChannelEntity[];
  setCurrentChannel: (channel: ChannelEntity) => void;
  hideModal: () => void;
}

/**
 * This modal is opened after clicking the "plus" icon next to the Channels header
 * It is used to create new join predefined public channels
 */
export const PublicChannelsModal = ({
  groupChannelsToJoin,
  setCurrentChannel,
  hideModal,
}: PublicChannelsModalProps): JSX.Element => {
  const pubnub = usePubNub();
  const [channelsFilter, setChannelsFilter] = useState("");

  const joinGroupChannel = async (channel: ChannelEntity) => {
    await pubnub.objects.setMemberships({ channels: [channel.id] });
    setCurrentChannel(channel);
    hideModal();
  };

  return (
    <div className="overlay">
      <div className="public-channels-modal modal">
        <div className="header">
          <strong>Join a channel</strong>
          <button className="material-icons-outlined" onClick={() => hideModal()}>
            close
          </button>
        </div>
        <div className="filter-input">
          <input
            onChange={(e) => setChannelsFilter(e.target.value)}
            placeholder="Search in channels"
            type="text"
            value={channelsFilter}
          />
          <i className="material-icons-outlined">search</i>
        </div>
        <h2>Channels</h2>
        <ChannelList
          channels={groupChannelsToJoin.filter((c) =>
            c.name?.toLowerCase().includes(channelsFilter)
          )}
          onChannelSwitched={(channel) => joinGroupChannel(channel)}
        />
      </div>
    </div>
  );
};
