import React from "react";
import { Text } from "react-native";

import { MessageInput } from "../src/message-input/message-input";
import { render, screen, fireEvent } from "../mock/custom-renderer";
import users from "../../../data/users/users.json";

describe("Message Input", () => {
  jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

  /** Basic renderers and properties */

  test("renders with default options", () => {
    render(<MessageInput />);

    expect(screen.getByTestId("message-input")).not.toBeNull();
    expect(screen.getByTestId("message-input")).toBeEnabled();
    expect(screen.getByTestId("message-input-send")).not.toBeNull();
  });

  test("accepts and renders input", () => {
    render(<MessageInput />);

    fireEvent.changeText(screen.getByTestId("message-input"), "Hello World");
    expect(screen.getByTestId("message-input").props.value).toBe("Hello World");
  });

  test("calls a callback on value change", () => {
    const handleChange = jest.fn();
    render(<MessageInput onChange={handleChange} />);

    fireEvent.changeText(screen.getByTestId("message-input"), "Changed Value");

    expect(handleChange).toHaveBeenCalledWith("Changed Value");
  });

  test("renders custom placeholders", () => {
    render(<MessageInput placeholder="Placeholder" />);

    expect(screen.getByTestId("message-input").props.placeholder).toBe("Placeholder");
  });

  test("accepts an initial value", () => {
    render(<MessageInput draftMessage="Initial Value" />);

    expect(screen.getByTestId("message-input").props.value).toBe("Initial Value");
  });

  test("renders with custom send button", () => {
    render(<MessageInput sendButton="OK" />);

    expect(screen.getByTestId("message-input-send")).toHaveTextContent("OK");
  });

  test("renders extra actions", () => {
    render(<MessageInput extraActionsRenderer={() => <Text>Custom Action</Text>} />);

    expect(screen.getByText("Custom Action")).not.toBeNull();
  });

  /** Sending messages */

  test("sends the message on send button click", async () => {
    render(<MessageInput draftMessage="Initial Value" />);

    fireEvent.press(screen.getByTestId("message-input-send"));

    expect(await screen.findByDisplayValue("")).not.toBeNull();
  });

  test("nothing happens on trying to send empty message", () => {
    render(<MessageInput />);

    fireEvent.press(screen.getByTestId("message-input-send"));

    expect(screen.getByDisplayValue("")).not.toBeNull();
  });

  test("calls a callback on sending message", async () => {
    const handleSend = jest.fn();
    render(<MessageInput draftMessage="Initial Value" onSend={handleSend} />);

    fireEvent.press(screen.getByTestId("message-input-send"));

    expect(await screen.findByDisplayValue("")).not.toBeNull();
    expect(handleSend).toHaveBeenCalledTimes(1);
  });

  test("sends messages in a correct format", async () => {
    const handleSend = jest.fn();
    render(<MessageInput draftMessage="Initial Value" onSend={handleSend} />);

    fireEvent.press(screen.getByTestId("message-input-send"));

    expect(await screen.findByDisplayValue("")).not.toBeNull();
    expect(handleSend).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
        type: "default",
        text: "Initial Value",
      })
    );
  });

  test("attaches sender info in messages", async () => {
    const handleSend = jest.fn();
    render(<MessageInput draftMessage="Initial Value" onSend={handleSend} senderInfo />, {
      providerProps: {
        currentChannel: "test-general",
        users,
      },
    });

    fireEvent.press(screen.getByTestId("message-input-send"));

    expect(await screen.findByDisplayValue("")).not.toBeNull();
    expect(handleSend).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: users.find((u) => u.id == "user_63ea15931d8541a3bd35e5b1f09087dc"),
      })
    );
  });
});
