import React from "react";
import { FetchMessagesResponse, MessageEvent, MessageActionEvent, UserData } from "pubnub";
import { PubNubContext } from "../pubnub-provider";
import { setDeep } from "../helpers";
import SpinnerIcon from "./spinner.svg";
import LogoIcon from "./logo.svg";
import { Picker, EmojiData, PickerProps } from "emoji-mart";
import "./message-list.scss";

export interface MessageListProps {
  /** Disable fetching of the users data */
  disableUserFetch?: boolean;
  /** Disable fetching of messages stored in the history */
  disableHistoryFetch?: boolean;
  /** Disable message reactions */
  disableReactions?: boolean;
  /** Pass options to emoji-mart picker */
  emojiMartOptions: PickerProps;
  /** Provide custom message item renderer if themes and CSS variables aren't enough */
  messageRenderer?: (props: MessageRendererProps) => JSX.Element;
  /** Provide custom message bubble renderer if themes and CSS variables aren't enough */
  bubbleRenderer?: (props: MessageRendererProps) => JSX.Element;
  /** Use this if you want to render only some of the messages on your own */
  rendererFilter?: (message: MessageListMessage) => boolean;
  /** A callback run on new messages */
  onMessage?: (message: MessageListMessage) => unknown;
  /** A callback run on list scroll */
  onScroll?: (event: React.UIEvent<HTMLElement>) => unknown;
}

export interface MessageRendererProps {
  isOwnMessage: boolean;
  message: MessageListMessage;
  time: string;
  user?: UserData;
}

interface MessageListState {
  messages: MessageListMessage[];
  messagesPerPage: number;
  pagination?: string | number;
  paginationEnd: boolean;
  scrolledBottom: boolean;
  unreadMessages: number;
  fetchingMessages: boolean;
  emojiPickerShown: boolean;
  reactingToMessage?: string | number;
}

export interface MessageListMessage {
  channel: string;
  message: {
    type: string;
    text: string;
    attachments: Array<ImageAttachment | LinkAttachment>;
    [key: string]: unknown;
  };
  timetoken: string | number;
  publisher?: string;
  uuid?: string;
  meta?: {
    [key: string]: unknown;
  };
  actions?: {
    [type: string]: {
      [value: string]: Array<{
        uuid: string;
        actionTimetoken: string | number;
      }>;
    };
  };
}

export interface ImageAttachment {
  type: "image";
  image: {
    source: string;
  };
}

export interface LinkAttachment {
  type: "link";
  description: string;
  title: string;
  icon: {
    source: string;
  };
  image: {
    source: string;
  };
  provider: {
    name: string;
    url: string;
  };
}

/** Component responsible for fetching messages from PubNub channels and displaying them in a list. */
export class MessageList extends React.Component<MessageListProps, MessageListState> {
  private spinnerRef: React.RefObject<HTMLDivElement>;
  private listRef: React.RefObject<HTMLDivElement>;
  private endRef: React.RefObject<HTMLDivElement>;
  private pickerRef: React.RefObject<HTMLDivElement>;
  private spinnerObserver: IntersectionObserver;
  private bottomObserver: IntersectionObserver;
  private previousChannel: string;

  static contextType = PubNubContext;
  // This is needed to have context correctly typed
  // https://github.com/facebook/create-react-app/issues/8918
  context!: React.ContextType<typeof PubNubContext>;

  static defaultProps = {
    emojiMartOptions: { emoji: "", title: "", native: true },
    users: [],
    rendererFilter: (): boolean => true,
  };

  constructor(props: MessageListProps) {
    super(props);
    this.state = {
      messages: [],
      messagesPerPage: 100,
      pagination: undefined,
      paginationEnd: false,
      scrolledBottom: true,
      unreadMessages: 0,
      fetchingMessages: false,
      emojiPickerShown: false,
      reactingToMessage: null,
    };
    this.endRef = React.createRef();
    this.listRef = React.createRef();
    this.spinnerRef = React.createRef();
    this.pickerRef = React.createRef();
    this.bottomObserver = new IntersectionObserver((e) =>
      this.handleBottomScroll(e[0].isIntersecting)
    );
    this.spinnerObserver = new IntersectionObserver(
      (e) => e[0].isIntersecting === true && this.fetchMoreHistory()
    );
  }

