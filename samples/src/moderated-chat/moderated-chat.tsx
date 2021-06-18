import React, { useEffect, useMemo, useState } from "react";
import { Picker } from "emoji-mart";
import DarkModeToggle from "react-dark-mode-toggle";
import { ChannelMetadataObject, UUIDMetadataObject, ObjectCustom, GetAllMetadataParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import {
  ChannelList,
  Chat,
  MemberList,
  MessageInput,
  MessageList,
  Themes,
  TypingIndicator,
  useChannelMembers,
  usePresence,
  useUser,
  useUserMemberships,
  useUsers,
} from "@pubnub/react-chat-components";

import "./moderated-chat.scss";
import "emoji-mart/css/emoji-mart.css";
import { ReactComponent as PeopleGroup } from "../people-group.svg";

interface UserCustom extends ObjectCustom {
  profileUrl: string;
}

function SimpleChat () {
  const pubnub = usePubNub(); //usePubNub is only used here to get current user info (as it's randomly selected)
  const params = useMemo(() => ({ uuid: pubnub.getUUID(), include: { channelFields: true, customChannelFields: true } }),[]) as unknown as GetAllMetadataParameters;
  const [channels] = useUserMemberships(params);
  const [currentUser] = useUser(params) as [UUIDMetadataObject<UserCustom>, Error];
  if (channels.length < 1 || !currentUser) {
    return <div></div>
  }
  return <SimpleChatContent channels={channels} currentUser={currentUser}/>
}

function SimpleChatContent({ currentUser, channels }: { channels: ChannelMetadataObject<ObjectCustom>[], currentUser: UUIDMetadataObject<UserCustom> }) {
  const [theme, setTheme] = useState<Themes>("light");
  const [showMembers, setShowMembers] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  
  // memoize these values to prevent re-renders
  const socialChannelList = useMemo(() => channels.filter(c => c.id.startsWith('space_')), [channels]);
  const directChannelList = useMemo(() => channels.filter(c => c.id.startsWith('direct_')), [channels]);
  const allChannelIds = useMemo(() => channels.map(c => c.id), [channels]);

  const [presenceData] = usePresence({ channels: allChannelIds }); // usePresence is one of the custom hooks provided by Chat Components
  const [currentChannel, setCurrentChannel] = useState(socialChannelList[0]);

  const [, , membershipCount] = useChannelMembers({ channel: currentChannel.id, limit: 1});

  const [usersRaw] = useUsers();
  const users = usersRaw as UUIDMetadataObject<UserCustom>[];

  const presentUUIDs = presenceData[currentChannel?.id]?.occupants?.map((o) => o.uuid);
  const presentUsers = useMemo(() => users.filter((u) => presentUUIDs?.includes(u.id)), [presentUUIDs, users]);

  /** Rendered markup is a mixture of PubNub Chat Components (Chat, ChannelList, MessageList,
   * MessageInput, MemberList) and some elements to display additional information and to handle
   * custom behaviors (dark mode, showing/hiding panels, responsive design) */
  return (
    <div className={`app-simple ${theme}`}>
      {/* Be sure to wrap Chat component in PubNubProvider from pubnub-react package.
      In this case it's done in the index.tsx file */}
      <Chat theme={theme} users={users} currentChannel={currentChannel.id} channels={allChannelIds}>
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
            <span><strong>{presenceData[currentChannel.id]?.occupancy || 0}</strong>{membershipCount ? <span>/{membershipCount}</span> : ""}</span>
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
            fetchMessages={20}
            enableReactions
            reactionsPicker={<Picker />}
          >
            <TypingIndicator showAsMessage />
          </MessageList>
          <MessageInput typingIndicator emojiPicker={<Picker />} />
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
      </Chat>
    </div>
  );
}

export default SimpleChat;
