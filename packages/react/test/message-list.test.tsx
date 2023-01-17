import React from "react";
import { MessageList } from "../src/message-list/message-list";
import { MessageInput } from "../src/message-input/message-input";
import { MessagePayload } from "@pubnub/common-chat-components";
import { render, screen, act } from "../mock/custom-renderer";
import { Picker } from "../mock/emoji-picker-mock";
import userEvent from "@testing-library/user-event";
import users from "../../../data/users/users.json";

describe("Message List", () => {
  test("renders with custom welcome messages", async () => {
    const message = {
      message: { id: "id-1", type: "welcome", text: "Welcome" },
      timetoken: "16165851271766362",
    };
    render(<MessageList welcomeMessages={message} />);

    expect(screen.getByText("Welcome")).toBeVisible();
    expect(screen.getByText(/11:25/)).toBeVisible();
  });

  test("renders messages with custom message renderer", async () => {
    const message = {
      message: { id: "id-1", type: "welcome", text: "Welcome" },
      timetoken: "16165851271766362",
    };
    render(
      <MessageList
        welcomeMessages={message}
        messageRenderer={(props) => (
          <div>Custom {(props.message.message as MessagePayload).text}</div>
        )}
      />
    );

    expect(screen.getByText("Custom Welcome")).toBeVisible();
    expect(screen.queryByText(/11:25/)).not.toBeInTheDocument();
  });

  test("renders messages with custom bubble renderer", async () => {
    const message = {
      message: { id: "id-1", type: "welcome", text: "Welcome" },
      timetoken: "16165851271766362",
    };
    render(
      <MessageList
        welcomeMessages={message}
        bubbleRenderer={(props) => (
          <div>Custom {(props.message.message as MessagePayload).text}</div>
        )}
      />
    );

    expect(screen.getByText("Custom Welcome")).toBeVisible();
    expect(screen.getByText(/11:25/)).toBeVisible();
  });

  test("renders extra actions", async () => {
    const message = {
      message: { id: "id-1", type: "welcome", text: "Welcome" },
      timetoken: "16165851271766362",
    };
    render(
      <MessageList welcomeMessages={message} extraActionsRenderer={() => <div>Extra Action</div>} />
    );

    expect(screen.getByText("Extra Action")).toBeVisible();
  });

  test("renders newly sent messages", async () => {
    render(
      <div>
        <MessageList />
        <MessageInput draftMessage="New Message" />
      </div>
    );
    await userEvent.type(screen.getByDisplayValue("New Message"), "{enter}");

    expect(await screen.findByDisplayValue("")).toBeVisible();
    expect(await screen.findByText("New Message")).toBeVisible();
  });

  test("fetches and renders message history", async () => {
    render(<MessageList fetchMessages={10} />);

    expect(
      await screen.findByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    ).toBeVisible();
  });

  test("fetches more history when scrolling to top of the list", async () => {
    render(<MessageList fetchMessages={4} />);

    expect(
      await screen.findByText("Curabitur id quam ac mauris aliquet imperdiet quis eget nisl.")
    ).toBeVisible();
    expect(
      screen.queryByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    ).not.toBeInTheDocument();

    await act(async () => {
      for (const call of window.IntersectionObserver["mock"].calls) {
        const callback = call[0];
        callback([{ isIntersecting: true }]);
      }
    });

    expect(
      await screen.findByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    ).toBeVisible();
  });

  test("shows a notice on a new message when scrolled out of bottom of the list", async () => {
    render(
      <div>
        <MessageList />
        <MessageInput />
      </div>
    );

    await userEvent.type(screen.getByPlaceholderText("Send message"), "Existing Message{enter}");
    expect(await screen.findByText("Existing Message")).toBeVisible();

    await act(() => {
      const observerCallback = window.IntersectionObserver["mock"].calls[1][0]; // bottomObserver
      observerCallback([{ isIntersecting: false }]);
    });

    await userEvent.type(screen.getByPlaceholderText("Send message"), "Test Message{enter}");

    expect(await screen.findByText("Test Message")).toBeVisible();
    expect(await screen.findByText("1 new message")).toBeVisible();
  });

  test("loads users when seen", async () => {
    render(<MessageList fetchMessages={10} />, {
      providerProps: {
        currentChannel: "test-general",
        getUser: (id) => users.find((u) => u.id === id),
      },
    });

    expect(await screen.findByText("Luis Griffin")).toBeVisible();
  });

  /** Fetching files */

  test("fetches file urls", async () => {
    render(<MessageList fetchMessages={10} />);

    expect(await screen.findByAltText("pubnub-logo-docs.svg")).toHaveAttribute(
      "src",
      "https://images.ctfassets.net/3prze68gbwl1/76L8lpo46Hu4WvNr9kJvkE/15bade65538769e12a12d95bff1df776/pubnub-logo-docs.svg"
    );
  });

  /** Reactions */

  test("renders reactions", async () => {
    render(<MessageList fetchMessages={10} enableReactions />);

    expect(await screen.findByText("🙂 1")).toBeVisible();
  });

  // TODO: toBeVisible doesnt work with visibility: hidden on the dom tree
  // https://github.com/testing-library/jest-dom/issues/209
  test.skip("closes the reactions panel on outside click", async () => {
    render(<MessageList fetchMessages={10} enableReactions />);

    const triggers = await screen.findAllByText("☺");
    await userEvent.click(triggers[0]);
    await userEvent.click(
      screen.getByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    );

    expect(screen.getByText("Frequently Used")).not.toBeVisible();
  });

  test("adds new reactions", async () => {
    render(<MessageList fetchMessages={10} enableReactions reactionsPicker={<Picker />} />);

    const triggers = await screen.findAllByTitle("Add a reaction");
    await userEvent.click(triggers[0]);
    await userEvent.click(screen.getByText("😄"));

    expect(await screen.findByText("😄 1")).toBeVisible();
  });

  test("adds to existing reactions", async () => {
    render(<MessageList fetchMessages={10} enableReactions />);
    await userEvent.click(await screen.findByText("🙂 1"));

    expect(await screen.findByText("🙂 2")).toBeVisible();
    expect(screen.queryByText("🙂 1")).not.toBeInTheDocument();
  });

  test("removes from existing reactions", async () => {
    render(<MessageList fetchMessages={10} enableReactions />);
    await userEvent.click(await screen.findByText("🙂 1"));
    await userEvent.click(await screen.findByText("🙂 2"));

    expect(await screen.findByText("🙂 1")).toBeVisible();
    expect(screen.queryByText("🙂 2")).not.toBeInTheDocument();
  });

  /** Message modifications/removals */

  test("renders message text edits", async () => {
    const message = {
      message: { id: "id-1", type: "text", text: "Original text" },
      timetoken: "16165851271766362",
      actions: {
        updated: {
          "Modified text": [{ actionTimetoken: "16165851271766365", uuid: "any" }],
        },
      },
    };

    render(<MessageList welcomeMessages={message} />);

    expect(await screen.findByText("Modified text")).toBeVisible();
    expect(screen.queryByText("Original text")).not.toBeInTheDocument();
  });

  test("renders message text edits", async () => {
    const message = {
      message: { id: "id-1", type: "text", text: "Original text" },
      timetoken: "16165851271766362",
      actions: {
        deleted: {
          ".": [{ actionTimetoken: "16165851271766365", uuid: "any" }],
        },
      },
    };

    render(<MessageList welcomeMessages={message} />);

    expect(screen.queryByText("Original text")).not.toBeInTheDocument();
  });
});
