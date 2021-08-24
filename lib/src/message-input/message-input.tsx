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
import { EmojiPickerElementProps } from "../types";
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

export interface MessageInputProps {
  /** Set a placeholder message display in the text window. */
  placeholder?: string;
  /** Set a draft message to display in the text window. */
  draftMessage?: string;
  /** Enable this for high-throughput environemnts to attach sender data directly to each message.
   * This is an alternative to providing a full list of users directly into Chat provider. */
  senderInfo?: boolean;
  /** Enable/disable firing the typing events when user is typing a message. */
  typingIndicator?: boolean;
  /** Enable/disable internal file upload capabilty */
  fileUpload?: "image" | "all";
  /** Disable the input from composing and sending messages */
  disabled?: boolean;
  /** Hides the Send button */
  hideSendButton?: boolean;
  /** Custom UI component to override default display for the send button. */
  sendButton?: JSX.Element | string;
  /** Pass in an emoji picker if you want it to be rendered in the input. See Emoji Pickers section of the docs to get more details */
  emojiPicker?: ReactElement<EmojiPickerElementProps>;
  /** Callback to handle event when the text value changes. */
  onChange?: (value: string) => unknown;
  /** Callback for extra actions while sending a message */
  onSend?: (value: unknown) => unknown;
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

  const [users] = useAtom(UsersMetaAtom);
  const [theme] = useAtom(ThemeAtom);
  const [channel] = useAtom(CurrentChannelAtom);
  const [onErrorObj] = useAtom(ErrorFunctionAtom);
  const onError = onErrorObj.function;
  const [typingIndicatorTimeout] = useAtom(TypingIndicatorTimeoutAtom);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

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

  /*
  /* Commands
  */

  const sendMessage = async () => {
    try {
      if (!file && !text) return;

      if (file) {
        await pubnub.sendFile({ channel, file });
        props.onSend && props.onSend(file);
      } else if (text) {
        const message = {
          type: "text",
          text,
          ...(props.senderInfo && { sender: users.find((u) => u.id === pubnub.getUUID()) }),
        };
        await pubnub.publish({ channel, message });
        props.onSend && props.onSend(message);
      }

      if (props.typingIndicator) stopTypingIndicator();
      setFile(null);
      setText("");
    } catch (e) {
      onError(e);
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

  /*
  /* Event handlers
  */

  const handleEmojiInsertion = (emoji: { native: string }) => {
    try {
      if (!("native" in emoji)) return;
      setText(text + emoji.native);
      setEmojiPickerShown(false);
    } catch (e) {
      onError(e);
    }
  };

  const handleClosePicker = (event: MouseEvent) => {
    try {
      setEmojiPickerShown((pickerShown) => {
        if (!pickerShown || pickerRef.current?.contains(event.target as Node)) return pickerShown;
        return false;
      });
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

  const handleFileClear = () => {
    setFile(null);
    setText("");
    fileRef.current.value = null;
  };

  /*
  /* Lifecycle
  */

  useEffect(() => {
    document.addEventListener("mousedown", handleClosePicker);

    return () => {
      document.removeEventListener("mousedown", handleClosePicker);
    };
  }, []);

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
        {file ? (
          <div className="pn-msg-input__icon" title="Remove the file" onClick={handleFileClear}>
            <XCircleIcon />
          </div>
        ) : null}
        <div className="pn-msg-input__icon">
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
      </>
    );
  };

  const renderEmojiPicker = () => {
    return (
      <>
        <div
          className="pn-msg-input__icon"
          onClick={() => setEmojiPickerShown(true)}
          title="Add an emoji"
        >
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
        <div className="pn-msg-input__spacer">
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
        </div>

        {!props.disabled && props.fileUpload && renderFileUpload()}

        {!props.disabled && props.emojiPicker && renderEmojiPicker()}

        {!props.hideSendButton && (
          <button
            className="pn-msg-input__send"
            disabled={props.disabled}
            onClick={() => sendMessage()}
          >
            {props.sendButton}
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
  placeholder: "Type Message",
  sendButton: "Send",
  senderInfo: false,
  typingIndicator: false,
};
