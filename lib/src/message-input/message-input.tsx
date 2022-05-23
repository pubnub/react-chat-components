import React, {
  FC,
  KeyboardEvent,
  ChangeEvent,
  useState,
  useRef,
  useEffect,
  ReactElement,
} from "react";
import { useAtom } from "jotai";
import { usePubNub } from "pubnub-react";
import { v4 as uuidv4 } from "uuid";
import { MessagePayload, EmojiPickerElementProps } from "../types";
import { useOuterClick } from "../helpers";
import {
  CurrentChannelAtom,
  ThemeAtom,
  TypingIndicatorTimeoutAtom,
  UsersMetaAtom,
  ErrorFunctionAtom,
} from "../state-atoms";
import "./message-input.scss";
import EmojiIcon from "../icons/emoji.svg";
import FileIcon from "../icons/file.svg";
import ImageIcon from "../icons/image.svg";
import XCircleIcon from "../icons/x-circle.svg";
import SpinnerIcon from "../icons/spinner.svg";
import AirplaneIcon from "../icons/airplane.svg";

export interface MessageInputProps {
  /** Option to set a placeholder message to display in the text window. */
  placeholder?: string;
  /** Option to set a draft message to display in the text window. */
  draftMessage?: string;
  /** Option to attach sender data directly to each message. Enable it for high-throughput environments.
   * This is an alternative to providing a full list of users directly into the Chat provider. */
  senderInfo?: boolean;
  /** Option to enable/disable firing the typing events when a user is typing a message. */
  typingIndicator?: boolean;
  /** Option to enable/disable the internal file upload capability. */
  fileUpload?: "image" | "all";
  /** Option to disable the input from composing and sending messages. */
  disabled?: boolean;
  /** Option to hide the Send button. */
  hideSendButton?: boolean;
  /** Custom UI component to override default display for the Send button. */
  sendButton?: JSX.Element | string;
  /** Option to pass in an emoji picker if you want it to be rendered in the input. For more details, refer to the Emoji Pickers section in the docs. */
  emojiPicker?: ReactElement<EmojiPickerElementProps>;
  /** Callback to handle an event when the text value changes. */
  onChange?: (value: string) => void;
  /** Callback to modify message content before sending it. This only works for text messages, not files. */
  onBeforeSend?: (value: MessagePayload) => MessagePayload;
  /** Callback for extra actions after sending a message. */
  onSend?: (value: MessagePayload | File) => void;
  /** Option to provide an extra actions renderer to add custom action buttons to the input. */
  extraActionsRenderer?: () => JSX.Element;
}

/**
 * Allows users to compose messages using text and emojis
 * and automatically publish them on PubNub channels upon sending.
 */