  /*
  /* Helper functions
  */

  private getTime(timestamp: number) {
    const ts = String(timestamp);
    const date = new Date(parseInt(ts) / 10000);
    const minutes = date.getMinutes();
    return `${date.getHours()}:${minutes > 9 ? minutes : "0" + minutes}`;
  }

  private scrollToBottom() {
    if (!this.endRef.current) return;
    this.endRef.current.scrollIntoView();
  }

  private setupSpinnerObserver() {
    if (!this.spinnerRef.current) return;
    this.spinnerObserver.observe(this.spinnerRef.current);
  }

  private setupBottomObserver() {
    if (!this.endRef.current) return;
    this.bottomObserver.disconnect();
    this.bottomObserver.observe(this.endRef.current);
  }

  private getUser(uuid: string) {
    return this.context.users.find((u) => u.id === uuid);
  }

  private isOwnMessage(uuid: string) {
    return this.context.pubnub?.getUUID() === uuid;
  }

  /*
  /* Commands
  */

  private async fetchMessageSenders(messages: MessageListMessage[]) {
    if (this.props.disableUserFetch) return;

    try {
      const uniqueUuids = new Set(messages.map((m) => m.uuid || m.publisher));
      const uniqueUuidsArr = Array.from(uniqueUuids);

      for (const uuid of uniqueUuidsArr) {
        if (!uuid || this.getUser(uuid)) continue;
        const user = await this.context.pubnub.objects.getUUIDMetadata({ uuid });
        // Second uniqueness check to ensure context wasn't updated by another component
        if (!user?.data || this.getUser(uuid)) continue;
        this.context.updateUsers([...this.context.users, user.data]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async fetchHistory() {
    if (this.props.disableHistoryFetch) return;
    try {
      this.setState({ fetchingMessages: true });
      const history = await this.context.pubnub.fetchMessages({
        channels: [this.context.channel],
        count: this.state.messagesPerPage,
        includeMessageActions: !this.props.disableReactions,
      });
      this.handleHistoryFetch(history);
      this.scrollToBottom();
      this.setupSpinnerObserver();
      this.setupBottomObserver();
      this.handleCloseReactions = this.handleCloseReactions.bind(this);
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({ fetchingMessages: false });
    }
  }

  private async fetchMoreHistory() {
    try {
      const firstMessage = this.listRef.current?.querySelector("div");
      const response = await this.context.pubnub.fetchMessages({
        channels: [this.context.channel],
        count: this.state.messagesPerPage,
        start: this.state.pagination,
        includeMessageActions: !this.props.disableReactions,
      });
      this.handleHistoryFetch(response);
      if (firstMessage) firstMessage.scrollIntoView();
    } catch (e) {
      console.error(e);
    }
  }

  private addReaction(reaction: string, messageTimetoken) {
    this.context?.pubnub.addMessageAction({
      channel: this.context.channel,
      messageTimetoken,
      action: {
        type: "reaction",
        value: reaction,
      },
    });
  }

  private removeReaction(reaction: string, messageTimetoken, actionTimetoken) {
    this.context?.pubnub.removeMessageAction({
      channel: this.context.channel,
      messageTimetoken,
      actionTimetoken,
    });
  }

  /*
  /* Event handlers
  */

  private handleBottomScroll(scrolledBottom: boolean) {
    if (scrolledBottom) this.setState({ unreadMessages: 0 });
    this.setState({ scrolledBottom });
  }

  private handleHistoryFetch(response: FetchMessagesResponse) {
    const newMessages = (response.channels[this.context.channel] as MessageListMessage[]) || [];
    const allMessages = [...this.state.messages, ...newMessages].sort(
      (a, b) => (a.timetoken as number) - (b.timetoken as number)
    );

    this.fetchMessageSenders(newMessages);
    this.setState({
      messages: allMessages,
      pagination: allMessages.length ? (allMessages[0].timetoken as number) : undefined,
      paginationEnd: !allMessages.length || newMessages.length !== this.state.messagesPerPage,
    });
  }

  private handleOnMessage(message: MessageEvent) {
    this.fetchMessageSenders([message]);
    this.setState({ messages: [...this.state.messages, message] });
    this.setupBottomObserver();
    if (this.props.onMessage) this.props.onMessage(message);

    if (this.state.scrolledBottom) {
      this.scrollToBottom();
    } else {
      this.setState({ unreadMessages: this.state.unreadMessages + 1 });
    }
  }

  private handleOnAction(action: MessageActionEvent) {
    if (action.channel !== this.context.channel) return;
    if (action.data.type !== "reaction") return;

    const reaction = action.data;
    const messages = [...this.state.messages];
    const message = messages.find((m) => m.timetoken === reaction.messageTimetoken);
    if (!message) return;

    if (action.event === "added") {
      if (!message.actions?.reaction?.[reaction.value])
        setDeep(message, ["actions", "reaction", reaction.value], []);
      message.actions.reaction[reaction.value].push({
        uuid: reaction.uuid,
        actionTimetoken: reaction.actionTimetoken,
      });
      this.setState({ messages });
    }

    if (action.event === "removed") {
      const messageReactions = message.actions.reaction[reaction.value];
      const messageReaction = messageReactions.findIndex(
        (i) => i.actionTimetoken === reaction.actionTimetoken
      );
      messageReactions.splice(messageReaction, 1);
      if (!messageReactions.length) delete message.actions.reaction[reaction.value];
      this.setState({ messages });
    }
  }

  private handleOpenReactions(event: React.MouseEvent, timetoken) {
    (event.target as HTMLElement).appendChild(this.pickerRef.current);
    this.setState({ emojiPickerShown: true, reactingToMessage: timetoken });
    document.addEventListener("mousedown", this.handleCloseReactions);
  }

  private handleCloseReactions(event: MouseEvent) {
    if (this.pickerRef?.current?.contains(event.target as Node)) return;
    this.setState({ emojiPickerShown: false, reactingToMessage: null });
    document.removeEventListener("mousedown", this.handleCloseReactions);
  }

  /*
  /* Lifecycle
  */

  async componentDidMount(): Promise<void> {
    try {
      if (!this.context.pubnub)
        throw "Message List has no access to context. Please make sure to wrap the components around with PubNubProvider.";
      if (!this.context.channel.length)
        throw "PubNubProvider was initialized with an empty channel name.";

      this.context.pubnub.addListener({
        message: (m) => this.handleOnMessage(m),
        messageAction: (m) => this.handleOnAction(m),
      });
      this.context.pubnub.subscribe({ channels: [this.context.channel] });
      this.fetchHistory();
      this.previousChannel = this.context.channel;
    } catch (e) {
      console.error(e);
    }
  }

  componentDidUpdate(): void {
    if (this.context.channel !== this.previousChannel) {
      this.setState({
        messages: [],
        pagination: undefined,
        paginationEnd: false,
        scrolledBottom: true,
        unreadMessages: 0,
      });

      this.context.pubnub.subscribe({ channels: [this.context.channel] });
      this.context.pubnub.unsubscribe({ channels: [this.previousChannel] });
      this.fetchHistory();
      this.previousChannel = this.context.channel;
    }
  }

  componentWillUnmount(): void {
    this.context.pubnub.unsubscribe({ channels: [this.context.channel] });
    document.removeEventListener("mousedown", this.handleCloseReactions);
  }

  /*
  /* Renderers
  */

  render(): JSX.Element {
    if (!this.context.pubnub || !this.context.channel.length) return null;
    const { listRef, spinnerRef, endRef } = this;
    const { disableHistoryFetch, onScroll } = this.props;
    const { paginationEnd, messages, unreadMessages, fetchingMessages } = this.state;
    const { theme } = this.context;

    return (
      <div className={`pn-msg-list pn-msg-list--${theme}`} onScroll={onScroll} ref={listRef}>
        {!disableHistoryFetch && !paginationEnd && (
          <span ref={spinnerRef} className="pn-msg-list__spinner">
            <SpinnerIcon />
          </span>
        )}

        <div className="pn-msg-list__spacer" />

        {messages.map((m) => this.renderItem(m))}
        {!messages.length && !fetchingMessages && this.renderWelcomeMessage()}

        <div className="pn-msg-list__emoji-picker" ref={this.pickerRef}>
          {this.state.emojiPickerShown && (
            <Picker
              {...this.props.emojiMartOptions}
              onSelect={(e: EmojiData) => {
                this.addReaction(e.native, this.state.reactingToMessage);
                this.setState({ emojiPickerShown: false });
              }}
            />
          )}
        </div>

        <div className="pn-msg-list__bottom-ref" ref={endRef}></div>

        {unreadMessages > 0 && (
          <div className="pn-msg-list__unread" onClick={() => this.scrollToBottom()}>
            {unreadMessages} new messages ↓
          </div>
        )}
      </div>
    );
  }

  private renderWelcomeMessage() {
    return (
      <div className="pn-msg">
        <div className="pn-msg__avatar">
          <LogoIcon />
        </div>
        <div className="pn-msg__main">
          <div className="pn-msg__title">
            <span className="pn-msg__author">PubNub Bot</span>
            <span className="pn-msg__time">00:00</span>
          </div>
          <div className="pn-msg__bubble">
            Welcome to PubNub Chat Components demo application 👋 <br />
            Send a message now to start interacting with other users in the app ⬇️
          </div>
        </div>
      </div>
    );
  }

  private renderItem(message: MessageListMessage) {
    const uuid = message.uuid || message.publisher || "";
    const currentUserClass = this.isOwnMessage(uuid) ? "pn-msg--own" : "";

    return (
      <div className={`pn-msg ${currentUserClass}`} key={message.timetoken}>
        {this.renderMessage(message)}
        {!this.props.disableReactions && (
          <div className="pn-msg__actions">
            <div onClick={(e) => this.handleOpenReactions(e, message.timetoken)}>☺</div>
          </div>
        )}
      </div>
    );
  }

  private renderMessage(message: MessageListMessage) {
    const uuid = message.uuid || message.publisher || "";
    const user = this.getUser(uuid);
    const time = this.getTime(message.timetoken as number);
    const isOwnMessage = this.isOwnMessage(uuid);
    const attachments = message.message?.attachments || [];

    if (this.props.messageRenderer && this.props.rendererFilter(message))
      return this.props.messageRenderer({ message, user, time, isOwnMessage });

    return (
      <>
        <div className="pn-msg__avatar">
          {user?.profileUrl && <img src={user.profileUrl} alt="User avatar " />}
          {!user?.profileUrl && <div className="pn-msg__avatar-placeholder" />}
        </div>
        <div className="pn-msg__main">
          <div className="pn-msg__title">
            <span className="pn-msg__author">{user?.name || "Unknown User"}</span>
            <span className="pn-msg__time">{time}</span>
          </div>
          {this.props.bubbleRenderer && this.props.rendererFilter(message) ? (
            this.props.bubbleRenderer({ message, user, time, isOwnMessage })
          ) : (
            <>
              <div className="pn-msg__bubble">{message.message.text}</div>
              {attachments.map(this.renderAttachment)}
            </>
          )}
          {!this.props.disableReactions && this.renderReactions(message)}
        </div>
      </>
    );
  }

  private renderReactions(message: MessageListMessage) {
    const reactions = message.actions?.reaction;
    if (!reactions) return;

    return (
      <div className="pn-msg__reactions">
        {Object.keys(reactions).map((reaction) => {
          const instances = reactions[reaction];
          const userReaction = instances?.find((i) => i.uuid === this.context.pubnub?.getUUID());

          return (
            <div
              className={`pn-msg__reaction ${userReaction ? "pn-msg__reaction--active" : ""}`}
              key={reaction}
              onClick={() => {
                userReaction
                  ? this.removeReaction(reaction, message.timetoken, userReaction.actionTimetoken)
                  : this.addReaction(reaction, message.timetoken);
              }}
            >
              {reaction} &nbsp; {instances.length}
            </div>
          );
        })}
      </div>
    );
  }

  private renderAttachment(attachment: ImageAttachment | LinkAttachment, key: number) {
    return (
      <div key={key}>
        {attachment.type === "image" && (
          <img className="pn-msg__image" src={attachment.image?.source} />
        )}

        {attachment.type === "link" && (
          <a
            className="pn-msg__link"
            href={attachment.provider?.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src={attachment.image?.source} />
            <div>
              <p className="pn-msg__link-name">
                <img src={attachment.icon?.source} />
                {attachment.provider?.name}
              </p>
              <p className="pn-msg__link-title">{attachment.title}</p>
              <p className="pn-msg__link-description">{attachment.description}</p>
            </div>
          </a>
        )}
      </div>
    );
  }
}
