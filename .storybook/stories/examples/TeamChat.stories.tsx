import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import {
  MessageInput,
  MessageList,
  ChannelList,
  MemberList,
  TypingIndicator,
} from "../../../src";
import { mockUsers, mockChannels } from "../../pubnub-mock";

import "./TeamChat.css";

export default {
  title: "Examples / Team Chat",
  parameters: {
    docs: { page: null },
  },
} as Meta;

const Template: Story = () => {
  const [showMembers, setShowMembers] = useState(false);

  return (
    <div className="app">
      <div className="channels">
        <ChannelList channelList={mockChannels()} />
      </div>

      <div className="chat">
        <div
          className={`people ${showMembers && "active"}`}
          onClick={() => setShowMembers(!showMembers)}
        >
          <svg viewBox="0 0 20 15" width="20" height="15">
            <g fill="currentColor" fillRule="evenodd">
              <path d="M7 13.503a.5.5 0 00.5.497h11a.5.5 0 00.5-.497c-.001-.035-.032-.895-.739-1.734C17.287 10.612 15.468 10 13 10s-4.287.612-5.261 1.768c-.707.84-.738 1.699-.739 1.734M18.5 15h-11c-.827 0-1.5-.673-1.5-1.5 0-.048.011-1.19.924-2.315.525-.646 1.241-1.158 2.128-1.522C10.123 9.223 11.452 9 13 9s2.876.223 3.948.662c.887.364 1.603.876 2.128 1.522.914 1.125.924 2.267.924 2.315 0 .827-.673 1.5-1.5 1.5M13 1c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3m0 7c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4M4.5 15h-3C.673 15 0 14.327 0 13.5c0-.037.008-.927.663-1.8.378-.505.894-.904 1.533-1.188.764-.34 1.708-.512 2.805-.512.179 0 .356.005.527.014a.5.5 0 01-.053.999 9.1 9.1 0 00-.473-.012c-3.894 0-3.997 2.379-4 2.503a.5.5 0 00.5.497h3a.5.5 0 010 1L4.5 15zM5 4c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2m0 5C3.346 9 2 7.654 2 6s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3" />
            </g>
          </svg>
        </div>
        <MessageList />
        <MessageInput />
        <TypingIndicator />
      </div>

      <div className={`members ${showMembers && "shown"}`}>
        <MemberList memberList={mockUsers().map((u) => u.uuid)} />
      </div>
    </div>
  );
};

export const Light = Template.bind({});
Light.parameters = {
  theme: "light",
};

export const Dark = Template.bind({});
Dark.parameters = {
  theme: "dark",
};
