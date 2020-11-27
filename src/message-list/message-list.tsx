import React from "react";
import { FetchMessagesResponse, MessageEvent, UserData } from "pubnub";
import { PubNubContext } from "../pubnub-provider";
import SpinnerIcon from "./spinner.svg";
import LogoIcon from "./logo.svg";
import "./message-list.scss";

export interface MessageListProps {
  /* Disable fetching of the users data */
  disableUserFetch?: boolean;
  /* Disable fetching of messages stored in the history */
  disableHistoryFetch?: boolean;
  /* Provide custom message item renderer if themes and CSS variables aren't enough */
  messageRenderer?: (props: MessageRendererProps) => JSX.Element;
  /* Provide custom message bubble renderer if themes and CSS variables aren't enough */
  bubbleRenderer?: (props: MessageRendererProps) => JSX.Element;
  /* Use this if you want to render only some of the messages on your own */
  rendererFilter?: (message: MessageListMessage) => boolean;
  /* A callback run on new messages */
  onMessage?: (message: MessageListMessage) => unknown;
  /* A callback run on list scroll */
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

export class MessageList extends React.Component<MessageListProps, MessageListState> {
  private spinnerRef: React.RefObject<HTMLDivElement>;
  private listRef: React.RefObject<HTMLDivElement>;
  private endRef: React.RefObject<HTMLDivElement>;
  private spinnerObserver: IntersectionObserver;
  private bottomObserver: IntersectionObserver;
  private previousChannel: string;

  static contextType = PubNubContext;
  // This is needed to have context correctly typed
  // https://github.com/facebook/create-react-app/issues/8918
  context!: React.ContextType<typeof PubNubContext>;

  static defaultProps = {
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
    };
    this.endRef = React.createRef();
    this.listRef = React.createRef();
    this.spinnerRef = React.createRef();
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
      });
      this.handleHistoryFetch(history);
      this.scrollToBottom();
      this.setupSpinnerObserver();
      this.setupBottomObserver();
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
      });
      this.handleHistoryFetch(response);
      if (firstMessage) firstMessage.scrollIntoView();
    } catch (e) {
      console.error(e);
    }
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

  /*
  /* Lifecycle
  */

  async componentDidMount(): Promise<void> {
    try {
      if (!this.context.pubnub)
        throw "Message List has no access to context. Please make sure to wrap the components around with PubNubProvider.";
      if (!this.context.channel.length)
        throw "PubNubProvider was initialized with an empty channel name.";

      this.context.pubnub.addListener({ message: (m) => this.handleOnMessage(m) });
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
        </div>
      </>
    );
  }

  private renderAttachment(attachment: ImageAttachment | LinkAttachment, key: number) {
    return (
      <div key={key}>
        {attachment.type === "image" && (
          <img className="pn-msg__image" src={attachment.image?.source} />
        )}

        {attachment.type === "link" && (
          <a className="pn-msg__link" href={attachment.provider?.url}>
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
