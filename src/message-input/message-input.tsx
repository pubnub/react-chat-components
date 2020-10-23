import React from "react";
import { PubNubContext } from "../pubnub-provider/pubnub-provider";
import "./message-input.scss";
import EmojiIcon from "./emoji.svg";
import "emoji-mart/css/emoji-mart.css";
import { Picker, EmojiData, PickerProps } from "emoji-mart";

export interface MessageInputProps {
  /* Select one of predefined themes */
  theme?: "light" | "dark";
  /* Set the input placeholder */
  placeholder: string;
  /* Set the initial value for the input */
  iniitialValue?: string;
  /* Show the Send button */
  hideSendButton?: boolean;
  /* Send button children */
  sendButtonContent: JSX.Element | string;
  /* Disable the built-in emoji picker */
  disableEmojiPicker?: boolean;
  /* Pass options to emoji-mart picker */
  emojiMartOptions: PickerProps;
  /* Callback to handle value changes */
  onChange?: (value: string) => any;
  /* Callback for extra actions while sending the message */
  onSend?: (value: any) => any; //TODO: figure out the message format customization
}

interface MessageInputState {
  text: string;
  emojiPickerShown: boolean;
}

export class MessageInput extends React.Component<MessageInputProps, MessageInputState> {
  private inputRef: React.RefObject<HTMLTextAreaElement>;
  private pickerRef: React.RefObject<HTMLDivElement>;

  static contextType = PubNubContext;
  // This is needed to have context correctly typed
  // https://github.com/facebook/create-react-app/issues/8918
  context!: React.ContextType<typeof PubNubContext>;

  static defaultProps = {
    theme: "light",
    emojiMartOptions: { emoji: "", title: "", native: true },
    initialValue: "",
    placeholder: "Type Message",
    sendButtonContent: "→",
  };

  constructor(props: MessageInputProps) {
    super(props);
    this.state = {
      text: this.props.iniitialValue || "",
      emojiPickerShown: false,
    };
    this.inputRef = React.createRef();
    this.pickerRef = React.createRef();
    this.handleClosePicker = this.handleClosePicker.bind(this);
  }

  /*
  /* Helper functions
  */

  autoSize() {
    const input = this.inputRef.current;
    if (!input) return;

    setTimeout(() => {
      input.style.cssText = `height: auto;`;
      input.style.cssText = `height: ${input.scrollHeight}px;`;
    }, 0);
  }

  /*
  /* Commands
  */

  async sendMessage() {
    try {
      if (!this.state.text) return;
      const message = { type: "text", text: this.state.text };

      await this.context.pubnub.publish({
        channel: this.context.channel,
        message,
      });
      this.props.onSend && this.props.onSend(message);
      this.setState({ text: "" });
    } catch (e) {
      console.error(e);
    }
  }

  /*
  /* Event handlers
  */

  handleEmojiInsertion(emoji: EmojiData) {
    if (!("native" in emoji)) return;
    this.setState({
      text: this.state.text + emoji.native,
      emojiPickerShown: false,
    });
  }

  handleOpenPicker() {
    this.setState({ emojiPickerShown: true });
    document.addEventListener("mousedown", this.handleClosePicker);
  }

  handleClosePicker(event: any) {
    if (this.pickerRef?.current?.contains(event.target)) return;
    this.setState({ emojiPickerShown: false });
    document.removeEventListener("mousedown", this.handleClosePicker);
  }

  handleKeyPress(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  handleInputChange(event: any) {
    const textArea = event.target as HTMLTextAreaElement;
    const text = textArea.value;

    this.props.onChange && this.props.onChange(text);
    this.autoSize();
    this.setState({ text });
  }

  /*
  /* Lifecycle
  */

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClosePicker);
  }

  componentDidMount() {
    try {
      if (!this.context.pubnub)
        throw "Message Input has no access to context. Please make sure to wrap the components around with PubNubProvider.";
      if (!this.context.channel.length)
        throw "PubNubProvider was initialized with an empty channel name.";
    } catch (e) {
      console.error(e);
    }
  }

  /*
  /* Renderers
  */

  render() {
    if (!this.context.pubnub || !this.context.channel.length) return null;
    const { inputRef } = this;
    const { text } = this.state;
    const {
      hideSendButton,
      sendButtonContent,
      placeholder,
      disableEmojiPicker,
      theme,
    } = this.props;

    return (
      <div className={`pn-msg-input pn-msg-input--${theme}`}>
        <div className="pn-msg-input__wrapper">
          <div className="pn-msg-input__spacer">
            <textarea
              className="pn-msg-input__textarea"
              placeholder={placeholder}
              rows={1}
              value={text}
              onChange={(e) => this.handleInputChange(e)}
              onKeyPress={(e) => this.handleKeyPress(e)}
              ref={inputRef}
            />
          </div>

          {!disableEmojiPicker && this.renderEmojiPicker()}

          {!hideSendButton && (
            <button className="pn-msg-input__send" onClick={() => this.sendMessage()}>
              {sendButtonContent}
            </button>
          )}
        </div>
      </div>
    );
  }

  renderEmojiPicker() {
    return (
      <>
        <div className="pn-msg-input__icon">
          <EmojiIcon onClick={() => this.handleOpenPicker()} />
        </div>

        {this.state.emojiPickerShown && (
          <div className="pn-msg-input__emoji-picker" ref={this.pickerRef}>
            <Picker
              {...this.props.emojiMartOptions}
              onSelect={(e: EmojiData) => this.handleEmojiInsertion(e)}
            />
          </div>
        )}
      </>
    );
  }
}
