import React from "react";

import { MessageInput } from "../src/message-input/message-input";
import { render, fireEvent, act } from "./helpers/custom-renderer";

test("renders with default options", () => {
  const { getByText, queryByText, getByPlaceholderText } = render(<MessageInput />);

  expect(getByText("Send")).toBeInTheDocument();
  expect(getByPlaceholderText("Type Message")).toBeInTheDocument();
  expect(queryByText("☺")).not.toBeInTheDocument();
});

test("accepts and renders input", () => {
  const { getByPlaceholderText, getByDisplayValue } = render(<MessageInput />);

  fireEvent.change(getByPlaceholderText("Type Message"), { target: { value: "Changed Value" } });
  expect(getByDisplayValue("Changed Value")).toBeInTheDocument();
});

test("renders custom placeholders", () => {
  const { getByPlaceholderText } = render(<MessageInput placeholder="Placeholder" />);

  expect(getByPlaceholderText("Placeholder")).toBeInTheDocument();
});

test("accepts an initial value", () => {
  const { getByDisplayValue } = render(<MessageInput draftMessage="Initial Value" />);

  expect(getByDisplayValue("Initial Value")).toBeInTheDocument();
});

test("renders without a send button", () => {
  const { queryByText } = render(<MessageInput hideSendButton />);

  expect(queryByText("Send")).not.toBeInTheDocument();
});

test("renders with custom send button", () => {
  const { getByText } = render(<MessageInput sendButton="OK" />);

  expect(getByText("OK")).toBeInTheDocument();
});

test("sends the message on send button click", async () => {
  const { getByText, findByDisplayValue } = render(<MessageInput draftMessage="Initial Value" />);

  act(() => {
    fireEvent.click(getByText("Send"));
  });
  expect(await findByDisplayValue("Initial Value")).not.toBeInTheDocument();
});

// senderInfo?: boolean;
// typingIndicator?: boolean;
// emojiPicker?: boolean;
// onChange?: (value: string) => unknown;
// onSend?: (value: unknown) => unknown;
