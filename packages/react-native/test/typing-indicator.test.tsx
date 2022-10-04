import React from "react";

import { MessageInput } from "../src/message-input/message-input";
import { TypingIndicator } from "../src/typing-indicator/typing-indicator";
import { render, waitFor, screen, fireEvent, act } from "../mock/custom-renderer";

describe("Typing Indicator", () => {
  jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

  test("shows up when typing and then disappears when clearing the input", async () => {
    render(
      <>
        <MessageInput typingIndicator />
        <TypingIndicator />
      </>,
      {
        pubnubProps: {
          returnedUuid: "another-random-uuid",
        },
      }
    );

    fireEvent.changeText(screen.getByTestId("message-input"), "Changed Value");
    expect(await screen.findByText("Unknown User is typing...")).not.toBeNull();

    fireEvent.changeText(screen.getByTestId("message-input"), "");
    expect(screen.queryByText("Unknown User is typing...")).toBeNull();
  });

  test("shows up when typing and then disappears when sending the message", async () => {
    render(
      <>
        <MessageInput typingIndicator />
        <TypingIndicator />
      </>,
      {
        pubnubProps: {
          returnedUuid: "another-random-uuid",
        },
      }
    );

    fireEvent.changeText(screen.getByTestId("message-input"), "Changed Value");
    expect(await screen.findByText("Unknown User is typing...")).not.toBeNull();

    fireEvent.press(screen.getByTestId("message-input-send"));
    await waitFor(() => expect(screen.queryByText("Unknown User is typing...")).toBeNull());
  });
});
