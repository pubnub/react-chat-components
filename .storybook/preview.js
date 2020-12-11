import React from "react";
import { PubNubProvider } from "../src";
import { PubNubMock } from "./pubnub-mock";

const pubnub = new PubNubMock();

export const decorators = [
  (Story, context) => (
    <PubNubProvider
      {...{
        pubnub,
        channel: "space_ac4e67b98b34b44c4a39466e93e",
        theme: context.parameters.theme || "dark",
      }}
    >
      <Story />
    </PubNubProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
