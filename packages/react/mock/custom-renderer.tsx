import React, { ReactNode } from "react";
import { PubNubProvider } from "pubnub-react";
import { render, RenderResult } from "@testing-library/react";
import { Chat, ChatProps } from "../src/chat";
import { PubNubMock, PubNubMockOptions } from "../../common/mock/pubnub-mock";

const defaultOptions = {
  providerProps: {
    currentChannel: "test-general",
  },
  pubnubProps: {},
};

const customRender = (
  ui: ReactNode,
  options: { providerProps?: ChatProps; pubnubProps?: PubNubMockOptions } = defaultOptions
): RenderResult => {
  const { providerProps, pubnubProps, ...renderOptions } = options;
  const pubnub = new PubNubMock(pubnubProps || {});

  return render(
    <PubNubProvider client={pubnub}>
      <Chat {...providerProps}>{ui}</Chat>
    </PubNubProvider>,
    renderOptions
  );
};

export * from "@testing-library/react";
export { customRender as render };