export const MessageInput: FC<MessageInputProps> = (props: MessageInputProps) => {
  const pubnub = usePubNub();

  const [text, setText] = useState(props.draftMessage || "");
  const [file, setFile] = useState<File>(null);
  const [emojiPickerShown, setEmojiPickerShown] = useState(false);
  const [typingIndicatorSent, setTypingIndicatorSent] = useState(false);
  const [picker, setPicker] = useState<ReactElement>();
  const [loader, setLoader] = useState(false);

  const [users] = useAtom(UsersMetaAtom);
  const [theme] = useAtom(ThemeAtom);
  const [channel] = useAtom(CurrentChannelAtom);
  const [onErrorObj] = useAtom(ErrorFunctionAtom);
  const onError = onErrorObj.function;
  const [typingIndicatorTimeout] = useAtom(TypingIndicatorTimeoutAtom);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pickerRef = useOuterClick(() => {
    if ((event.target as Element).closest(".pn-msg-input__emoji-toggle")) return;
    setEmojiPickerShown(false);
  });

  /*
  /* Helper functions
  */

  const autoSize = () => {
    const input = inputRef.current;
    if (!input) return;

    setTimeout(() => {
      input.style.cssText = `height: auto;`;
      input.style.cssText = `height: ${input.scrollHeight}px;`;
    }, 0);
  };

  const isValidInputText = () => {
    return !!text.trim().length;
  };

  /*
  /* Commands
  */

  const sendMessage = async () => {
    try {
      if (!file && !isValidInputText()) return;
      let message = {
        id: uuidv4(),
        text,
        ...(props.senderInfo && { sender: users.find((u) => u.id === pubnub.getUUID()) }),
        createdAt: new Date().toISOString(),
      } as MessagePayload;
      setLoader(true);

      if (file) {
        await pubnub.sendFile({ channel, file, message });
        props.onSend && props.onSend(file);
      } else if (text) {
        if (props.onBeforeSend) message = props.onBeforeSend(message) || message;
        await pubnub.publish({ channel, message });
        props.onSend && props.onSend(message);
      }

      if (props.typingIndicator) stopTypingIndicator();
      clearInput();
    } catch (e) {
      onError(e);
    } finally {
      setLoader(false);
    }
  };

  const startTypingIndicator = async () => {
    if (typingIndicatorSent) return;
    try {
      setTypingIndicatorSent(true);
      const message = { message: { type: "typing_on" }, channel };
      pubnub.signal(message);
    } catch (e) {
      onError(e);
    }
  };

  const stopTypingIndicator = async () => {
    if (!typingIndicatorSent) return;
    try {
      setTypingIndicatorSent(false);
      const message = { message: { type: "typing_off" }, channel };
      pubnub.signal(message);
    } catch (e) {
      onError(e);
    }
  };

  const clearInput = () => {
    setFile(null);
    setText("");
    autoSize();
    fileRef.current.value = null;
  };

  /*
  /* Event handlers
  */

  const handleEmojiInsertion = (emoji: { native: string }) => {
    try {
      if (!("native" in emoji)) return;
      setText((text) => text + emoji.native);
      setEmojiPickerShown(false);
    } catch (e) {
      onError(e);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    try {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    } catch (e) {
      onError(e);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const textArea = event.target as HTMLTextAreaElement;
      const newText = textArea.value;

      if (props.typingIndicator && newText.length) startTypingIndicator();
      if (props.typingIndicator && !newText.length) stopTypingIndicator();

      props.onChange && props.onChange(newText);
      autoSize();
      setText(newText);
    } catch (e) {
      onError(e);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files[0];
      setFile(file);
      setText(file.name);
    } catch (e) {
      onError(e);
    }
  };

  /*
  /* Lifecycle
  */
  useEffect(() => {
    if (React.isValidElement(props.emojiPicker)) {
      setPicker(React.cloneElement(props.emojiPicker, { onSelect: handleEmojiInsertion }));
    }
  }, [props.emojiPicker]);

  useEffect(() => {
    let timer = null;

    if (typingIndicatorSent) {
      timer = setTimeout(() => {
        setTypingIndicatorSent(false);
      }, (typingIndicatorTimeout - 1) * 1000);
    }

    return () => clearTimeout(timer);
  }, [typingIndicatorSent]);

  /*
  /* Renderers
  */

  const renderFileUpload = () => {
    return (
      <>
        <div>
          <label htmlFor="file-upload" className="pn-msg-input__fileLabel" title="Add a file">
            {props.fileUpload === "image" ? <ImageIcon /> : <FileIcon />}
          </label>
          <input
            accept={props.fileUpload === "image" ? "image/*" : "*"}
            className="pn-msg-input__fileInput"
            data-testid="file-upload"
            id="file-upload"
            onChange={handleFileChange}
            ref={fileRef}
            type="file"
          />
        </div>
        {file && (
          <div title="Remove the file" onClick={clearInput}>
            <XCircleIcon />
          </div>
        )}
      </>
    );
  };

  const renderEmojiPicker = () => {
    return (
      <>
        <div onClick={() => setEmojiPickerShown(true)} title="Add an emoji">
          <EmojiIcon />
        </div>

        {emojiPickerShown && (
          <div className="pn-msg-input__emoji-picker" ref={pickerRef}>
            {picker}
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className={`pn-msg-input pn-msg-input--${theme} ${
        props.disabled ? "pn-msg-input--disabled" : ""
      }`}
    >
      <div className="pn-msg-input__wrapper">
        <div className="pn-msg-input__icons">
          <div className="pn-msg-input__emoji-toggle">
            {!props.disabled && props.emojiPicker && renderEmojiPicker()}
          </div>
          {!props.disabled && props.fileUpload && renderFileUpload()}
          {props.extraActionsRenderer && props.extraActionsRenderer()}
        </div>

        <textarea
          className="pn-msg-input__textarea"
          data-testid="message-input"
          disabled={props.disabled || !!file}
          onChange={(e) => handleInputChange(e)}
          onKeyPress={(e) => handleKeyPress(e)}
          placeholder={props.placeholder}
          ref={inputRef}
          rows={1}
          value={text}
        />

        {!props.hideSendButton && !props.disabled && (
          <button
            className={`pn-msg-input__send ${isValidInputText() && "pn-msg-input__send--active"}`}
            disabled={loader || props.disabled}
            onClick={() => sendMessage()}
            title="Send"
          >
            {loader ? <SpinnerIcon /> : props.sendButton}
          </button>
        )}
      </div>
    </div>
  );
};

MessageInput.defaultProps = {
  disabled: false,
  fileUpload: undefined,
  hideSendButton: false,
  placeholder: "Send message",
  sendButton: <AirplaneIcon />,
  senderInfo: false,
  typingIndicator: false,
};
