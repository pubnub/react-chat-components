import React from "react";
import { MessageInput } from "../src/message-input/message-input";
import { render, screen } from "../mock/custom-renderer";
import { Picker } from "../mock/emoji-picker-mock";
import userEvent from "@testing-library/user-event";
import users from "../../../data/users/users.json";

describe("Message Input", () => {
  /** Basic renderers and properties */

  test("renders with default options", () => {
    render(<MessageInput />);

    expect(screen.getByTitle("Send")).toBeVisible();
    expect(screen.getByPlaceholderText("Send message")).toBeVisible();
    expect(screen.queryByTitle("Add an emoji")).not.toBeInTheDocument();
  });

  test("accepts and renders input", async () => {
    render(<MessageInput />);

    await userEvent.type(screen.getByPlaceholderText("Send message"), "Changed Value");

    expect(screen.getByDisplayValue("Changed Value")).toBeVisible();
  });

  test("calls a callback on value change", async () => {
    const handleChange = jest.fn();
    render(<MessageInput onChange={handleChange} />);

    await userEvent.type(screen.getByPlaceholderText("Send message"), "Changed Value");

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: "Changed Value",
        }),
      })
    );
  });

  test("renders custom placeholders", () => {
    render(<MessageInput placeholder="Placeholder" />);

    expect(screen.getByPlaceholderText("Placeholder")).toBeVisible();
  });

  test("accepts an initial value", () => {
    render(<MessageInput draftMessage="Initial Value" />);

    expect(screen.getByDisplayValue("Initial Value")).toBeVisible();
  });

  test("renders without a send button", () => {
    render(<MessageInput hideSendButton />);

    expect(screen.queryByText("Send")).not.toBeInTheDocument();
  });

  test("renders with custom send button", () => {
    render(<MessageInput sendButton="OK" />);

    expect(screen.getByText("OK")).toBeVisible();
  });

  test("renders extra actions", () => {
    render(<MessageInput extraActionsRenderer={() => <p>Custom Action</p>} />);

    expect(screen.queryByText("Custom Action")).toBeVisible();
  });

  /** Sending messages */

  test("sends the message on send button click", async () => {
    render(<MessageInput draftMessage="Initial Value" />);

    await userEvent.click(screen.getByTitle("Send"));

    expect(await screen.findByDisplayValue("")).toBeVisible();
  });

  test("sends the message on enter", async () => {
    render(<MessageInput draftMessage="Initial Value" />);

    await userEvent.type(screen.getByDisplayValue("Initial Value"), "{enter}");

    expect(await screen.findByDisplayValue("")).toBeVisible();
  });

  test("nothing happens on trying to send empty message", async () => {
    render(<MessageInput />);

    await userEvent.click(screen.getByTitle("Send"));

    expect(screen.getByDisplayValue("")).toBeVisible();
  });

  test("calls a callback on sending message", async () => {
    const handleSend = jest.fn();
    render(<MessageInput draftMessage="Initial Value" onSend={handleSend} />);

    await userEvent.click(screen.getByTitle("Send"));

    expect(await screen.findByDisplayValue("")).toBeVisible();
    expect(handleSend).toHaveBeenCalledTimes(1);
  });

  test("sends messages in a correct format", async () => {
    const handleSend = jest.fn();
    render(<MessageInput draftMessage="Initial Value" onSend={handleSend} />);

    await userEvent.click(screen.getByTitle("Send"));

    expect(await screen.findByDisplayValue("")).toBeVisible();
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

    await userEvent.click(screen.getByTitle("Send"));

    expect(await screen.findByDisplayValue("")).toBeVisible();
    expect(handleSend).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: users.find((u) => u.id == "user_63ea15931d8541a3bd35e5b1f09087dc"),
      })
    );
  });

  /** Emoji picker */
  test("renders emoji picker button", () => {
    render(<MessageInput emojiPicker={<Picker />} />);

    expect(screen.getByTitle("Add an emoji")).toBeVisible();
  });

  test("opens emoji picker on button click", async () => {
    render(<MessageInput emojiPicker={<Picker />} />);

    await userEvent.click(screen.getByTitle("Add an emoji"));

    expect(screen.getByText("Emoji Picker")).toBeVisible();
  });

  test("closes emoji picker when clicking outside", async () => {
    render(<MessageInput emojiPicker={<Picker />} />);

    await userEvent.click(screen.getByTitle("Add an emoji"));
    await userEvent.click(screen.getByPlaceholderText("Send message"));

    expect(screen.queryByText("Emoji Picker")).not.toBeInTheDocument();
  });

  test("emoji picker inserts emojis into the input", async () => {
    render(<MessageInput emojiPicker={<Picker />} />);

    await userEvent.click(screen.getByTitle("Add an emoji"));
    await userEvent.click(screen.getByText("🙂"));

    expect(screen.getByDisplayValue("🙂")).toBeVisible();
    expect(screen.queryByText("Emoji Picker")).not.toBeInTheDocument();
  });

  /** File upload */
  test("renders file upload button", () => {
    render(<MessageInput fileUpload="all" />);

    expect(screen.getByTitle("Add a file")).toBeVisible();
  });

  test("accepts a file and renders a text preview", async () => {
    render(<MessageInput fileUpload="all" />);
    const file = new File(["hello"], "hello.png", { type: "*" });
    const fileInput = screen.getByTestId("file-upload") as HTMLInputElement;
    const input = screen.getByTestId("message-input") as HTMLTextAreaElement;

    await userEvent.upload(fileInput, file);

    expect(fileInput.files[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
    expect(input).toHaveValue("");

    const filePreviewContainer = screen.getByTestId("file-preview-container") as HTMLDivElement;

    expect(filePreviewContainer.innerHTML).toBe("hello.png");
  });

  test("clears the file", async () => {
    render(<MessageInput fileUpload="all" />);
    const file = new File(["hello"], "hello.png", { type: "*" });
    const fileInput = screen.getByTestId("file-upload") as HTMLInputElement;
    const input = screen.getByTestId("message-input") as HTMLTextAreaElement;

    await userEvent.upload(fileInput, file);
    await userEvent.click(screen.getByTitle("Remove the file"));

    expect(input).toHaveValue("");
    const filePreviewContainer = screen.queryByTestId("file-preview-container") as HTMLDivElement;

    expect(filePreviewContainer).toBeNull();
  });

  test("sends the file", async () => {
    const handleSend = jest.fn();
    render(<MessageInput fileUpload="all" onSend={handleSend} />);
    const file = new File(["hello"], "hello.png", { type: "*" });
    const fileInput = screen.getByTestId("file-upload") as HTMLInputElement;

    await userEvent.upload(fileInput, file);
    await userEvent.click(screen.getByTitle("Send"));

    expect(handleSend).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "hello.png",
      })
    );
  });
});
