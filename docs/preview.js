import React from "react";
import { Chat } from "../lib/src";
import { PubNubProvider } from "pubnub-react";
import { PubNubMock, mockUsers } from "./pubnub-mock";

const pubnub = new PubNubMock();

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
