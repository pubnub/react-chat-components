import React from "react";
import { PubNubProvider } from "pubnub-react";

import { Chat } from "../src";
import { PubNubMock } from "../mock/pubnub-mock";
import users from "../../data/users.json";

const pubnub = new PubNubMock();

export const decorators = [
  (Story, context) => {
    const theme = context.globals?.backgrounds?.value === "#1c1c28" ? "dark" : "light";

    return (
      <PubNubProvider client={pubnub}>
        <Chat
          {...{
            currentChannel: "space.ac4e67b98b34b44c4a39466e93e",
            theme,
            users,
          }}
        >
          <Story />
        </Chat>
      </PubNubProvider>
    );
  },
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  viewMode: "docs",
  backgrounds: {
    default: "light",
    values: [
      {
        name: "light",
        value: "#f0f3f7",
      },
      {
        name: "dark",
        value: "#1c1c28",
      },
    ],
  },
  options: {
    storySort: {
      order: [
        "Introduction",
        ["Getting Started", "Metadata", "Emoji Pickers", "Error Handling", "Access Manager"],
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
        ["Themes", "CSS Variables", "Custom Renderers", "Examples"],
      ],
    },
  },
};
