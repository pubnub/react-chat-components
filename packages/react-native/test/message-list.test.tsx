import React from "react";
import { Text } from "react-native";

import { MessageList } from "../src/message-list/message-list";
import { MessageInput } from "../src/message-input/message-input";
import { MessagePayload } from "@pubnub/common-chat-components";
import { render, screen, act, fireEvent } from "../mock/custom-renderer";

describe("Message List", () => {
  jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

  test("fetches and renders message history", async () => {
    render(<MessageList fetchMessages={10} />);

    expect(
      await screen.findByText("Pellentesque sed massa vitae enim iaculis tincidunt a ut magna.")
    ).not.toBeNull();
  }, 10000);

  test("renders messages with custom message renderer", async () => {
    render(
      <MessageList
        fetchMessages={10}
        messageRenderer={(props) => (
          <Text>Custom {(props.message.message as MessagePayload).text}</Text>
        )}
      />
    );

    expect(
      await screen.findByText("Custom Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    ).not.toBeNull();
  });

  test("renders messages with custom bubble renderer", async () => {
    render(
      <MessageList
        fetchMessages={10}
        bubbleRenderer={(props) => (
          <Text>Custom {(props.message.message as MessagePayload).text}</Text>
        )}
      />
    );

    expect(
      await screen.findByText("Custom Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    ).not.toBeNull();
  });

  test("renders extra actions", async () => {
    render(
      <MessageList fetchMessages={10} extraActionsRenderer={() => <Text>Extra Action</Text>} />
    );
    expect((await screen.findAllByText("Extra Action")).length).not.toBe(0);
  });

  test("renders newly sent messages", async () => {
    render(
      <>
        <MessageList />
        <MessageInput />
      </>
    );

    fireEvent.changeText(screen.getByTestId("message-input"), "New Message");
    fireEvent.press(screen.getByTestId("message-input-send"));
    expect(await screen.findByDisplayValue("")).not.toBeNull();
    expect(screen.getByText("New Message")).not.toBeNull();
  });

  test("fetches more history when scrolling to top of the list", async () => {
    render(<MessageList fetchMessages={4} />);
    expect(
      await screen.findByText("Curabitur id quam ac mauris aliquet imperdiet quis eget nisl.")
    ).not.toBeNull();
    expect(
      screen.queryByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    ).toBeNull();

    await act(async () => {
      screen.getByTestId("message-list").props.onEndReached();
    });

    expect(
      await screen.findByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
    ).not.toBeNull();
  });

  test("shows a notice on a new message when scrolled out of bottom of the list", async () => {
    render(
      <>
        <MessageList />
        <MessageInput />
      </>
    );

    const scrollEventData = {
      persist: () => null,
      nativeEvent: {
        contentOffset: { y: 500 },
        contentSize: { height: 500, width: 100 },
        layoutMeasurement: { height: 100, width: 100 },
      },
    };

    fireEvent.changeText(screen.getByTestId("message-input"), "Lorem Ipsum");
    fireEvent.press(screen.getByTestId("message-input-send"));
    expect(await screen.findByText("Lorem Ipsum")).not.toBeNull();
    expect(screen.queryByText("1 new message")).toBeNull();

    fireEvent.scroll(screen.getByTestId("message-list"), scrollEventData);
    fireEvent.changeText(screen.getByTestId("message-input"), "Dolor Sit Amet");
    fireEvent.press(screen.getByTestId("message-input-send"));
    expect(await screen.findByText("1 new message")).not.toBeNull();
  });

  // /** Message modifications/removals */

  test("renders message text edits", async () => {
    render(<MessageList fetchMessages={10} />);
    expect(
      await screen.findByText(
        "Integer sollicitudin eros nec libero vulputate, nec faucibus erat tristique."
      )
    ).not.toBeNull();
    expect(screen.queryByText("Integer eros libero, nec erat tristique.")).toBeNull();
  });

  test("renders message soft removals", async () => {
    render(<MessageList fetchMessages={10} />);
    expect(
      await screen.findByText("Pellentesque sed massa vitae enim iaculis tincidunt a ut magna.")
    ).not.toBeNull();
    expect(screen.queryByText("Duis aute irure dolor in reprehenderit.")).toBeNull();
  });
});
