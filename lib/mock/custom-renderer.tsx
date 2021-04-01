import React, { ReactNode } from "react";
import { PubNubProvider } from "pubnub-react";
import { render, RenderResult } from "@testing-library/react";
import { Chat, ChatProps } from "../src/chat";
import { PubNubMock } from "./pubnub-mock";

const pubnub = PubNubMock();

const defaultOptions = {
  providerProps: {
    currentChannel: "test-general",
  },
};

const customRender = (
  ui: ReactNode,
  options: { providerProps: ChatProps } = defaultOptions
): RenderResult => {
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
