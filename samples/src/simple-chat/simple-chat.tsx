import React, { useState } from "react";
import { usePubNub } from "pubnub-react";
import DarkModeToggle from "react-dark-mode-toggle";
import { ChannelMetadataObject, UUIDMetadataObject, ObjectCustom } from "pubnub";
import {
  Chat,
  ChannelList,
  MemberList,
  MessageInput,
  MessageList,
  usePresence,
  Themes,
} from "pubnub-chat-components";

import "./simple-chat.scss";
import { ReactComponent as PeopleGroup } from "../people-group.svg";

import users from "../../../data/users.json";
import messages from "../../../data/messages.json";
import socialChannels from "../../../data/channels-social.json";
import directChannels from "../../../data/channels-direct.json";
const userList: UUIDMetadataObject<ObjectCustom>[] = users;
const socialChannelList: ChannelMetadataObject<ObjectCustom>[] = socialChannels;
const directChannelList: ChannelMetadataObject<ObjectCustom>[] = directChannels;
const allChannelIds = [...socialChannelList, ...directChannelList].map((c) => c.id);

function SimpleChat() {
  const pubnub = usePubNub();
  const [theme, setTheme] = useState<Themes>("light");
  const [currentChannel, setCurrentChannel] = useState(socialChannelList[0]);
  const [showMembers, setShowMembers] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  const [presenceData] = usePresence({ channels: allChannelIds });

  const currentUser = userList.find((u) => u.id === pubnub.getUUID());
  const presentUUIDs = presenceData[currentChannel.id]?.occupants?.map((o) => o.uuid);
  const presentUsers = userList.filter((u) => presentUUIDs?.includes(u.id));

  return (
    <div className={`app-simple ${theme}`}>
      <Chat
        theme={theme}
        channel={currentChannel.id}
        subscribeChannels={allChannelIds}
        userList={userList}
      >
        <div className={`channels ${showChannels && "shown"}`}>
          <div className="user">
            {currentUser?.profileUrl && <img src={currentUser?.profileUrl} alt="User avatar " />}
            <h4>
              {currentUser?.name}{" "}
              <span className="close" onClick={() => setShowChannels(false)}>
                ✕
              </span>
            </h4>
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

          <DarkModeToggle
            className="toggle"
            onChange={(isDark) => (isDark ? setTheme("dark") : setTheme("light"))}
            checked={theme === "dark"}
            size={50}
          />
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
            <span className="hamburger" onClick={() => setShowChannels(true)}>
              ☰
            </span>
            <h4>{currentChannel.name}</h4>
            <small>{currentChannel.description}</small>
            <hr />
          </div>
          <MessageList fetchMessages={0} welcomeMessages={messages}></MessageList>
          <MessageInput />
        </div>

        <div className={`members ${showMembers && "shown"}`}>
          <h4>
            Online Users
            <span className="close" onClick={() => setShowMembers(false)}>
              ✕
            </span>
          </h4>
          <MemberList memberList={presentUsers} />
        </div>
      </Chat>
    </div>
  );
}

export default SimpleChat;
