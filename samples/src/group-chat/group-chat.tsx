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
} from "pubnub-chat-components";
import { ChannelMetadataObject, ObjectCustom } from "pubnub";
import "./group-chat.scss";
import { ReactComponent as PeopleGroup } from "../people-group.svg";

function GroupChat() {
  const [channel, setChannel] = React.useState("space_ac4e67b98b34b44c4a39466e93e");
  const [showMembers, setShowMembers] = React.useState(false);

  const [userList] = useUsers({ include: { customFields: true } });
  const [channelList] = useChannels({ include: { customFields: true } });
  const [memberList] = useChannelMembers({ channel, include: { customUUIDFields: true } });
  // eslint-disable-next-line
  const [presentMembers, totalPresence] = usePresence({ channels: [channel] });

  const handleSwitchChannel = (channel: ChannelMetadataObject<ObjectCustom>) => {
    setChannel(channel.id);
  };

  return (
    <div className="app-group">
      <Chat {...{ theme: "dark", channel, userList }}>
        <div className="channels">
          <ChannelList channelList={channelList} onChannelSwitched={handleSwitchChannel} />
        </div>

        <div className="chat">
          <div
            className={`people ${showMembers ? "active" : ""}`}
            onClick={() => setShowMembers(!showMembers)}
          >
            <span>
              {totalPresence || 0} / {memberList.length || 0}
            </span>
            <PeopleGroup />
          </div>

          <MessageList fetchMessages={10} enableReactions>
            <TypingIndicator showAsMessage />
          </MessageList>

          <MessageInput typingIndicator emojiPicker />
        </div>

        <div className={`members ${showMembers && "shown"}`}>
          <MemberList memberList={memberList} />
        </div>
      </Chat>
    </div>
  );
}

export default GroupChat;
