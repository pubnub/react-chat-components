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

export interface MessageInputProps {
  /** Set a placeholder message display in the text window. */
  placeholder?: string;
  /** Set a draft message to display in the text window. */
  draftMessage?: string;
  /** Disable the input. */
  disabled?: boolean;
  /** Enable this for high-throughput environments to attach sender data directly to each message.
   * This is an alternative to providing a full list of users directly into Chat provider. */
  senderInfo?: boolean;
  /** Enable/disable firing the typing events when user is typing a message. */
  typingIndicator?: boolean;
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
  /** Components for additional message input actions */
  additionalActions?: JSX.Element[];
}

export interface TextFieldProps {
  /** The theme for the field */
  theme: string;
  /** Set a placeholder message display in the text window. */
  placeholder?: string;
  /** Current value of the field. */
  text: string;
  /** Disable the input. */
  disabled?: boolean;
  /** Hides the Send button */
  hideSendButton?: boolean;
  /** Custom UI component to override default display for the send button. */
  sendButton?: JSX.Element | string;
  /** Pass in an emoji picker if you want it to be rendered in the input. See Emoji Pickers section of the docs to get more details */
  emojiPicker?: ReactElement<EmojiPickerElementProps>;
  /** Callback to handle event when the text value changes. */
  onChange?: (value: string) => unknown;
  /** Callback for when the text is submitted */
  onSubmit: (value: unknown) => unknown;
  /** Callback for when errors occur */
  onError?: (value: unknown) => unknown;
  /** Components for additional message input actions */
  additionalActions?: JSX.Element[];
}

/**
 * Allows users to edit text and use emojis.
 */
export const TextField: FC<TextFieldProps> = (props: TextFieldProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [emojiPickerShown, setEmojiPickerShown] = useState(false);
  const [picker, setPicker] = useState<ReactElement>();

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

  const onSubmit = (text: string) => {
    props.onSubmit(text);
    props.onChange("");
  };

  const handleEmojiInsertion = (emoji: { native: string }) => {
    try {
      if (!("native" in emoji)) return;
      // insert emoji at cursor position
      const cursor = inputRef.current.selectionEnd;
      const newText = props.text.slice(0, cursor) + emoji.native + props.text.slice(cursor);
      props.onChange && props.onChange(newText);
      setEmojiPickerShown(false);
    } catch (e) {
      props.onError(e);
    }
  };

  const handleClosePicker = (event: MouseEvent) => {
    try {
      setEmojiPickerShown((pickerShown) => {
        if (!pickerShown || pickerRef.current?.contains(event.target as Node)) return pickerShown;
        return false;
      });
    } catch (e) {
      props.onError(e);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    try {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onSubmit(props.text);
      }
    } catch (e) {
      props.onError(e);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const textArea = event.target as HTMLTextAreaElement;
      const newText = textArea.value;

      props.onChange && props.onChange(newText);
      autoSize();
    } catch (e) {
      props.onError(e);
    }
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
      setPicker(
        React.cloneElement(props.emojiPicker, {
          onSelect: handleEmojiInsertion,
          theme: props.theme.includes("dark") ? "dark" : "light",
        })
      );
    }
  }, [props.emojiPicker]);

  /*
  /* Renderers
  */

  const renderEmojiPicker = () => {
    return (
      <>
        <div className="pn-msg-input__icon" onClick={() => setEmojiPickerShown(true)}>
          ☺
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
    <div className={`pn-msg-input pn-msg-input--${props.theme} ${props.disabled && "disabled"}`}>
      <div className="pn-msg-input__wrapper">
        <div className="pn-msg-input__spacer">
          <textarea
            className="pn-msg-input__textarea"
            placeholder={props.placeholder}
            rows={1}
            value={props.text}
            onChange={(e) => handleInputChange(e)}
            onKeyPress={(e) => handleKeyPress(e)}
            ref={inputRef}
            readOnly={props.disabled}
            disabled={props.disabled}
          />
        </div>

        {props.additionalActions.map((action, index) => (
          <div className="pn-msg-input__action" key={`input-action_${index}`}>
            {action}
          </div>
        ))}

        {props.emojiPicker && renderEmojiPicker()}

        {!props.hideSendButton && (
          <button className="pn-msg-input__send" onClick={() => onSubmit(props.text)}>
            {props.sendButton}
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Allows users to compose messages using text and emojis
 * and automatically publish them on PubNub channels upon sending.
 */
export const MessageInput: FC<MessageInputProps> = (props: MessageInputProps) => {
  const pubnub = usePubNub();

  const [typingIndicatorSent, setTypingIndicatorSent] = useState(false);
  const [text, setText] = useState(props.draftMessage || "");

  const [users] = useAtom(UsersMetaAtom);
  const [theme] = useAtom(ThemeAtom);
  const [channel] = useAtom(CurrentChannelAtom);
  const [onErrorObj] = useAtom(ErrorFunctionAtom);
  const onError = onErrorObj.function;
  const [typingIndicatorTimeout] = useAtom(TypingIndicatorTimeoutAtom);

  /*
  /* Commands
  */

  const sendMessage = async (text) => {
    try {
      if (!text) return;
      const message = {
        type: "text",
        text,
        ...(props.senderInfo && { sender: users.find((u) => u.id === pubnub.getUUID()) }),
      };

      await pubnub.publish({ channel, message });
      props.onSend && props.onSend(message);
      if (props.typingIndicator) stopTypingIndicator();
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
  /* Listeners
  */
  const onChange = (newText) => {
    setText(newText);
    if (props.typingIndicator && newText.length) startTypingIndicator();
    if (props.typingIndicator && !newText.length) stopTypingIndicator();
  };

  /*
  /* Lifecycle
  */
  useEffect(() => {
    let timer = null;

    if (typingIndicatorSent) {
      timer = setTimeout(() => {
        setTypingIndicatorSent(false);
      }, (typingIndicatorTimeout - 1) * 1000);
    }

    return () => clearTimeout(timer);
  }, [typingIndicatorSent]);

  return (
    <TextField
      theme={theme}
      text={text}
      onChange={onChange}
      onSubmit={sendMessage}
      onError={onError}
      disabled={props.disabled}
      emojiPicker={props.emojiPicker}
      sendButton={props.sendButton}
      hideSendButton={props.hideSendButton}
      placeholder={props.placeholder}
      additionalActions={props.additionalActions}
    />
  );
};

MessageInput.defaultProps = {
  hideSendButton: false,
  placeholder: "Type Message",
  sendButton: "Send",
  senderInfo: false,
  typingIndicator: false,
  additionalActions: [],
};

TextField.defaultProps = {
  hideSendButton: false,
  placeholder: "Type Message",
  sendButton: "Send",
  additionalActions: [],
  onError: () => {},
};
