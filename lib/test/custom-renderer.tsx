import React, { ReactNode } from "react";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { render, RenderResult } from "@testing-library/react";
import { Chat } from "../src/chat";

// TODO: Implement mock with approach from https://kentcdodds.com/blog/stop-mocking-fetch
const pubnub = new PubNub({
  publishKey: "pub-c-2e4f37a4-6634-4df6-908d-32eb38d89a1b",
  subscribeKey: "sub-c-1456a186-fd7e-11ea-ae2d-56dc81df9fb5",
});

const defaultOptions = {
  providerProps: {
    channel: "test",
  },
};

const customRender = (ui: ReactNode, options = defaultOptions): RenderResult => {
  const { providerProps, ...renderOptions } = options;

  return render(
    <PubNubProvider client={pubnub}>
      <Chat {...providerProps}>{ui}</Chat>
    </PubNubProvider>,
    renderOptions
  );
};

export * from "@testing-library/react";
export { customRender as render };
