import React from "react";
import { MessageInput } from "../src/message-input/message-input";
import { TypingIndicator } from "../src/typing-indicator/typing-indicator";
import { render, waitFor, screen } from "../mock/custom-renderer";
import userEvent from "@testing-library/user-event";

describe("Typing Indicator", () => {
  test("shows up when typing and then disappears when clearing the input", async () => {
    render(
      <div>
        <MessageInput typingIndicator />
        <TypingIndicator />
      </div>,
      {
        pubnubProps: {
          returnedUuid: "another-random-uuid",
        },
      }
    );

    await userEvent.type(screen.getByPlaceholderText("Send message"), "Changed Value");
    const indicator = await screen.findByText("Unknown User is typing...");
    expect(indicator).toBeVisible();

    await userEvent.clear(screen.getByPlaceholderText("Send message"));
    await waitFor(() => expect(indicator).not.toBeVisible());
  });

  test("shows up when typing and then disappears when sending the message", async () => {
    render(
      <div>
        <MessageInput typingIndicator />
        <TypingIndicator />
      </div>,
      {
        pubnubProps: {
          returnedUuid: "another-random-uuid",
        },
      }
    );

    await userEvent.type(screen.getByPlaceholderText("Send message"), "Changed Value");
    const indicator = await screen.findByText("Unknown User is typing...");
    expect(indicator).toBeVisible();

    await userEvent.click(screen.getByTitle("Send"));
    await waitFor(() => expect(indicator).not.toBeVisible);
  });
});
