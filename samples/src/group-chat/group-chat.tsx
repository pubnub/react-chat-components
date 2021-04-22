import React from "react";
import {
  ChannelList,
  Chat,
  MemberList,
  MessageInput,
  MessageList,
  TypingIndicator,
  useChannelMembers,
  useChannels,
  usePresence,
  useUsers,
} from "@pubnub/react-chat-components";
import { ChannelMetadataObject, ObjectCustom } from "pubnub";
import "./group-chat.scss";
import { ReactComponent as PeopleGroup } from "../people-group.svg";

function GroupChat() {
  const [currentChannel, setChannel] = React.useState("space_ac4e67b98b34b44c4a39466e93e");
  const [showMembers, setShowMembers] = React.useState(false);

  const [users] = useUsers({ include: { customFields: true } });
  const [channels] = useChannels({ include: { customFields: true } });
  const [members] = useChannelMembers({
    channel: currentChannel,
    include: { customUUIDFields: true },
  });
  // eslint-disable-next-line
  const [presentMembers, totalPresence] = usePresence({ channels: [currentChannel] });

  const handleSwitchChannel = (ch: ChannelMetadataObject<ObjectCustom>) => {
    setChannel(ch.id);
  };

  return (
    <div className="app-group">
      <Chat {...{ theme: "dark", currentChannel, users }}>
        <div className="channels">
          <ChannelList channels={channels} onChannelSwitched={handleSwitchChannel} />
        </div>

        <div className="chat">
          <div
            className={`people ${showMembers ? "active" : ""}`}
            onClick={() => setShowMembers(!showMembers)}
          >
            <span>
              {totalPresence || 0} / {members.length || 0}
            </span>
            <PeopleGroup />
          </div>

          <MessageList fetchMessages={10}>
            <TypingIndicator showAsMessage />
          </MessageList>

          <MessageInput typingIndicator />
        </div>

        <div className={`members ${showMembers && "shown"}`}>
          <MemberList members={members} />
        </div>
      </Chat>
    </div>
  );
}

export default GroupChat;
