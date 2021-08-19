import React, { useState, useEffect } from "react";
import { Picker } from "emoji-mart";
import DarkModeToggle from "react-dark-mode-toggle";
import { ChannelMetadataObject, UUIDMetadataObject, ObjectCustom, StatusEvent } from "pubnub";
import { usePubNub } from "pubnub-react";
import {
  ChannelList,
  Chat,
  MemberList,
  Message,
  MessageInput,
  MessageList,
  Themes,
  TypingIndicator,
  usePresence,
} from "@pubnub/react-chat-components";

import "./simple-chat.scss";
import "emoji-mart/css/emoji-mart.css";
import { ReactComponent as PeopleGroup } from "../icons/people-group.svg";

/**
 * In this simple application, data about users, channels and sample welcome messages are
 * statically loaded from JSON files. In most cases users and channels data will be provided from an
 * external source or loaded from PubNub Objects storage with custom hooks included in the package.
 * Sample messages are fully optional.
 * */
import rawUsers from "../../../data/users.json";
import rawMessages from "../../../data/messages-social.json";
import socialChannels from "../../../data/channels-social.json";
import directChannels from "../../../data/channels-direct.json";
const users: UUIDMetadataObject<ObjectCustom>[] = rawUsers;
const socialChannelList: ChannelMetadataObject<ObjectCustom>[] = socialChannels;
const directChannelList: ChannelMetadataObject<ObjectCustom>[] = directChannels;
const allChannelIds = [...socialChannelList, ...directChannelList].map((c) => c.id);

function SimpleChat() {
  const pubnub = usePubNub(); //usePubNub is only used here to get current user info (as it's randomly selected)
  const [theme, setTheme] = useState<Themes>("light");
  const [accessError, setAccessError] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  const [welcomeMessages, setWelcomeMessages] = useState<{ [channel: string]: Message[] }>({});
  const [presenceData] = usePresence({ channels: allChannelIds }); // usePresnce is one of the custom hooks provided by Chat Components
  const [currentChannel, setCurrentChannel] = useState(socialChannelList[0]);

  const presentUUIDs = presenceData[currentChannel.id]?.occupants?.map((o) => o.uuid);
  const presentUsers = users.filter((u) => presentUUIDs?.includes(u.id));
  const currentUser = users.find((u) => u.id === pubnub.getUUID());

  /** Prepare welcome messages for each channel injecting current user info into some of them */
  useEffect(() => {
    const messages: any = {};
    [...rawMessages].forEach((message) => {
      if (!messages.hasOwnProperty(message.channel)) messages[message.channel] = [];
      if (message.uuid === "current_user" && currentUser?.id) message.uuid = currentUser?.id;
      messages[message.channel].push(message);
    });
    setWelcomeMessages(messages);
  }, [currentUser]);

  /** Detect PubNub access manager */
  const handleStatus = (status: StatusEvent) => {
    if (status.category === "PNAccessDeniedCategory") setAccessError(true);
  };

  /** Rendered markup is a mixture of PubNub Chat Components (Chat, ChannelList, MessageList,
   * MessageInput, MemberList) and some elements to display additional information and to handle
   * custom behaviors (dark mode, showing/hiding panels, responsive design) */
  return (
    <div className={`app-simple ${theme}`}>
      {/* Be sure to wrap Chat component in PubNubProvider from pubnub-react package.
      In this case it's done in the index.tsx file */}
      <Chat
        theme={theme}
        users={users}
        currentChannel={currentChannel.id}
        channels={allChannelIds}
        onStatus={handleStatus}
      >
        {!accessError ? (
          <>
            <div className={`channels ${showChannels && "shown"}`}>
              <div className="user">
                {currentUser?.profileUrl && (
                  <img src={currentUser?.profileUrl} alt="User avatar " />
                )}
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
                  channels={socialChannelList}
                  onChannelSwitched={(channel) => setCurrentChannel(channel)}
                />
              </div>
              <h4>Direct Chats</h4>
              <div>
                <ChannelList
                  channels={directChannelList}
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
                fetchMessages={0}
                welcomeMessages={welcomeMessages[currentChannel.id]}
                enableReactions
                reactionsPicker={<Picker />}
              >
                <TypingIndicator showAsMessage />
              </MessageList>
              <MessageInput typingIndicator fileUpload="all" emojiPicker={<Picker />} />
            </div>

            <div className={`members ${showMembers && "shown"}`}>
              <h4>
                Online Users
                <span className="close" onClick={() => setShowMembers(false)}>
                  ✕
                </span>
              </h4>
              <MemberList members={presentUsers} />
            </div>
          </>
        ) : (
          <div className="pubnub-error">
            <h1>Warning! PubNub access manager enabled.</h1>
            <p>
              It looks like you have access manager enabled on your PubNub keyset. This sample app
              is not adapted to work with PAM by default.
            </p>
            <p>
              You can either disable PAM in the{" "}
              <a href="https://dashboard.pubnub.com/">PubNub Admin Portal</a> or add custom code to
              grant all necessary permissions by yourself. Please referer to the{" "}
              <a href="https://pubnub.github.io/react-chat-components/docs/?path=/story/introduction-pam--page">
                Chat Component docs
              </a>{" "}
              for more information.
            </p>
          </div>
        )}
      </Chat>
    </div>
  );
}

export default SimpleChat;
