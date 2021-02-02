import React from "react";
import {
  Channel,
  ChannelList,
  Chat,
  MemberList,
  MessageInput,
  MessageList,
  TypingIndicator,
  useChannelMembers,
  useChannels,
  usePresence,
  // useUser,
  // useUserMemberships,
  useUsers,
} from "pubnub-chat-components";
import "./group-chat.css";

// const channelRenderer = (channel: Channel) => <span>{channel.name}</span>
// const memberRenderer = (member: UserData) => <span>{member.name}</span>

// const users = [
//   {
//     id: "user_00505cca5b04460fafd716af48665ca1",
//     name: "Provided Name",
//     externalId: null,
//     profileUrl:
//       "https://www.gravatar.com/avatar/b1951c3e65ca6362c465f6ea75f0e86a?s=256&d=identicon",
//     email: null,
//     custom: { title: "Fontend Programmer" },
//     updated: "2020-09-23T09:23:33.232181Z",
//     eTag: "Adbmvd68xZWY/wE",
//   },
// ];

// const channels = [
//   {
//     id: "space_ac4e67b98b34b44c4a39466e93e",
//     name: "INTRODUCTIONS",
//   },
// ];

const theme = "dark";

function GroupChat() {
  const [channel, setChannel] = React.useState("space_ac4e67b98b34b44c4a39466e93e");
  const [showMembers, setShowMembers] = React.useState(false);

  const [userList] = useUsers({ include: { customFields: true } });
  const [channelList] = useChannels({ include: { customFields: true } });
  const [memberList] = useChannelMembers({ channel, include: { customUUIDFields: true } });
  const [totalPresence] = usePresence({ channels: [channel] });
  // const [channelList, fetchMoreChannels, totalChannels] = useUserMemberships({
  //   uuid: "user_00505cca5b04460fafd716af48665ca1",
  // });
  // const usr = useUser({ uuid: "user_00505cca5b04460fafd716af48665ca1" });

  const handleSwitchChannel = (channel: Channel) => {
    setChannel(channel.id);
  };

  return (
    <div className="app">
      <Chat
        {...{
          theme,
          channel,
          // subscribeChannels: ["ch1", "ch2", "ch3"],
          userList,
          // objects: false,
          // attachSenders: true,
          // enablePresence: false
        }}
      >
        <div className="channels">
          <ChannelList
            channelList={channelList}
            onChannelSwitched={handleSwitchChannel}
            // sort={(a, b) => 1}
            // filter={(ch) => ch.name === "What?"}
            // channelRenderer={channelRenderer}
          />
        </div>

        <div className="chat">
          <div
            className={`people ${showMembers ? "active" : ""}`}
            onClick={() => setShowMembers(!showMembers)}
          >
            <TypingIndicator />
            <span>
              {/* {totalPresence || 0} / {memberList.length || 0} */}
            </span>
            <svg viewBox="0 0 20 15" width="20" height="15">
              <title>People Group</title>
              <g fill="currentColor" fillRule="evenodd">
                <path d="M7 13.503a.5.5 0 00.5.497h11a.5.5 0 00.5-.497c-.001-.035-.032-.895-.739-1.734C17.287 10.612 15.468 10 13 10s-4.287.612-5.261 1.768c-.707.84-.738 1.699-.739 1.734M18.5 15h-11c-.827 0-1.5-.673-1.5-1.5 0-.048.011-1.19.924-2.315.525-.646 1.241-1.158 2.128-1.522C10.123 9.223 11.452 9 13 9s2.876.223 3.948.662c.887.364 1.603.876 2.128 1.522.914 1.125.924 2.267.924 2.315 0 .827-.673 1.5-1.5 1.5M13 1c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3m0 7c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4M4.5 15h-3C.673 15 0 14.327 0 13.5c0-.037.008-.927.663-1.8.378-.505.894-.904 1.533-1.188.764-.34 1.708-.512 2.805-.512.179 0 .356.005.527.014a.5.5 0 01-.053.999 9.1 9.1 0 00-.473-.012c-3.894 0-3.997 2.379-4 2.503a.5.5 0 00.5.497h3a.5.5 0 010 1L4.5 15zM5 4c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2m0 5C3.346 9 2 7.654 2 6s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3" />
              </g>
            </svg>
          </div>

          <MessageList
            // disableReactions
            // disableUserFetch   // needs rework
            fetchMessages={10}
            // messageRenderer={messageRenderer}
            // bubbleRenderer={messageRenderer}
            // rendererFilter={rendererFilter}
            // onMessage={(m) => console.log(`New message: ${m}`)}
            // onScroll={(m) => console.log(`Scroll event: ${m}`)}
          >
            <TypingIndicator showAsMessage />
          </MessageList>

          <MessageInput
            typingIndicator
            // placeholder="Custom placeholder"
            // initialValue="Initial value"
            // hideSendButton
            // sendButtonContent="SEND"
            // disableEmojiPicker
            // onChange={(m) => console.log(`Change event: ${m}`)}
            // onSend={(m) => console.log(`Send event: ${m}`)}
          />
        </div>

        <div className={`members ${showMembers && "shown"}`}>
          <MemberList
            memberList={memberList}
            // sort={(a, b) => 1}
            // filter={(member) => member.name === "Leonardo Lukasik"}
            // memberRenderer={memberRenderer}
          />
        </div>
      </Chat>
    </div>
  );
}

export default GroupChat;
