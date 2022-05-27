import React, { useState } from "react";
import { Picker } from "emoji-mart";
import { MessageList, MessageInput, MemberList } from "@pubnub/react-chat-components";
import "emoji-mart/css/emoji-mart.css";

import { ReactComponent as ExpandIcon } from "../assets/expand.svg";
import { ReactComponent as ChatIcon } from "../assets/chat.svg";
import { ReactComponent as GroupIcon } from "../assets/user-group.svg";
import { ReactComponent as ArrowIcon } from "../assets/arrow-turn-up.svg";

type ChatViewProps = {
  channelOccupants: { uuid: string }[];
  darkMode: boolean;
};

const ChatView = ({ channelOccupants, darkMode }: ChatViewProps): JSX.Element => {
  const members = channelOccupants?.map((o) => o.uuid);

  const [chatExpanded, setChatExpanded] = useState(true);
  const [showMembers, setShowMembers] = useState(false);

  return (
    <aside
      className={`chat-view absolute flex flex-col shrink-0
              ${
                chatExpanded
                  ? "bg-gray-400 dark:bg-navy-900 h-full lg:static md:w-96 right-0 w-full wide"
                  : "bg-gray-400/60 dark:bg-navy-900/60 narrow right-0 top-0 w-[67px]"
              }
          `}
    >
      <header className="dark:text-gray-200 flex h-14 items-center px-5 shrink-0 text-ocean-800">
        <button
          className={`p-2 ${chatExpanded && "rotate-180"}`}
          onClick={() => setChatExpanded(!chatExpanded)}
        >
          <ExpandIcon />
        </button>
        <h4 className={`font-bold grow text-center text-sm uppercase ${!chatExpanded && "hidden"}`}>
          {showMembers ? "Participants" : "Live Chat"}
        </h4>
        <button
          className={`p-2 ${!chatExpanded && "hidden"}`}
          onClick={() => setShowMembers(!showMembers)}
        >
          {showMembers ? <ChatIcon /> : <GroupIcon />}
        </button>
      </header>

      <section className={`h-full flex-col flex overflow-hidden ${!chatExpanded && "hidden"}`}>
        {showMembers ? (
          <MemberList members={members} />
        ) : (
          <>
            <MessageList />
            <hr className="dark:border-navy-600 border-1" />
            <MessageInput
              fileUpload="image"
              senderInfo
              emojiPicker={<Picker theme={darkMode ? "dark" : "light"} />}
              sendButton={
                <span className="dark:hover:bg-navy-600 dark:text-gray-200 flex h-9 hover:bg-gray-400 items-center justify-center rounded-full text-ocean-800 w-9">
                  <ArrowIcon />
                </span>
              }
            />
          </>
        )}
      </section>
    </aside>
  );
};

export default ChatView;
