import React, { FC, UIEvent, useRef, useState, useEffect } from "react";
import { FetchMessagesResponse, UserData } from "pubnub";
import { useRecoilState, useRecoilValue } from "recoil";
import { Picker, EmojiData } from "emoji-mart";
import { Message, ImageAttachment, LinkAttachment } from "../types";
import {
  CurrentChannelAtom,
  PubnubAtom,
  CurrentChannelMessagesAtom,
  CurrentChannelPaginationAtom,
  UsersMetaAtom,
  ThemeAtom,
  EmojiMartOptionsAtom,
} from "../state-atoms";
import SpinnerIcon from "./spinner.svg";
import LogoIcon from "./logo.svg";
import "./message-list.scss";

export interface MessageRendererProps {
  isOwn: boolean;
  message: Message;
  time: string;
  user?: UserData;
}

export interface MessageListProps {
  /** Disable fetching of messages stored in the history */
  disableHistoryFetch?: boolean;
  /** Disable message reactions */
  disableReactions?: boolean;
  /** Provide custom message item renderer if themes and CSS variables aren't enough */
  messageRenderer?: (props: MessageRendererProps) => JSX.Element;
  /** Provide custom message bubble renderer if themes and CSS variables aren't enough */
  bubbleRenderer?: (props: MessageRendererProps) => JSX.Element;
  /** Use this if you want to render only some of the messages on your own */
  rendererFilter?: (message: Message) => boolean;
  /** A callback run on list scroll */
  onScroll?: (event: UIEvent<HTMLElement>) => unknown;
}

