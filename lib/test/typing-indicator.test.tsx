import React from "react";

import { MessageInput } from "../src/message-input/message-input";
import { TypingIndicator } from "../src/typing-indicator/typing-indicator";
import { render, fireEvent, waitFor, screen } from "./helpers/custom-renderer";

describe("Typing Indicator", () => {
  test("typing indicator shows up when typing and disappears when clearing the input", async () => {
    render(
      <div>
        <MessageInput typingIndicator />
        <TypingIndicator />
      </div>
    );

    fireEvent.change(screen.getByPlaceholderText("Type Message"), {
      target: { value: "Changed Value" },
    });
    const indicator = await screen.findByText("Unknown User is typing...");
    expect(indicator).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Type Message"), { target: { value: "" } });
    await waitFor(() => expect(indicator).not.toHaveTextContent("Unknown User is typing..."));
  });

  test("typing indicator shows up when typing and disappears when sending the message", async () => {
    render(
      <div>
        <MessageInput typingIndicator />
        <TypingIndicator />
      </div>
    );

    fireEvent.change(screen.getByPlaceholderText("Type Message"), {
      target: { value: "Changed Value" },
    });
    const indicator = await screen.findByText("Unknown User is typing...");
    expect(indicator).toBeInTheDocument();

    fireEvent.click(screen.getByText("Send"));
    await waitFor(() => expect(indicator).not.toHaveTextContent("Unknown User is typing..."));
  });
});
