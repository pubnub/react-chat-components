import React from "react";
import { PubNubContext } from "../pubnub-provider/pubnub-provider";
import "./message-input.scss";
import "emoji-mart/css/emoji-mart.css";
import { Picker, EmojiData, PickerProps } from "emoji-mart";
import { SignalEvent } from "pubnub";

export interface MessageInputProps {
  /** Set the input placeholder */
  placeholder: string;
  /** Set the initial value for the input */
  initialValue?: string;
  /** Show the Send button */
  hideSendButton?: boolean;
  /** Send button children */
  sendButtonContent: JSX.Element | string;
  /** Disable the built-in emoji picker */
  disableEmojiPicker?: boolean;
  /** Pass options to emoji-mart picker */
  emojiMartOptions: PickerProps;
  /** Callback to handle value changes */
  onChange?: (value: string) => unknown;
  /** Callback for extra actions while sending the message */
  onSend?: (value: unknown) => unknown;
}

interface MessageInputState {
  text: string;
  emojiPickerShown: boolean;
  typingIndicatorSent: boolean;
  typingIndicators: TypingIndicators;
  typingIndicatorTimeout: number;
}

type TypingIndicators = {
  [id: string]: string | null;
};

/**
 * Allows users to compose messages using text and emojis
 * and automatically publish them on PubNub channels upon sending.
 */
export class MessageInput extends React.Component<MessageInputProps, MessageInputState> {
  private inputRef: React.RefObject<HTMLTextAreaElement>;
  private pickerRef: React.RefObject<HTMLDivElement>;
  private previousChannel: string;

  static contextType = PubNubContext;
  // This is needed to have context correctly typed
  // https://github.com/facebook/create-react-app/issues/8918
  context!: React.ContextType<typeof PubNubContext>;

  static defaultProps = {
    emojiMartOptions: { emoji: "", title: "", native: true },
    initialValue: "",
    placeholder: "Type Message",
    sendButtonContent: "→",
  };

  constructor(props: MessageInputProps) {
    super(props);
    this.state = {
      text: this.props.initialValue || "",
      emojiPickerShown: false,
      typingIndicatorSent: false,
      typingIndicators: {},
      typingIndicatorTimeout: 10,
    };
    this.inputRef = React.createRef();
    this.pickerRef = React.createRef();
    this.handleClosePicker = this.handleClosePicker.bind(this);
  }

  /*
  /* Helper functions
  */

  private autoSize() {
    const input = this.inputRef.current;
    if (!input) return;

    setTimeout(() => {
      input.style.cssText = `height: auto;`;
      input.style.cssText = `height: ${input.scrollHeight}px;`;
    }, 0);
  }

  private getUser(uuid: string) {
    return this.context.users.find((u) => u.id === uuid);
  }

  private getIndicationString() {
    const indicators = this.state.typingIndicators;
    const ids = Object.keys(indicators).filter((id) => {
      return (
        Date.now() - parseInt(indicators[id]) / 10000 < this.state.typingIndicatorTimeout * 1000
      );
    });
    let indicateStr = "";
    if (ids.length > 1) indicateStr = "Multiple users are typing...";
    if (ids.length == 1) {
      const user = this.getUser(ids[0]);
      indicateStr = `${user?.name || "Unknown User"} is typing...`;
    }
    return indicateStr;
  }

  /*
  /* Commands
  */

  private async sendMessage() {
    try {
      if (!this.state.text) return;
      const message = { type: "text", text: this.state.text };

      await this.context.pubnub.publish({
        channel: this.context.channel,
        message,
      });
      this.props.onSend && this.props.onSend(message);
      this.stopTypingIndicator();
      this.setState({ text: "" });
    } catch (e) {
      console.error(e);
    }
  }

  private async startTypingIndicator() {
    if (!this.state.typingIndicatorSent) {
      this.setState({ typingIndicatorSent: true });
      const message = { message: "typing_on", channel: this.context.channel };
      this.context.pubnub.signal(message);

      setTimeout(() => {
        this.setState({ typingIndicatorSent: false });
      }, (this.state.typingIndicatorTimeout - 1) * 1000);
    }
  }

