import React, {
  FC,
  KeyboardEvent,
  ChangeEvent,
  useState,
  useRef,
  useEffect,
  ReactElement,
} from "react";
import { EmojiPickerElementProps } from "../types";
import "./text-field.scss";

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
  additionalActions?: {
    component: JSX.Element;
    onClick: (
      text: string,
      onChange: (value: string) => unknown,
      selection: [number, number]
    ) => void;
  }[];
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
      const text = inputRef.current.value;
      const newText = text.slice(0, cursor) + emoji.native + text.slice(cursor);
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

        {props.additionalActions ? (
          props.additionalActions.map(({ component, onClick }, index) => (
            <div
              className="pn-msg-input__action"
              onClick={() => {
                onClick(props.text, props.onChange, [
                  inputRef.current.selectionStart,
                  inputRef.current.selectionEnd,
                ]);
              }}
              key={`input-action_${index}`}
            >
              {component}
            </div>
          ))
        ) : (
          <></>
        )}

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

TextField.defaultProps = {
  hideSendButton: false,
  placeholder: "Type Message",
  sendButton: "Send",
  additionalActions: [],
  onError: () => {},
};
