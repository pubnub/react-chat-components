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
      </div>
    );

    userEvent.type(screen.getByPlaceholderText("Type Message"), "Changed Value");
    const indicator = await screen.findByText("Unknown User is typing...");
    expect(indicator).toBeVisible();

    userEvent.clear(screen.getByPlaceholderText("Type Message"));
    await waitFor(() => expect(indicator).not.toHaveTextContent("Unknown User is typing..."));
  });

  test("shows up when typing and then disappears when sending the message", async () => {
    render(
      <div>
        <MessageInput typingIndicator />
        <TypingIndicator />
      </div>
    );

    userEvent.type(screen.getByPlaceholderText("Type Message"), "Changed Value");
    const indicator = await screen.findByText("Unknown User is typing...");
    expect(indicator).toBeVisible();

    userEvent.click(screen.getByText("Send"));
    await waitFor(() => expect(indicator).not.toHaveTextContent("Unknown User is typing..."));
  });
});
