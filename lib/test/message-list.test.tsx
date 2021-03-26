import React from "react";

import { MessageList } from "../src/message-list/message-list";
import { MessageInput } from "../src/message-input/message-input";
import { render, fireEvent, waitFor, screen } from "../mock/custom-renderer";
import "../mock/intersection-observer";

describe("Message List", () => {
  test("renders default welcome messages", async () => {
    render(<MessageList />, { providerProps: { channel: "test-ml-1" } });

    expect(
      screen.getByText("Welcome to a chat application built with PubNub Chat Components 👋")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Send a message now to start interacting with other users in the app ⬇️")
    ).toBeInTheDocument();
  });

  test("renders empty with welcome message disabled", async () => {
    render(<MessageList welcomeMessages={false} />, { providerProps: { channel: "test-ml-1" } });

    expect(
      screen.queryByText("Welcome to a chat application built with PubNub Chat Components 👋")
    ).not.toBeInTheDocument();
  });
});
