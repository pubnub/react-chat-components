import React, { useState } from "react";
import { usePubNub } from "pubnub-react";
import { ChannelMetadataObject, ObjectCustom } from "pubnub";
import { ChannelList } from "@pubnub/react-chat-components";
import { XIcon, SearchIcon } from "@primer/octicons-react";

type ChannelType = ChannelMetadataObject<ObjectCustom>;

interface PublicChannelsModalProps {
  groupChannelsToJoin: ChannelType[];
  setCurrentChannel: (channel: ChannelType) => void;
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
}: PublicChannelsModalProps) => {
  const pubnub = usePubNub();
  const [channelsFilter, setChannelsFilter] = useState("");

  const joinGroupChannel = async (channel: ChannelType) => {
    await pubnub.objects.setMemberships({ channels: [channel.id] });
    setCurrentChannel(channel);
    hideModal();
  };

  return (
    <div className="overlay">
      <div className="public-channels-modal modal">
        <div className="header">
          <span className="close-icon" onClick={() => hideModal()}>
            <XIcon />
          </span>
          <h4>Join a channel</h4>
        </div>
        <div className="filter-input">
          <input
            onChange={(e) => setChannelsFilter(e.target.value)}
            placeholder="Search in channels"
            type="text"
            value={channelsFilter}
          />
          <SearchIcon />
        </div>
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