  private async stopTypingIndicator() {
    if (this.state.typingIndicatorSent) {
      this.setState({ typingIndicatorSent: false });
      const message = { message: "typing_off", channel: this.context.channel };
      this.context.pubnub.signal(message);
    }
  }

  /*
  /* Event handlers
  */

  private handleEmojiInsertion(emoji: EmojiData) {
    if (!("native" in emoji)) return;
    this.setState({
      text: this.state.text + emoji.native,
      emojiPickerShown: false,
    });
  }

  private handleOpenPicker() {
    this.setState({ emojiPickerShown: true });
    document.addEventListener("mousedown", this.handleClosePicker);
  }

  private handleClosePicker(event: MouseEvent) {
    if (this.pickerRef?.current?.contains(event.target as Node)) return;
    this.setState({ emojiPickerShown: false });
    document.removeEventListener("mousedown", this.handleClosePicker);
  }

  private handleKeyPress(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const textArea = event.target as HTMLTextAreaElement;
    const text = textArea.value;

    if (text.length) {
      this.startTypingIndicator();
    } else {
      this.stopTypingIndicator();
    }

    this.props.onChange && this.props.onChange(text);
    this.autoSize();
    this.setState({ text });
  }

  private async handleSignalEvent(signal: SignalEvent) {
    if (signal.channel !== this.context.channel) return;

    if (["typing_on", "typing_off"].includes(signal.message)) {
      if (!this.getUser(signal.publisher)) {
        const user = await this.context.pubnub.objects.getUUIDMetadata({ uuid: signal.publisher });
        if (user?.data) this.context.updateUsers([...this.context.users, user.data]);
      }

      this.setState({
        typingIndicators: {
          ...this.state.typingIndicators,
          [`${signal.publisher}`]: signal.message === "typing_on" ? signal.timetoken : null,
        },
      });

      setTimeout(() => {
        this.setState({
          typingIndicators: {
            ...this.state.typingIndicators,
            [`${signal.publisher}`]: null,
          },
        });
      }, this.state.typingIndicatorTimeout * 1000);
    }
  }

  /*
  /* Lifecycle
  */

  componentDidMount(): void {
    try {
      if (!this.context.pubnub)
        throw "Message Input has no access to context. Please make sure to wrap the components around with PubNubProvider.";
      if (!this.context.channel.length)
        throw "PubNubProvider was initialized with an empty channel name.";

      this.context.pubnub.addListener({ signal: (e) => this.handleSignalEvent(e) });
      this.context.pubnub.subscribe({ channels: [this.context.channel] });
      this.previousChannel = this.context.channel;
    } catch (e) {
      console.error(e);
    }
  }

  componentDidUpdate(): void {
    if (this.context.channel !== this.previousChannel) {
      this.setState({
        text: this.props.initialValue || "",
        emojiPickerShown: false,
        typingIndicatorSent: false,
        typingIndicators: {},
      });

      this.context.pubnub.subscribe({ channels: [this.context.channel] });
      this.context.pubnub.unsubscribe({ channels: [this.previousChannel] });
      this.previousChannel = this.context.channel;
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener("mousedown", this.handleClosePicker);
    this.context.pubnub.unsubscribe({ channels: [this.context.channel] });
  }

  /*
  /* Renderers
  */

  render(): JSX.Element {
    if (!this.context.pubnub || !this.context.channel.length) return null;
    const { inputRef } = this;
    const { text } = this.state;
    const { hideSendButton, sendButtonContent, placeholder, disableEmojiPicker } = this.props;
    const { theme } = this.context;

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

        <div className="pn-msg-input__indicator">{this.getIndicationString()}</div>
      </div>
    );
  }

  private renderEmojiPicker() {
    return (
      <>
        <div className="pn-msg-input__icon" onClick={() => this.handleOpenPicker()}>
          ☺
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
