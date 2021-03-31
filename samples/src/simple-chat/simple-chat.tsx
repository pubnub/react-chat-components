import React, { useState, useEffect } from "react";
import DarkModeToggle from "react-dark-mode-toggle";
import { ChannelMetadataObject, UUIDMetadataObject, ObjectCustom } from "pubnub";
import { usePubNub } from "pubnub-react";
import {
  ChannelList,
  Chat,
  MemberList,
  MessageInput,
  MessageList,
  Themes,
  TypingIndicator,
  usePresence,
} from "@pubnub/react-chat-components";

import "./simple-chat.scss";
import { ReactComponent as PeopleGroup } from "../people-group.svg";

/**
 * In this simple application, data about users, channels and sample welcome messages are
 * statically loaded from JSON files. In most cases users and channels data will be provided from an
 * external source or loaded from PubNub Objects storage with custom hooks included in the package.
 * Sample messages are fully optional.
 * */
import users from "../../../data/users.json";
import rawMessages from "../../../data/messages-social.json";
import socialChannels from "../../../data/channels-social.json";
import directChannels from "../../../data/channels-direct.json";
const userList: UUIDMetadataObject<ObjectCustom>[] = users;
const socialChannelList: ChannelMetadataObject<ObjectCustom>[] = socialChannels;
const directChannelList: ChannelMetadataObject<ObjectCustom>[] = directChannels;
const allChannelIds = [...socialChannelList, ...directChannelList].map((c) => c.id);

function SimpleChat() {
  const pubnub = usePubNub(); //usePubNub is only used here to get current user info (as it's randomly selected)
  const [theme, setTheme] = useState<Themes>("light");
  const [showMembers, setShowMembers] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  const [welcomeMessages, setWelcomeMessages] = useState({});
  const [presenceData] = usePresence({ channels: allChannelIds }); // usePresnce is one of the custom hooks provided by Chat Components
  const [currentChannel, setCurrentChannel] = useState(socialChannelList[0]);

  const presentUUIDs = presenceData[currentChannel.id]?.occupants?.map((o) => o.uuid);
  const presentUsers = userList.filter((u) => presentUUIDs?.includes(u.id));
  const currentUser = userList.find((u) => u.id === pubnub.getUUID());

  /** Prepare welcome messages for each channel injecting current user info into some of them */
  useEffect(() => {
    const messages: any = {};
    [...rawMessages].forEach((message) => {
      if (!messages.hasOwnProperty(message.channel)) messages[message.channel] = [];
      if (message.uuid === "current_user") message.uuid = currentUser?.id;
      messages[message.channel].push(message);
    });
    setWelcomeMessages(messages);
  }, [currentUser]);

  /** Rendered markup is a mixture of PubNub Chat Components (Chat, ChannelList, MessageList,
   * MessageInput, MemberList) and some elements to display additional information and to handle
   * custom behaviors (dark mode, showing/hiding panels, responsive design) */
  return (
    <div className={`app-simple ${theme}`}>
      {/* Be sure to wrap Chat component in PubNubProvider from pubnub-react package.
      In this case it's done in the index.tsx file */}
      <Chat
        theme={theme}
        userList={userList}
        channel={currentChannel.id}
        subscribeChannels={allChannelIds}
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
          <div className="toggle">
            <span>Dark Mode</span>
            <DarkModeToggle
              size={50}
              checked={theme === "dark"}
              onChange={(isDark) => (isDark ? setTheme("dark") : setTheme("light"))}
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
            <span className="hamburger" onClick={() => setShowChannels(true)}>
              ☰
            </span>
            <h4>{currentChannel.name}</h4>
            <small>{currentChannel.description}</small>
            <hr />
          </div>
          <MessageList
            enableReactions
            fetchMessages={0}
            welcomeMessages={welcomeMessages[currentChannel.id]}
          >
            <TypingIndicator showAsMessage />
          </MessageList>
          <MessageInput emojiPicker typingIndicator />
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
