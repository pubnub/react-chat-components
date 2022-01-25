import React, { useState } from "react";
import { UUIDMetadataObject, ChannelMetadataObject, ObjectCustom } from "pubnub";
import { Picker } from "emoji-mart";
import {
  Chat,
  MessageList,
  MessageInput,
  ChannelList,
  usePresence,
} from "@pubnub/react-chat-components";
import eventChannels from "../../../data/channels-event.json";
import "emoji-mart/css/emoji-mart.css";
import "./live-event-chat.css";

const channels: ChannelMetadataObject<ObjectCustom>[] = eventChannels;

const LiveEventChat = ({ user }: { user: UUIDMetadataObject<ObjectCustom> }): JSX.Element => {
  const [currentChannel, setCurrentChannel] = useState(channels[0]);
  const [presence] = usePresence({ channels: channels.map((ch) => ch.id) });
  console.log(presence);

  return (
    <Chat
      currentChannel={currentChannel.id}
      /** Manually pass '-pnpres' channels here to get presence data for channels you don't want to be subscribed to */
      channels={[currentChannel.id, ...channels.map((ch) => `${ch.id}-pnpres`)]}
      users={[user]}
      theme="event-dark"
    >
      <div className="channels">
        <div className="user">
          {user.profileUrl && <img src={user.profileUrl} className="avatar" alt="Channel Thumb" />}
          <h4>Live events</h4>
        </div>
        <ChannelList
          channels={channels}
          onChannelSwitched={(ch) => setCurrentChannel(ch)}
          extraActionsRenderer={(ch) => (
            <span className="online">
              <span className="live"></span>
              {presence[ch.id]?.occupancy || 0}
            </span>
          )}
        />
      </div>
      <div className="event">
        <div className="stream">
          {currentChannel?.custom?.source && (
            <iframe
              src={currentChannel.custom.source as string}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
        <div className="info">
          {currentChannel?.custom?.thumb && (
            <img
              src={currentChannel.custom.thumb as string}
              className="avatar"
              alt="Channel Thumb"
            />
          )}
          <h2>{currentChannel.name}</h2>
          {presence[currentChannel.id]?.occupancy && (
            <p>{presence[currentChannel.id]?.occupancy} watching now</p>
          )}
          <span className="live">Live</span>
        </div>
      </div>
      <div className="chat">
        <h4>Live chat</h4>
        <MessageList />
        <MessageInput senderInfo emojiPicker={<Picker theme="dark" />} />
      </div>
    </Chat>
  );
};

export default LiveEventChat;
