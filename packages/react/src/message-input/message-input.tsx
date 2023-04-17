import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CommonMessageInputProps, useMessageInputCore } from "@pubnub/common-chat-components";
import { EmojiPickerElementProps } from "../types";
import { useOuterClick, useResizeObserver } from "../helpers";
import EmojiIcon from "../icons/emoji.svg";
import SpinnerIcon from "../icons/spinner.svg";
import AirplaneIcon from "../icons/airplane.svg";
import FileIcon from "../icons/file.svg";
import XCircleIcon from "../icons/x-circle.svg";
import ImageIcon from "../icons/image.svg";
import "./message-input.scss";

export type MessageInputProps = CommonMessageInputProps & {
  /** Option to hide the Send button. */
  hideSendButton?: boolean;
  /** Option to pass in an emoji picker if you want it to be rendered in the input. For more details, refer to the Emoji Pickers section in the docs. */
  emojiPicker?: ReactElement<EmojiPickerElementProps>;
  /** Callback to handle an event when the text value changes. */
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  /** Callback to handle an event when the key is pressed in textarea. */
  onKeyPress?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
};

/**
 * Allows users to compose messages using text and emojis
 * and automatically publish them on PubNub channels upon sending.
 */
export const MessageInput: FC<MessageInputProps> = (props: MessageInputProps) => {
  const {
    clearInput,
    file,
    setFile,
    isValidInputText,
    loader,
    onError,
    sendMessage,
    setText,
    text,
    theme,
    startTypingIndicator,
    stopTypingIndicator,
  } = useMessageInputCore(props);

  const [emojiPickerShown, setEmojiPickerShown] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const resizeTextAreaEntry = useResizeObserver(inputRef);
  const textAreaWidth = resizeTextAreaEntry?.contentRect.width;
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

  /*
  /* Event handlers
  */

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const { value: newText } = event.target;
      if (props.typingIndicator) {
        newText.length ? startTypingIndicator() : stopTypingIndicator();
      }
      props.onChange && props.onChange(event);
      setText(newText);
    } catch (e) {
      onError(e);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    try {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
        if (fileRef.current) fileRef.current.value = "";
      }
      props.onKeyPress && props.onKeyPress(event);
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

  const handleSendClick = () => {
    sendMessage();
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEmojiInsertion = useCallback(
    (emoji: { native: string }) => {
      try {
        if (!("native" in emoji)) return;
        setText((text) => text + emoji.native);
        setEmojiPickerShown(false);
      } catch (e) {
        onError(e);
      }
    },
    [onError, setText]
  );

  const handleRemoveFile = () => {
    autoSize();
    clearInput();
    if (fileRef.current) fileRef.current.value = "";
  };

  useEffect(() => {
    autoSize();
  }, [file, textAreaWidth, text]);

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
          <div title="Remove the file" onClick={handleRemoveFile}>
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
            {React.cloneElement(props.emojiPicker, { onEmojiSelect: handleEmojiInsertion })}
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
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={props.placeholder}
          ref={inputRef}
          rows={1}
          value={text}
        />

        {!props.hideSendButton && !props.disabled && (
          <button
            className={`pn-msg-input__send ${isValidInputText() && "pn-msg-input__send--active"}`}
            disabled={loader || props.disabled}
            onClick={handleSendClick}
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
