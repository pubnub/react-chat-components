import React from "react";
import { Chat } from "pubnub-chat-components";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { PubNubMock, mockUsers } from "./pubnub-mock";

const pubnub = new PubNubMock();

// const pubnub = new PubNub({
//   publishKey: "pub-c-2e4f37a4-6634-4df6-908d-32eb38d89a1b",
//   subscribeKey: "sub-c-1456a186-fd7e-11ea-ae2d-56dc81df9fb5",
//   uuid: "user_0202a46151cc43af890caa521c40576e",
// });

export const decorators = [
  (Story, context) => (
    <PubNubProvider client={pubnub}>
      <Chat
        {...{
          channel: "space_ac4e67b98b34b44c4a39466e93e",
          theme: context.parameters.theme || "dark",
          userList: mockUsers().map((u) => u.uuid),
        }}
      >
        <Story />
      </Chat>
    </PubNubProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  viewMode: "docs",
  options: {
    storySort: {
      order: [
        "Introduction",
        ["About", "Usage", "Metadata"],
        "Custom Hooks",
        [
          "About",
          "useUsers",
          "useUser",
          "useChannels",
          "useChannelMembers",
          "useUserMemberships",
          "usePresence",
        ],
        "Components",
        ["Chat (Provider)"],
        "UI Customization",
        ["Themes", "CSS Variables", "Custom Renderers"],
      ],
    },
  },
};
