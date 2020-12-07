import React from "react";
import { PubNubProvider } from "../src";
import { PubNubMock } from "./pubnub-mock";

const pubnub = new PubNubMock();

export const decorators = [
  (Story) => (
    <PubNubProvider {...{ pubnub, channel: "test-channel", theme: "dark" }}>
      <Story />
    </PubNubProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