export const MessageList: FC<MessageListProps> = (props: MessageListProps) => {
  const pubnub = useRecoilValue(PubnubAtom);
  const channel = useRecoilValue(CurrentChannelAtom);
  const users = useRecoilValue(UsersMetaAtom);
  const theme = useRecoilValue(ThemeAtom);
  const emojiMartOptions = useRecoilValue(EmojiMartOptionsAtom);
  const [messages, setMessages] = useRecoilState(CurrentChannelMessagesAtom);
  const [paginationEnd, setPaginationEnd] = useRecoilState(CurrentChannelPaginationAtom);

  const [messagesPerPage] = useState(100);
  const [scrolledBottom, setScrolledBottom] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [emojiPickerShown, setEmojiPickerShown] = useState(false);
  const [reactingToMessage, setReactingToMessage] = useState(null);

  const endRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const bottomObserver = useRef(
    new IntersectionObserver((e) => handleBottomScroll(e[0].isIntersecting))
  );
  const spinnerObserver = useRef(
    new IntersectionObserver((e) => e[0].isIntersecting === true && fetchMoreHistory())
  );

  /*
  /* Helper functions
  */

  const getTime = (timestamp: number) => {
    const ts = String(timestamp);
    const date = new Date(parseInt(ts) / 10000);
    const minutes = date.getMinutes();
    return `${date.getHours()}:${minutes > 9 ? minutes : "0" + minutes}`;
  };

  const scrollToBottom = () => {
    if (!endRef.current) return;
    endRef.current.scrollIntoView();
  };

  const setupSpinnerObserver = () => {
    if (!spinnerRef.current) return;
    spinnerObserver.current.observe(spinnerRef.current);
  };

  const setupBottomObserver = () => {
    if (!endRef.current) return;
    bottomObserver.current.disconnect();
    bottomObserver.current.observe(endRef.current);
  };

  const getUser = (uuid: string) => {
    return users.find((u) => u.id === uuid);
  };

  const isOwnMessage = (uuid: string) => {
    return pubnub.getUUID() === uuid;
  };

  /*
  /* Commands
  */

  const fetchHistory = async () => {
    if (props.disableHistoryFetch) return;
    try {
      setFetchingMessages(true);
      const history = await pubnub.fetchMessages({
        channels: [channel],
        count: messagesPerPage,
        includeMessageActions: true,
      });
      handleHistoryFetch(history);
      scrollToBottom();
      setupSpinnerObserver();
      setupBottomObserver();
    } catch (e) {
      console.error(e);
    } finally {
      setFetchingMessages(false);
    }
  };

  const fetchMoreHistory = async () => {
    if (!pubnub) return;
    try {
      const firstMessage = listRef.current?.querySelector("div");
      const response = await pubnub.fetchMessages({
        channels: [channel],
        count: messagesPerPage,
        start: (messages?.[0].timetoken as number) || undefined,
        includeMessageActions: true,
      });
      handleHistoryFetch(response);
      if (firstMessage) firstMessage.scrollIntoView();
    } catch (e) {
      console.error(e);
    }
  };

  const addReaction = (reaction: string, messageTimetoken) => {
    pubnub.addMessageAction({
      channel,
      messageTimetoken,
      action: {
        type: "reaction",
        value: reaction,
      },
    });
  };

  const removeReaction = (reaction: string, messageTimetoken, actionTimetoken) => {
    pubnub.removeMessageAction({ channel, messageTimetoken, actionTimetoken });
  };

  /*
  /* Event handlers
  */

  const handleBottomScroll = (scrolledBottom: boolean) => {
    if (scrolledBottom) setUnreadMessages(0);
    setScrolledBottom(scrolledBottom);
  };

  const handleHistoryFetch = (response: FetchMessagesResponse) => {
    const newMessages = (response.channels[channel] as Message[]) || [];
    const allMessages = [...messages, ...newMessages].sort(
      (a, b) => (a.timetoken as number) - (b.timetoken as number)
    );
    setMessages(allMessages);
    setPaginationEnd(!allMessages.length || newMessages.length !== messagesPerPage);
  };

  const handleOpenReactions = (event: React.MouseEvent, timetoken) => {
    (event.target as HTMLElement).appendChild(pickerRef.current);
    setEmojiPickerShown(true);
    setReactingToMessage(timetoken);
    document.addEventListener("mousedown", handleCloseReactions);
  };

  const handleCloseReactions = (event: MouseEvent) => {
    if (pickerRef.current?.contains(event.target as Node)) return;
    setEmojiPickerShown(false);
    setReactingToMessage(null);
    document.removeEventListener("mousedown", handleCloseReactions);
  };

  /*
  /* Lifecycle
  */

  useEffect(() => {
    if (!pubnub) return;
    if (!messages?.length) fetchHistory();
  }, [channel]);

  useEffect(() => {
    if (!messages?.length) return;
    setupBottomObserver();

    if (scrolledBottom) {
      scrollToBottom();
    } else {
      setUnreadMessages(unreadMessages + 1);
    }
  }, [messages]);

  /*
  /* Renderers
  */

  const renderWelcomeMessage = () => {
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
  };

  const renderItem = (message: Message) => {
    const uuid = message.uuid || message.publisher || "";
    const currentUserClass = isOwnMessage(uuid) ? "pn-msg--own" : "";

    return (
      <div className={`pn-msg ${currentUserClass}`} key={message.timetoken}>
        {renderMessage(message)}
        {!props.disableReactions && (
          <div className="pn-msg__actions">
            <div onClick={(e) => handleOpenReactions(e, message.timetoken)}>☺</div>
          </div>
        )}
      </div>
    );
  };

  const renderMessage = (message: Message) => {
    const uuid = message.uuid || message.publisher || "";
    const user = getUser(uuid);
    const time = getTime(message.timetoken as number);
    const isOwn = isOwnMessage(uuid);
    const attachments = message.message?.attachments || [];

    if (props.messageRenderer && props.rendererFilter(message))
      return props.messageRenderer({ message, user, time, isOwn });

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
          {props.bubbleRenderer && props.rendererFilter(message) ? (
            props.bubbleRenderer({ message, user, time, isOwn })
          ) : (
            <>
              <div className="pn-msg__bubble">{message.message.text}</div>
              {attachments.map(renderAttachment)}
            </>
          )}
          {!props.disableReactions && renderReactions(message)}
        </div>
      </>
    );
  };

  const renderReactions = (message: Message) => {
    const reactions = message.actions?.reaction;
    if (!reactions) return;

    return (
      <div className="pn-msg__reactions">
        {Object.keys(reactions).map((reaction) => {
          const instances = reactions[reaction];
          const userReaction = instances?.find((i) => i.uuid === pubnub.getUUID());

          return (
            <div
              className={`pn-msg__reaction ${userReaction ? "pn-msg__reaction--active" : ""}`}
              key={reaction}
              onClick={() => {
                userReaction
                  ? removeReaction(reaction, message.timetoken, userReaction.actionTimetoken)
                  : addReaction(reaction, message.timetoken);
              }}
            >
              {reaction} &nbsp; {instances.length}
            </div>
          );
        })}
      </div>
    );
  };

  const renderAttachment = (attachment: ImageAttachment | LinkAttachment, key: number) => {
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
  };

  return (
    <div className={`pn-msg-list pn-msg-list--${theme}`} onScroll={props.onScroll} ref={listRef}>
      {!props.disableHistoryFetch && !paginationEnd && (
        <span ref={spinnerRef} className="pn-msg-list__spinner">
          <SpinnerIcon />
        </span>
      )}

      <div className="pn-msg-list__spacer" />

      {messages && messages.map((m) => renderItem(m))}
      {messages && !messages.length && !fetchingMessages && renderWelcomeMessage()}

      <div className="pn-msg-list__emoji-picker" ref={pickerRef}>
        {emojiPickerShown && (
          <Picker
            {...emojiMartOptions}
            onSelect={(e: EmojiData) => {
              addReaction(e.native, reactingToMessage);
              setEmojiPickerShown(false);
            }}
          />
        )}
      </div>

      <div className="pn-msg-list__bottom-ref" ref={endRef}></div>

      {unreadMessages > 0 && (
        <div className="pn-msg-list__unread" onClick={() => scrollToBottom()}>
          {unreadMessages} new messages ↓
        </div>
      )}
    </div>
  );
};
