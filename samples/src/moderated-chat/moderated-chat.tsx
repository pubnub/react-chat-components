import React, { useState, useEffect, useCallback, MouseEvent } from "react";
import { ChannelMetadataObject, ObjectCustom, BaseObjectsEvent } from "pubnub";
import { Picker } from "emoji-mart";
import { usePubNub } from "pubnub-react";
import {
  ChannelList,
  Chat,
  MemberList,
  MessageEnvelope,
  MessageInput,
  MessageList,
  TypingIndicator,
  useChannelMembers,
  useChannels,
  usePresence,
  useUser,
  useUserMemberships,
  useUsers,
} from "@pubnub/react-chat-components";
import "emoji-mart/css/emoji-mart.css";

import { CreateChatModal } from "./components/create-chat-modal";
import { ReportUserModal } from "./components/report-user-modal";
import { PublicChannelsModal } from "./components/public-channels-modal";
import "./moderated-chat.scss";

type ChannelType = ChannelMetadataObject<ObjectCustom>;

const defaultChannel = {
  id: "default",
  name: "Default Channel",
  description: "This is the default channel",
} as Pick<ChannelType, "id" | "name" | "description">;

export default function ModeratedChat(): JSX.Element {
  /**
   * Component state related hooks
   * Those mostly store the current channel, modals and side panels being shown
   */
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentChannel, setCurrentChannel] = useState(defaultChannel);
  const [showMembers, setShowMembers] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  const [showPublicChannelsModal, setShowPublicChannelsModal] = useState(false);
  const [showCreateChatModal, setShowCreateChatModal] = useState(false);
  const [showReportUserModal, setShowReportUserModal] = useState(false);
  const [channelsFilter, setChannelsFilter] = useState("");
  const [membersFilter, setMembersFilter] = useState("");
  const [reportedMessage, setReportedMessage] = useState<MessageEnvelope>();

  /**
   * All data related to Users, Channels and Memberships is stored within PubNub Objects API
   * It can be easily accessed using React Chat Components hooks
   */
  const pubnub = usePubNub();
  const uuid = pubnub.getUUID();
  const [currentUser] = useUser({ uuid });
  const [allUsers] = useUsers({ include: { customFields: true } });
  const [allChannels] = useChannels({ include: { customFields: true } });
  const [joinedChannels, , refetchJoinedChannels] = useUserMemberships({
    include: { channelFields: true, customChannelFields: true },
  });
  const [channelMembers, , refetchChannelMemberships, totalChannelMembers] = useChannelMembers({
    channel: currentChannel.id,
    include: { customUUIDFields: true },
  });
  const [presenceData] = usePresence({ channels: joinedChannels.map((c) => c.id) });

  /**
   * Some of the data related to current channel, current user and its' joined channels
   * has to be filtered down and mapped from the hooks data
   */
  const presentUUIDs = presenceData[currentChannel.id]?.occupants?.map((o) => o.uuid);
  const groupChannels = joinedChannels.filter(
    (c) =>
      c.id?.startsWith("space.") && c.name?.toLowerCase().includes(channelsFilter.toLowerCase())
  );
  const groupChannelsToJoin = allChannels.filter(
    (c) => c.id.startsWith("space.") && !joinedChannels.some((b) => c.id === b.id)
  );
  const directChannels = joinedChannels
    .filter((c) => c.id?.startsWith("direct.") || c.id?.startsWith("group."))
    .map((c) => {
      if (!c.id?.startsWith("direct.")) return c;
      const interlocutorId = c.id.replace(uuid, "").replace("direct.", "").replace("@", "");
      const interlocutor = allUsers.find((u) => u.id === interlocutorId);
      if (interlocutor) {
        c.custom = { thumb: interlocutor.profileUrl || "" };
        c.name = interlocutor.name;
      }
      return c;
    })
    .filter((c) => c.name?.toLowerCase().includes(channelsFilter.toLowerCase()));

  const isUserBanned = currentUser?.custom?.ban;
  const isUserMuted = (currentUser?.custom?.mutedChannels as string)
    ?.split(",")
    .includes(currentChannel.id);
  const isUserBlocked = (currentUser?.custom?.blockedChannels as string)
    ?.split(",")
    .includes(currentChannel.id);

  /**
   * Creating and removing channel memberships (not subscriptions!)
   */
  const leaveChannel = async (channel: ChannelType, event: MouseEvent) => {
    event.stopPropagation();
    await pubnub.objects.removeMemberships({ channels: [channel.id] });
    setAnotherCurrentChannel(channel.id);
  };

  const refreshMemberships = useCallback(
    (event: BaseObjectsEvent) => {
      if (event.channel.startsWith("user_")) refetchJoinedChannels();
      if (event.channel === currentChannel.id) refetchChannelMemberships();
    },
    [currentChannel, refetchJoinedChannels, refetchChannelMemberships]
  );

  const setAnotherCurrentChannel = (channelId: string) => {
    if (currentChannel.id === channelId) {
      const newCurrentChannel = joinedChannels?.find((ch) => ch.id !== channelId);
      if (newCurrentChannel) setCurrentChannel(newCurrentChannel);
    }
  };

  /**
   * Handling publish errors
   */
  const handleError = (e: any) => {
    if (
      (e.status?.operation === "PNPublishOperation" && e.status?.statusCode === 403) ||
      e.message.startsWith("Publish failed")
    ) {
      alert(
        "Your message was blocked. Perhaps you tried to use offensive language or send an image that contains nudity?"
      );
    }
  };

  useEffect(() => {
    if (currentChannel.id === "default" && joinedChannels.length)
      setCurrentChannel(joinedChannels[0]);
  }, [currentChannel, joinedChannels]);

  /**
   * Rendered markup is a mixture of PubNub Chat Components (Chat, ChannelList, MessageList,
   * MessageInput, MemberList) and some elements to display additional information and to handle
   * custom behaviors (channels modal, showing/hiding panels, responsive design)
   */
  return (
    <div className={`app-moderated app-moderated--${theme}`}>
      {/* Be sure to wrap Chat component in PubNubProvider from pubnub-react package.
        In this case it's done in the index.tsx file */}
      {/* Current uuid is passed to channels prop to subscribe and listen to User metadata changes */}
      <Chat
        theme={theme}
        users={allUsers}
        currentChannel={currentChannel.id}
        channels={[...joinedChannels.map((c) => c.id), uuid]}
        onError={handleError}
        onMembership={(e) => refreshMemberships(e)}
      >
        {showPublicChannelsModal && (
          <PublicChannelsModal
            {...{
              groupChannelsToJoin,
              hideModal: () => setShowPublicChannelsModal(false),
              setCurrentChannel,
            }}
          />
        )}
        {showCreateChatModal && (
          <CreateChatModal
            {...{
              currentUser,
              hideModal: () => setShowCreateChatModal(false),
              setCurrentChannel,
              users: allUsers.filter((u) => u.id !== uuid),
            }}
          />
        )}
        {showReportUserModal && (
          <ReportUserModal
            {...{
              currentUser,
              reportedMessage,
              hideModal: () => setShowReportUserModal(false),
              users: allUsers,
            }}
          />
        )}
        {isUserBanned ? (
          <strong className="error">Unfortunately, you were banned from the chat.</strong>
        ) : (
          <>
            <div className={`channels-panel ${showChannels && "shown"}`}>
              <div className="user-info">
                {currentUser && <MemberList members={[currentUser]} selfText="" />}
                <button
                  className="mobile material-icons-outlined"
                  onClick={() => setShowChannels(false)}
                >
                  close
                </button>
              </div>

              <div className="theme-switcher">
                <i className="material-icons-outlined">brightness_4</i>
                <button
                  className={theme}
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  <span></span>
                </button>
              </div>

              <div className="filter-input">
                <input
                  onChange={(e) => setChannelsFilter(e.target.value)}
                  placeholder="Search in..."
                  type="text"
                  value={channelsFilter}
                />
                <i className="material-icons-outlined">search</i>
              </div>

              <div className="channel-lists">
                <h2>
                  Channels{" "}
                  <button
                    className="material-icons-outlined"
                    onClick={() => setShowPublicChannelsModal(true)}
                  >
                    add_circle_outline
                  </button>
                </h2>
                <div>
                  <ChannelList
                    channels={groupChannels}
                    onChannelSwitched={(channel) => setCurrentChannel(channel)}
                    extraActionsRenderer={(c) => (
                      <div onClick={(e) => leaveChannel(c, e)} title="Leave channel">
                        <i className="material-icons-outlined small">logout</i>
                      </div>
                    )}
                  />
                </div>
                <h2>
                  Direct chats{" "}
                  <button
                    className="material-icons-outlined"
                    onClick={() => setShowCreateChatModal(true)}
                  >
                    add_circle_outline
                  </button>
                </h2>
                <div>
                  <ChannelList
                    channels={directChannels}
                    onChannelSwitched={(channel) => setCurrentChannel(channel)}
                    extraActionsRenderer={(c) => (
                      <div onClick={(e) => leaveChannel(c, e)} title="Leave channel">
                        <i className="material-icons-outlined small">logout</i>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="chat-window">
              <div className="channel-info">
                <button
                  className="mobile material-icons-outlined"
                  onClick={() => setShowChannels(true)}
                >
                  menu
                </button>
                <span onClick={() => setShowMembers(!showMembers)}>
                  <strong>
                    {currentChannel.name || currentChannel.id}
                    <i className="material-icons-outlined">arrow_right</i>
                  </strong>
                  <p>{totalChannelMembers} members</p>
                </span>
                <hr />
              </div>

              {isUserBlocked ? (
                <strong className="error">
                  Unfortunately, you were blocked from this channel.
                </strong>
              ) : (
                <>
                  <MessageList
                    fetchMessages={20}
                    enableReactions
                    reactionsPicker={<Picker theme={theme} />}
                    extraActionsRenderer={(message) => (
                      <div
                        onClick={() => {
                          setReportedMessage(message);
                          setShowReportUserModal(true);
                        }}
                        title="Report user"
                      >
                        <i className="material-icons-outlined">campaign</i>
                      </div>
                    )}
                  >
                    <TypingIndicator />
                  </MessageList>
                  <hr />
                  <MessageInput
                    disabled={isUserMuted}
                    typingIndicator
                    fileUpload="image"
                    emojiPicker={<Picker theme={theme} />}
                    placeholder={isUserMuted ? "You were muted from this channel" : "Send message"}
                  />
                </>
              )}
            </div>

            <div className={`members-panel ${showMembers ? "shown" : "hidden"}`}>
              <h2>
                Members
                <button className="material-icons-outlined" onClick={() => setShowMembers(false)}>
                  close
                </button>
              </h2>
              <div className="filter-input">
                <input
                  onChange={(e) => setMembersFilter(e.target.value)}
                  placeholder="Search in members"
                  type="text"
                  value={membersFilter}
                />
                <i className="material-icons-outlined">search</i>
              </div>
              <MemberList
                members={channelMembers.filter((c) =>
                  c.name?.toLowerCase().includes(membersFilter.toLowerCase())
                )}
                presentMembers={presentUUIDs}
              />
            </div>
          </>
        )}
      </Chat>
    </div>
  );
}
