import React from "react";
import { PubNubProvider } from "../src";

const config = {
  publishKey: "demo",
  subscribeKey: "demo",
  uuid: "test-id",
  channel: "test-channel",
};

export const decorators = [
  (Story) => (
    <PubNubProvider {...config}>
      <Story />
    </PubNubProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
