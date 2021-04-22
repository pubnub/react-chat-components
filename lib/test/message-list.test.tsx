import React from "react";

import { MessageList } from "../src/message-list/message-list";
import { MessageInput } from "../src/message-input/message-input";
import { render, screen } from "../mock/custom-renderer";
import { Picker } from "../mock/emoji-picker-mock";
import userEvent from "@testing-library/user-event";

describe("Message List", () => {
  let scrollIntoViewMock;
  let intersectionObserverMock;

  beforeEach(() => {
    scrollIntoViewMock = jest.fn();
    intersectionObserverMock = jest.fn().mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    });

    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    window.IntersectionObserver = intersectionObserverMock;
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

  test("renders newly sent messages", async () => {
    render(
      <div>
        <MessageList welcomeMessages={false} />
        <MessageInput draftMessage="New Message" />
      </div>
    );
    userEvent.type(screen.getByDisplayValue("New Message"), "{enter}");

    expect(await screen.findByDisplayValue("")).toBeVisible();
    expect(await screen.findByText("New Message")).toBeVisible();
  });

  test("fetches and renders message history", async () => {
    render(<MessageList welcomeMessages={false} fetchMessages={10} />);

    expect(
      await screen.findByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    ).toBeVisible();
  });

  test("fetches more history when scrolling to top of the list", async () => {
    render(<MessageList welcomeMessages={false} fetchMessages={3} />);

    expect(
      await screen.findByText("Curabitur id quam ac mauris aliquet imperdiet quis eget nisl.")
    ).toBeVisible();
    expect(
      screen.queryByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    ).not.toBeInTheDocument();

    const observerCallback = intersectionObserverMock.mock.calls[0][0]; // spinnerObserver
    observerCallback([{ isIntersecting: true }]);

    expect(
      await screen.findByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    ).toBeVisible();
  });

  test("shows a notice on a new message when scrolled out of bottom of the list", async () => {
    render(
      <div>
        <MessageList welcomeMessages={false} />
        <MessageInput draftMessage="Test Message" />
      </div>
    );

    const observerCallback = intersectionObserverMock.mock.calls[1][0]; // bottomObserver
    observerCallback([{ isIntersecting: false }]);

    userEvent.type(screen.getByDisplayValue("Test Message"), "{enter}");

    expect(await screen.findByText("Test Message")).toBeVisible();
    expect(await screen.findByText("1 new messages ↓")).toBeVisible();
  });

  test("renders reactions", async () => {
    render(<MessageList welcomeMessages={false} fetchMessages={10} enableReactions />);

    expect(await screen.findByText("🙂 1")).toBeVisible();
  });

  // TODO toBeVisible doesnt work with visibility: hidden on the dom tree
  // https://github.com/testing-library/jest-dom/issues/209
  // test("closes the reactions panel on outside click", async () => {
  //   render(<MessageList welcomeMessages={false} fetchMessages={10} enableReactions />);

  //   const triggers = await screen.findAllByText("☺");
  //   userEvent.click(triggers[0]);
  //   userEvent.click(screen.getByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit."));

  //   await waitFor(() => expect(screen.getByText("Frequently Used")).not.toBeVisible());
  // });

  test("adds new reactions", async () => {
    render(
      <MessageList
        welcomeMessages={false}
        fetchMessages={10}
        enableReactions
        reactionsPicker={<Picker />}
      />
    );

    const triggers = await screen.findAllByText("☺");
    userEvent.click(triggers[0]);
    userEvent.click(screen.getByText("😄"));

    expect(await screen.findByText("😄 1")).toBeVisible();
  });

  test("adds to existing reactions", async () => {
    render(<MessageList welcomeMessages={false} fetchMessages={10} enableReactions />);
    userEvent.click(await screen.findByText("🙂 1"));

    expect(await screen.findByText("🙂 2")).toBeVisible();
    expect(screen.queryByText("🙂 1")).not.toBeInTheDocument();
  });

  test("removes from existing reactions", async () => {
    render(<MessageList welcomeMessages={false} fetchMessages={10} enableReactions />);
    userEvent.click(await screen.findByText("🙂 1"));
    userEvent.click(await screen.findByText("🙂 2"));

    expect(await screen.findByText("🙂 1")).toBeVisible();
    expect(screen.queryByText("🙂 2")).not.toBeInTheDocument();
  });
});
