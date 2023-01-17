import React from "react";
import { Animated, Text } from "react-native";

import { MessageInput } from "../src/message-input/message-input";
import { render, screen, fireEvent } from "../mock/custom-renderer";
import users from "../../../data/users/users.json";
import { EXPO_DOCUMENT_PICKER_MOCK, EXPO_IMAGE_PICKER_MOCK } from "../mock/file-mocks";

jest.mock("expo-image-picker", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../mock/file-mocks").EXPO_IMAGE_PICKER_MOCK;
});

jest.mock("expo-document-picker", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../mock/file-mocks").EXPO_DOCUMENT_PICKER_MOCK;
});

Animated.sequence = () => {
  return {
    start: () => null,
    stop: () => null,
    reset: () => null,
  };
};

describe("Message Input", () => {
  beforeEach(() => {
    EXPO_IMAGE_PICKER_MOCK.launchImageLibraryAsync.mockClear();
    EXPO_IMAGE_PICKER_MOCK.requestMediaLibraryPermissionsAsync.mockClear();
    EXPO_DOCUMENT_PICKER_MOCK.getDocumentAsync.mockClear();
  });

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

  test("renders photo upload icon", async () => {
    render(<MessageInput draftMessage="Initial Value" fileUpload="image" />, {
      providerProps: {
        currentChannel: "test-general",
        users,
      },
    });

    expect(await screen.queryByTestId("message-input-photo-icon-container")).not.toBeNull();
    expect(await screen.queryByTestId("message-input-file-icon-container")).toBeNull();
  });

  test("renders file upload icon", async () => {
    render(<MessageInput draftMessage="Initial Value" fileUpload="all" />, {
      providerProps: {
        currentChannel: "test-general",
        users,
      },
    });

    expect(await screen.queryByTestId("message-input-file-icon-container")).not.toBeNull();
    expect(await screen.queryByTestId("message-input-photo-file-container")).toBeNull();
  });

  test("picks a photo and sends it", async () => {
    const handleSend = jest.fn();
    render(<MessageInput draftMessage="Initial Value" fileUpload="image" onSend={handleSend} />, {
      providerProps: {
        currentChannel: "test-general",
        users,
      },
    });

    await fireEvent.press(await screen.findByTestId("message-input-photo-icon-container"));

    expect(EXPO_IMAGE_PICKER_MOCK.launchImageLibraryAsync).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByTestId("message-input-send"));
    expect(await screen.findByDisplayValue("")).not.toBeNull();

    expect(handleSend).toHaveBeenCalledWith({
      name: "fileName",
      uri: "some_uri",
      mimeType: "image/*",
    });
  });

  test("picks a file and sends it", async () => {
    const handleSend = jest.fn();
    render(<MessageInput draftMessage="Initial Value" fileUpload="all" onSend={handleSend} />, {
      providerProps: {
        currentChannel: "test-general",
        users,
      },
    });

    await fireEvent.press(await screen.findByTestId("message-input-file-icon-container"));

    expect(await screen.findByTestId("message-input-file-modal-container")).not.toBeNull();

    await fireEvent.press(await screen.findByTestId("message-input-pick-document-option"));

    expect(EXPO_DOCUMENT_PICKER_MOCK.getDocumentAsync).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByTestId("message-input-send"));
    expect(await screen.findByDisplayValue("")).not.toBeNull();

    expect(handleSend).toHaveBeenCalledWith({
      name: "some_name",
      uri: "some_uri",
      mimeType: "some_mime_type",
    });
  });
});
