import React, { useState } from "react";
import pickerData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { actionCompleted, containsEmoji } from "pubnub-demo-integration";
import {
  MessageList,
  MessageInput,
  MemberList,
  MessagePayload,
} from "@pubnub/react-chat-components";
import type { UriFileInput } from "pubnub";

import { ReactComponent as ExpandIcon } from "../assets/expand.svg";
import { ReactComponent as ChatIcon } from "../assets/chat.svg";
import { ReactComponent as GroupIcon } from "../assets/user-group.svg";
import { ReactComponent as ArrowIcon } from "../assets/arrow-turn-up.svg";

type ChatViewProps = {
  channelOccupants: { uuid: string }[];
  chatExpanded: boolean;
  darkMode: boolean;
  setChatExpanded: (val: boolean) => void;
};

const ChatView = ({
  channelOccupants,
  chatExpanded,
  darkMode,
  setChatExpanded,
}: ChatViewProps): JSX.Element => {
  const members = channelOccupants?.map((o) => o.uuid);
  const [showMembers, setShowMembers] = useState(false);

  const completeDemoAction = (message: MessagePayload | File | UriFileInput) => {
    if ((message as MessagePayload | File).type === "default") {
      if (containsEmoji({ testString: (message as MessagePayload | File).text }))
        actionCompleted({ action: "Send a Message with an Emoji", blockDuplicateCalls: true });
      else actionCompleted({ action: "Send Text Message", blockDuplicateCalls: true });
    }
  };

  return (
    <aside
      className={`chat-view absolute flex flex-col shrink-0
              ${
                chatExpanded
                  ? "bg-gray-400 dark:bg-navy-900 h-full md:static md:w-[280px] xl:w-[360px] right-0 w-full wide"
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
          onClick={() => {
            setShowMembers(!showMembers);
            if (!showMembers)
              actionCompleted({ action: "View Channel Participants", blockDuplicateCalls: true });
          }}
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
              senderInfo
              emojiPicker={<Picker data={pickerData} theme={darkMode ? "dark" : "light"} />}
              sendButton={
                <span className="dark:hover:bg-navy-600 dark:text-gray-200 flex h-9 hover:bg-gray-400 items-center justify-center rounded-full text-ocean-800 w-9">
                  <ArrowIcon />
                </span>
              }
              onSend={completeDemoAction}
            />
          </>
        )}
      </section>
    </aside>
  );
};

export default ChatView;
