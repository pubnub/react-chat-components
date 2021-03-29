import React from "react";

import { MessageList } from "../src/message-list/message-list";
import { MessageInput } from "../src/message-input/message-input";
import { render, fireEvent, screen, waitFor } from "../mock/custom-renderer";
import "../mock/intersection-observer";

describe("Message List", () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  test("renders default welcome messages", async () => {
    render(<MessageList />);

    expect(
      screen.getByText("Welcome to a chat application built with PubNub Chat Components 👋")
    ).toBeVisible();
    expect(
      screen.getByText("Send a message now to start interacting with other users in the app ⬇️")
    ).toBeVisible();
  });

  test("renders empty with welcome message disabled", async () => {
    render(<MessageList welcomeMessages={false} />);

    expect(
      screen.queryByText("Welcome to a chat application built with PubNub Chat Components 👋")
    ).not.toBeInTheDocument();
  });

  test("renders with custom welcome messages", async () => {
    const message = {
      message: { type: "welcome", text: "Custom welcome" },
      timetoken: "16165851271766362",
    };
    render(<MessageList welcomeMessages={message} />);

    expect(screen.getByText("Custom welcome")).toBeVisible();
    expect(
      screen.queryByText("Welcome to a chat application built with PubNub Chat Components 👋")
    ).not.toBeInTheDocument();
  });

  test("renders messages with custom message renderer", async () => {
    render(
      <MessageList messageRenderer={(props) => <div>Custom {props.message.message.text}</div>} />
    );

    expect(
      screen.getByText("Custom Welcome to a chat application built with PubNub Chat Components 👋")
    ).toBeVisible();
  });

  test("renders messages with custom bubble renderer", async () => {
    render(
      <MessageList bubbleRenderer={(props) => <div>Custom {props.message.message.text}</div>} />
    );

    expect(
      screen.getByText("Custom Welcome to a chat application built with PubNub Chat Components 👋")
    ).toBeVisible();
  });

  test("fetches and renders message history", async () => {
    render(<MessageList welcomeMessages={false} fetchMessages={10} />);

    expect(
      await screen.findByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    ).toBeVisible();
  });

  test("renders reactions", async () => {
    render(<MessageList welcomeMessages={false} fetchMessages={10} enableReactions />);

    expect(await screen.findByText("🙂 1")).toBeVisible();
  });

  test("adds new reactions", async () => {
    render(<MessageList welcomeMessages={false} fetchMessages={10} enableReactions />);

    const triggers = await screen.findAllByText("☺");
    fireEvent.click(triggers[0]);
    fireEvent.click(screen.getByText("😄"));

    expect(await screen.findByText("😄 1")).toBeVisible();
  });

  test("adds to existing reactions", async () => {
    render(<MessageList welcomeMessages={false} fetchMessages={10} enableReactions />);
    fireEvent.click(await screen.findByText("🙂 1"));

    expect(await screen.findByText("🙂 2")).toBeVisible();
    expect(screen.queryByText("🙂 1")).not.toBeInTheDocument();
  });

  test("removes from existing reactions", async () => {
    render(<MessageList welcomeMessages={false} fetchMessages={10} enableReactions />);
    fireEvent.click(await screen.findByText("🙂 1"));
    fireEvent.click(await screen.findByText("🙂 2"));

    expect(await screen.findByText("🙂 1")).toBeVisible();
    expect(screen.queryByText("🙂 2")).not.toBeInTheDocument();
  });

  test("renders newly sent messages", async () => {
    render(
      <div>
        <MessageList welcomeMessages={false} />
        <MessageInput draftMessage="New Message" />
      </div>
    );
    fireEvent.keyPress(screen.getByDisplayValue("New Message"), {
      key: "Enter",
      charCode: 13,
    });

    expect(await screen.findByDisplayValue("")).toBeVisible();
    expect(await screen.findByText("New Message")).toBeVisible();
  });
});
