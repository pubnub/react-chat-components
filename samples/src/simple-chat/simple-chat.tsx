import React from "react";
import { usePubNub } from "pubnub-react";
import { ChannelMetadataObject, UUIDMetadataObject, ObjectCustom } from "pubnub";
import {
  Chat,
  ChannelList,
  MemberList,
  MessageInput,
  MessageList,
  usePresence,
} from "pubnub-chat-components";

import { ReactComponent as PeopleGroup } from "../people-group.svg";
import "./simple-chat.scss";

import users from "../../../data/users.json";
import socialChannels from "../../../data/channels-social.json";
import directChannels from "../../../data/channels-direct.json";
const userList: UUIDMetadataObject<ObjectCustom>[] = users;
const socialChannelList: ChannelMetadataObject<ObjectCustom>[] = socialChannels;
const directChannelList: ChannelMetadataObject<ObjectCustom>[] = directChannels;
const allChannelIds = [...socialChannelList, ...directChannelList].map((c) => c.id);

function SimpleChat() {
  const pubnub = usePubNub();
  const [currentChannel, setCurrentChannel] = React.useState(socialChannelList[0]);
  const [showMembers, setShowMembers] = React.useState(false);
  const [presenceData] = usePresence({ channels: allChannelIds });

  const currentUser = userList.find((u) => u.id === pubnub.getUUID());
  const presentUUIDs = presenceData[currentChannel.id]?.occupants?.map((o) => o.uuid);
  const presentUsers = userList.filter((u) => presentUUIDs?.includes(u.id));

  return (
    <div className="app">
      <Chat channel={currentChannel.id} subscribeChannels={allChannelIds} userList={userList}>
        <div className="channels">
          <div className="user">
            {currentUser?.profileUrl && <img src={currentUser?.profileUrl} alt="User avatar " />}
            <div className="details">
              <h4>{currentUser?.name}</h4>
              <small>{currentUser?.custom?.title}</small>
            </div>
          </div>

          <h4>Channels</h4>
          <div>
            <ChannelList
              channelList={socialChannelList}
              onChannelSwitched={(channel) => setCurrentChannel(channel)}
            />
          </div>
          <h4>Direct Chats</h4>
          <div>
            <ChannelList
              channelList={directChannelList}
              onChannelSwitched={(channel) => setCurrentChannel(channel)}
            />
          </div>
        </div>

        <div className="chat">
          <div
            className={`people ${showMembers ? "active" : ""}`}
            onClick={() => setShowMembers(!showMembers)}
          >
            <span>{presenceData[currentChannel.id]?.occupancy || 0}</span>
            <PeopleGroup />
          </div>

          <div className="info">
            <h4>{currentChannel.name}</h4>
            <small>{currentChannel.description}</small>
            <hr />
          </div>
          <MessageList fetchMessages={25} />
          <MessageInput placeholder={`Message #${currentChannel.name}`} />
        </div>

        <div className={`members ${showMembers && "shown"}`}>
          <h4>Online Users</h4>
          <MemberList memberList={presentUsers} />
        </div>
      </Chat>
    </div>
  );
}

export default SimpleChat;
