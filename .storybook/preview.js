import React from "react";
import { ChatComponents } from "../src";
import { PubNubMock } from "./pubnub-mock";

const pubnub = new PubNubMock();

export const decorators = [
  (Story, context) => (
    <ChatComponents
      {...{
        pubnub,
        channel: "space_ac4e67b98b34b44c4a39466e93e",
        theme: context.parameters.theme || "dark",
      }}
    >
      <Story />
    </ChatComponents>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
