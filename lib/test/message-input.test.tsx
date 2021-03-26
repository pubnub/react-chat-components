import React from "react";

import { MessageInput } from "../src/message-input/message-input";
import { render, fireEvent, screen } from "../mock/custom-renderer";
import users from "../../data/users.json";

describe("Message Input", () => {
  /** Basic renderers and properties */

  test("renders with default options", () => {
    render(<MessageInput />);

    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type Message")).toBeInTheDocument();
    expect(screen.queryByText("☺")).not.toBeInTheDocument();
  });

  test("accepts and renders input", () => {
    render(<MessageInput />);

    fireEvent.change(screen.getByPlaceholderText("Type Message"), {
      target: { value: "Changed Value" },
    });
    expect(screen.getByDisplayValue("Changed Value")).toBeInTheDocument();
  });

  test("calls a callback on value change", () => {
    const handleChange = jest.fn();
    render(<MessageInput onChange={handleChange} />);

    fireEvent.change(screen.getByPlaceholderText("Type Message"), {
      target: { value: "Changed Value" },
    });
    expect(handleChange).toHaveBeenCalledWith("Changed Value");
  });

  test("renders custom placeholders", () => {
    render(<MessageInput placeholder="Placeholder" />);

    expect(screen.getByPlaceholderText("Placeholder")).toBeInTheDocument();
  });

  test("accepts an initial value", () => {
    render(<MessageInput draftMessage="Initial Value" />);

    expect(screen.getByDisplayValue("Initial Value")).toBeInTheDocument();
  });

  test("renders without a send button", () => {
    render(<MessageInput hideSendButton />);

    expect(screen.queryByText("Send")).not.toBeInTheDocument();
  });

  test("renders with custom send button", () => {
    render(<MessageInput sendButton="OK" />);

    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  /** Sending messages */

  test("sends the message on send button click", async () => {
    render(<MessageInput draftMessage="Initial Value" />);

    fireEvent.click(screen.getByText("Send"));
    expect(await screen.findByDisplayValue("")).toBeInTheDocument();
  });

  test("sends the message on enter", async () => {
    render(<MessageInput draftMessage="Initial Value" />);

    fireEvent.keyPress(screen.getByDisplayValue("Initial Value"), { key: "Enter", charCode: 13 });
    expect(await screen.findByDisplayValue("")).toBeInTheDocument();
  });

  test("nothing happens on trying to send empty message", () => {
    render(<MessageInput />);

    fireEvent.click(screen.getByText("Send"));
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });

  test("calls a callback on sending message", async () => {
    const handleSend = jest.fn();
    render(<MessageInput draftMessage="Initial Value" onSend={handleSend} />);

    fireEvent.click(screen.getByText("Send"));
    expect(await screen.findByDisplayValue("")).toBeInTheDocument();
    expect(handleSend).toHaveBeenCalledTimes(1);
  });

  test("sends messages in a correct format", async () => {
    const handleSend = jest.fn();
    render(<MessageInput draftMessage="Initial Value" onSend={handleSend} />);

    fireEvent.click(screen.getByText("Send"));
    expect(await screen.findByDisplayValue("")).toBeInTheDocument();
    expect(handleSend).toHaveBeenCalledWith({ type: "text", text: "Initial Value" });
  });

  test("attaches sender info in messages", async () => {
    const handleSend = jest.fn();
    render(<MessageInput draftMessage="Initial Value" onSend={handleSend} senderInfo />, {
      providerProps: {
        channel: "test-general",
        userList: users,
      },
    });

    fireEvent.click(screen.getByText("Send"));
    expect(await screen.findByDisplayValue("")).toBeInTheDocument();
    expect(handleSend).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: users.find((u) => u.id == "user_63ea15931d8541a3bd35e5b1f09087dc"),
      })
    );
  });

  /** Emoji picker */

  test("renders emoji picker button", () => {
    render(<MessageInput emojiPicker />);

    expect(screen.getByText("☺")).toBeInTheDocument();
  });

  test("opens emoji picker on button click", () => {
    render(<MessageInput emojiPicker />);

    fireEvent.click(screen.getByText("☺"));
    expect(screen.getByText("Frequently Used")).toBeInTheDocument();
  });

  test("closes emoji picker when clicking outside", () => {
    render(<MessageInput emojiPicker />);

    fireEvent.click(screen.getByText("☺"));
    fireEvent.click(screen.getByPlaceholderText("Type Message"));
    expect(screen.queryByText("Frequently Used")).not.toBeInTheDocument();
  });

  test("emoji picker inserts emojis into the input", async () => {
    render(<MessageInput emojiPicker />);

    fireEvent.click(screen.getByText("☺"));
    fireEvent.click(screen.getByText("🙂"));
    expect(screen.getByDisplayValue("🙂")).toBeInTheDocument();
    expect(screen.queryByText("Frequently Used")).not.toBeInTheDocument();
  });
});
