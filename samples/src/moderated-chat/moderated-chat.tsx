import React, { useState, useEffect, MouseEvent } from "react";
import { Picker } from "emoji-mart";
import { ChannelMetadataObject, UUIDMetadataObject, ObjectCustom } from "pubnub";
import { usePubNub } from "pubnub-react";
import {
  ChannelList,
  Chat,
  MemberList,
  Message,
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

import "./moderated-chat.scss";
import { ReactComponent as PeopleGroup } from "../icons/people-group.svg";
import { ReactComponent as PlusCircle } from "../icons/plus-circle.svg";
import { ReactComponent as Megaphone } from "../icons/megaphone.svg";
import { ReactComponent as SignOut } from "../icons/sign-out.svg";

function ModeratedChat() {
  const [showMembers, setShowMembers] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  const [showChannelsModal, setShowChannelsModal] = useState(false);
  const [showFlaggingModal, setShowFlaggingModal] = useState(false);
  const [flaggingMessage, setFlaggingMessage] = useState<Message>();
  const defaultChannel = {
    id: "default",
    name: "Default Channel",
    description: "This is the default channel",
    eTag: "",
    updated: "",
  };

  /**
   * All data related to Users, Channels and Memberships is stored within PubNub Objects API
   * This can be easily accessed using React Chat Components hooks
   */
  const pubnub = usePubNub();
  const uuid = pubnub.getUUID();
  const [currentUser] = useUser({ uuid });
  const [allUsers] = useUsers();
  const [allChannels] = useChannels({ include: { customFields: true } });
  const [joinedChannels, , refetchJoinedChannels] = useUserMemberships({
    uuid,
    include: { channelFields: true, customChannelFields: true },
  });
  const unJoinedChannels = allChannels.filter((a) => !joinedChannels.some((b) => a.id === b.id));
  const [currentChannel, setCurrentChannel] = useState<ChannelMetadataObject<ObjectCustom>>(
    defaultChannel
  );
  const [, , , totalchannelMembers] = useChannelMembers({ channel: currentChannel?.id });
  const [presenceData] = usePresence({ channels: joinedChannels.map((c) => c.id) });
  const presentUUIDs = presenceData[currentChannel?.id]?.occupants?.map((o) => o.uuid);
  const presentUsers = allUsers.filter((u) => presentUUIDs?.includes(u.id));

  const userBanned = currentUser?.custom?.ban;
  const userMuted = (currentUser?.custom?.mutedChannels as string)
    ?.split(",")
    .includes(currentChannel.id);
  const userBlocked = (currentUser?.custom?.blockedChannels as string)
    ?.split(",")
    .includes(currentChannel.id);

  const joinChannel = async (channel: ChannelMetadataObject<ObjectCustom>) => {
    await pubnub.objects.setMemberships({ channels: [channel.id] });
    refetchJoinedChannels();
    setCurrentChannel(channel);
    setShowChannelsModal(false);
  };

  const leaveChannel = async (channel: ChannelMetadataObject<ObjectCustom>, event: MouseEvent) => {
    event.stopPropagation();
    await pubnub.objects.removeMemberships({ channels: [channel.id] });
    if (currentChannel.id === channel.id) {
      const newCurrentChannel = joinedChannels?.find((ch) => ch.id !== channel.id);
      if (newCurrentChannel) setCurrentChannel(newCurrentChannel);
    }
  };

  const openFlaggingModal = (message: Message) => {
    setFlaggingMessage(message);
    setShowFlaggingModal(true);
  };

  const flagMessage = async (reason: string) => {
    if (!flaggingMessage) return;
    await pubnub.objects.setUUIDMetadata({
      uuid: flaggingMessage.uuid,
      data: {
        custom: {
          flag: true,
          flaggedAt: Date.now(),
          flaggedBy: uuid,
          reason,
        },
      },
    });
    setFlaggingMessage(undefined);
    setShowFlaggingModal(false);
  };

  const handleError = (e: Error) => {
    if (e.message.startsWith("Publish failed"))
      alert(
        "Publishing message failed. Perhaps you tried to send a file that contains nudity or offensive language?"
      );
  };

  useEffect(() => {
    if (currentChannel?.id === "default" && joinedChannels.length)
      setCurrentChannel(joinedChannels[0]);
  }, [currentChannel, joinedChannels]);

  /** Rendered markup is a mixture of PubNub Chat Components (Chat, ChannelList, MessageList,
   * MessageInput, MemberList) and some elements to display additional information and to handle
   * custom behaviors (channels modal, showing/hiding panels, responsive design) */
  return (
    <div className="app-moderated">
      {/* Be sure to wrap Chat component in PubNubProvider from pubnub-react package.
        In this case it's done in the index.tsx file */}
      <Chat
        theme="light"
        users={allUsers}
        currentChannel={currentChannel?.id}
        /** Current uuid is passed here to subscribe and listen to User metadata changes */
        channels={[...joinedChannels.map((c) => c.id), uuid]}
        onError={(e) => handleError(e)}
      >
        {showChannelsModal ? (
          <JoinChannelModal {...{ unJoinedChannels, setShowChannelsModal, joinChannel }} />
        ) : null}
        {showFlaggingModal ? (
          <FlagMessageModal {...{ flaggingMessage, setShowFlaggingModal, flagMessage, allUsers }} />
        ) : null}

        {userBanned ? (
          <BanNotification />
        ) : (
          <>
            <div className={`channels ${showChannels && "shown"}`}>
              <div className="user">
                {currentUser && currentUser?.profileUrl && (
                  <img src={currentUser?.profileUrl} alt="User avatar " />
                )}
                <h4>
                  {currentUser && currentUser?.name}
                  <span className="close" onClick={() => setShowChannels(false)}>
                    ✕
                  </span>
                </h4>
              </div>
              <h4>
                Channels <PlusCircle onClick={() => setShowChannelsModal(true)} className="join" />
              </h4>
              <div>
                <ChannelList
                  channels={joinedChannels}
                  extraActionsRenderer={(c) => (
                    <div onClick={(e) => leaveChannel(c, e)}>
                      <SignOut title="Leave channel" />
                    </div>
                  )}
                  onChannelSwitched={(channel) => setCurrentChannel(channel)}
                />
              </div>
            </div>

            <div className="chat">
              <div
                className={`people ${showMembers ? "active" : ""}`}
                onClick={() => setShowMembers(!showMembers)}
              >
                <span>
                  <strong>{presenceData[currentChannel?.id]?.occupancy || 0} </strong>/{" "}
                  {totalchannelMembers}
                </span>
                <PeopleGroup />
              </div>

              <div className="info">
                <span className="hamburger" onClick={() => setShowChannels(true)}>
                  ☰
                </span>
                <h4>{currentChannel?.name || currentChannel?.id}</h4>
                <small>{currentChannel?.description || currentChannel?.id}</small>
                <hr />
              </div>

              {userBlocked ? (
                <BlockedNotification />
              ) : (
                <>
                  <MessageList
                    fetchMessages={20}
                    enableReactions
                    reactionsPicker={<Picker />}
                    extraActionsRenderer={(m) => (
                      <div onClick={() => openFlaggingModal(m)}>
                        <Megaphone title="Report user" />
                      </div>
                    )}
                  >
                    <TypingIndicator showAsMessage />
                  </MessageList>
                  <MessageInput
                    disabled={userMuted}
                    typingIndicator
                    fileUpload="image"
                    emojiPicker={<Picker />}
                    placeholder={userMuted ? "You were muted from this channel" : "Type Message"}
                  />
                </>
              )}
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
        )}
      </Chat>
    </div>
  );
}

const BanNotification = () => {
  return <p className="banned">Unfortunately, you were banned from the chat.</p>;
};

const BlockedNotification = () => {
  return <p className="blocked">Unfortunately, you were blocked from this channel.</p>;
};

const JoinChannelModal = ({ unJoinedChannels, setShowChannelsModal, joinChannel }: any) => {
  return (
    <div className="overlay">
      <div className="modal">
        <h4>
          Join another channel
          <span className="close" onClick={() => setShowChannelsModal(false)}>
            ✕
          </span>
        </h4>
        <ChannelList
          channels={unJoinedChannels}
          onChannelSwitched={(channel) => joinChannel(channel)}
        />
      </div>
    </div>
  );
};

const FlagMessageModal = ({
  flaggingMessage,
  setShowFlaggingModal,
  flagMessage,
  allUsers,
}: any) => {
  const [reason, setReason] = useState("");
  const user = allUsers.find(
    (u: UUIDMetadataObject<ObjectCustom>) => u.id === flaggingMessage?.uuid
  );

  return (
    <div className="overlay">
      <div className="modal">
        <h4>
          Report {user?.name}
          <span
            className="close"
            onClick={() => {
              setShowFlaggingModal(false);
              setReason("");
            }}
          >
            ✕
          </span>
        </h4>
        <div className="form">
          <input
            type="text"
            placeholder="Describe the report reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button onClick={() => flagMessage(reason)}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ModeratedChat;
