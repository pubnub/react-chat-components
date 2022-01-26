import React, { useState } from "react";
import { ChannelMetadataObject, ObjectCustom } from "pubnub";
import { usePubNub } from "pubnub-react";
import { Picker } from "emoji-mart";
import {
  Chat,
  MessageList,
  MessageInput,
  MemberList,
  ChannelList,
  usePresence,
} from "@pubnub/react-chat-components";
import eventChannels from "../../../data/channels-event.json";
import "emoji-mart/css/emoji-mart.css";
import "./live-event-chat.css";

const channels: ChannelMetadataObject<ObjectCustom>[] = eventChannels;

const LiveEventChat = (): JSX.Element => {
  const pubnub = usePubNub();
  const [currentChannel, setCurrentChannel] = useState(channels[0]);
  const [presence] = usePresence({ channels: channels.map((ch) => ch.id) });
  const [showMembers, setShowMembers] = useState(false);
  const members = presence[currentChannel.id]?.occupants.map((o) => o.uuid);

  return (
    <Chat
      currentChannel={currentChannel.id}
      /** Manually pass '-pnpres' channels here to get presence data for channels you don't want to be subscribed to */
      channels={[currentChannel.id, ...channels.map((ch) => `${ch.id}-pnpres`)]}
      theme="event-dark"
    >
      <div className="channels">
        <div className="header">
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
        <MemberList members={[pubnub.getUUID()]} selfText="" />
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

      {showMembers ? (
        <div className="members">
          <div className="header">
            <h4>Currently watching </h4>
            <i className="material-icons-outlined" onClick={() => setShowMembers(false)}>
              close
            </i>
          </div>
          <MemberList members={members} />
        </div>
      ) : (
        <div className="chat">
          <div className="header">
            <h4>Live chat </h4>
            <i className="material-icons-outlined" onClick={() => setShowMembers(true)}>
              group
            </i>
          </div>
          <MessageList />
          <MessageInput senderInfo emojiPicker={<Picker theme="dark" />} />
        </div>
      )}
    </Chat>
  );
};

export default LiveEventChat;
