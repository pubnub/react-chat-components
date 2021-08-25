import React, {
  FC,
  UIEvent,
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  ReactElement,
} from "react";
import { FetchMessagesResponse, UUIDMetadataObject, ObjectCustom } from "pubnub";
import { usePubNub } from "pubnub-react";
import { useAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { Message, ImageAttachment, LinkAttachment, EmojiPickerElementProps } from "../types";
import {
  CurrentChannelAtom,
  CurrentChannelMessagesAtom,
  CurrentChannelPaginationAtom,
  UsersMetaAtom,
  ThemeAtom,
  RetryFunctionAtom,
  ErrorFunctionAtom,
} from "../state-atoms";
import SpinnerIcon from "./spinner.svg";
import "./message-list.scss";

export interface MessageRendererProps {
  isOwn: boolean;
  message: Message;
  time: string;
  user?: UUIDMetadataObject<ObjectCustom>;
}

export interface MessageListProps {
  children?: ReactNode;
  /** Set a number from 0 to 100 to fetch past messages from storage on a channel. Defaults to 0 to fetch no messages from storage. */
  fetchMessages?: number;
  /** Enable to render reactions that were added to messages. Be sure to also set up reactionsPicker when this is enabled */
  enableReactions?: boolean;
  /** Provide custom welcome messages to replace the default one or set to false to disable */
  welcomeMessages?: false | Message | Message[];
  /** Pass in an emoji picker component if you want to enable message reactions. See Emoji Pickers section of the docs to get more details */
  reactionsPicker?: ReactElement<EmojiPickerElementProps>;
  /** Provide custom message item renderer if themes and CSS variables aren't enough */
  messageRenderer?: (props: MessageRendererProps) => JSX.Element;
  /** Provide custom message bubble renderer if themes and CSS variables aren't enough */
  bubbleRenderer?: (props: MessageRendererProps) => JSX.Element;
  /** Use this function to render only some of the messages on your own. */
  filter?: (message: Message) => boolean;
  /** A callback run on list scroll */
  onScroll?: (event: UIEvent<HTMLElement>) => unknown;
}

/**
 * Fetches historical messages using scrolling pagination pattern and subscribes to the current
 * channel to stay up to date with new messages. Displays data in an interactive list, including
 * user names, avatars, times of sending and attachments (links, images). Allows to react to
 * messages with emojis and show those reactions immediately.
 */
export const MessageList: FC<MessageListProps> = (props: MessageListProps) => {
  const pubnub = usePubNub();

  const [channel] = useAtom(CurrentChannelAtom);
  const [users] = useAtom(UsersMetaAtom);
  const [theme] = useAtom(ThemeAtom);
  const [retryObj] = useAtom(RetryFunctionAtom);
  const [onErrorObj] = useAtom(ErrorFunctionAtom);
  const [messages] = useAtom(CurrentChannelMessagesAtom);
  const [paginationEnd] = useAtom(CurrentChannelPaginationAtom);
  const retry = retryObj.function;
  const onError = onErrorObj.function;

  const [scrolledBottom, setScrolledBottom] = useState(true);
  const [prevMessages, setPrevMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [picker, setPicker] = useState<ReactElement>();
  const [emojiPickerShown, setEmojiPickerShown] = useState(false);
  const [reactingToMessage, setReactingToMessage] = useState(null);

  const endRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const spinnerObserver = useRef(
    new IntersectionObserver((e) => e[0].isIntersecting === true && fetchMoreHistory())
  );
  const bottomObserver = useRef(
    new IntersectionObserver((e) => handleBottomScroll(e[0].isIntersecting))
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
    endRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
    if (!props.fetchMessages) return;
    try {
      setFetchingMessages(true);
      const history = await retry(() =>
        pubnub.fetchMessages({
          channels: [channel],
          count: props.fetchMessages,
          includeMessageActions: true,
        })
      );
      handleHistoryFetch(history);
      scrollToBottom();
      setupSpinnerObserver();
      setupBottomObserver();
    } catch (e) {
      onError(e);
    } finally {
      setFetchingMessages(false);
    }
  };

  /** useAtomCallback to accesses jotai atoms inside of a Intersection Observer callback */
  const fetchMoreHistory = useAtomCallback(
    useCallback(async (get) => {
      const channel = get(CurrentChannelAtom);
      const retryObj = get(RetryFunctionAtom);
      const errorObj = get(ErrorFunctionAtom);
      const messages = get(CurrentChannelMessagesAtom);
      const retry = retryObj.function;
      const onError = errorObj.function;
      const firstMessage = listRef.current?.querySelector(".pn-msg");

      if (!messages.length) return;

      try {
        const history = await retry(() =>
          pubnub.fetchMessages({
            channels: [channel],
            count: props.fetchMessages,
            start: (messages?.[0].timetoken as number) || undefined,
            includeMessageActions: true,
          })
        );
        handleHistoryFetch(history);
        if (firstMessage) firstMessage.scrollIntoView();
      } catch (e) {
        onError(e);
      }
    }, [])
  );

  const addReaction = (reaction: string, messageTimetoken) => {
    try {
      pubnub.addMessageAction({
        channel,
        messageTimetoken,
        action: {
          type: "reaction",
          value: reaction,
        },
      });
    } catch (e) {
      onError(e);
    }
  };

  const removeReaction = (reaction: string, messageTimetoken, actionTimetoken) => {
    try {
      pubnub.removeMessageAction({ channel, messageTimetoken, actionTimetoken });
    } catch (e) {
      onError(e);
    }
  };

  /*
  /* Event handlers
  */

  const handleEmojiInsertion = useCallback(
    (emoji: { native: string }) => {
      try {
        if (!("native" in emoji)) return;
        addReaction(emoji.native, reactingToMessage);
        setEmojiPickerShown(false);
      } catch (e) {
        onError(e);
      }
    },
    [reactingToMessage]
  );

  const handleBottomScroll = (scrolledBottom: boolean) => {
    try {
      if (scrolledBottom) setUnreadMessages(0);
      setScrolledBottom(scrolledBottom);
    } catch (e) {
      onError(e);
    }
  };

  const handleHistoryFetch = useAtomCallback(
    useCallback((get, set, response: FetchMessagesResponse) => {
      const channel = get(CurrentChannelAtom);
      const messages = get(CurrentChannelMessagesAtom);
      const newMessages = (response?.channels[channel] as Message[]) || [];
      const allMessages = [...messages, ...newMessages].sort(
        (a, b) => (a.timetoken as number) - (b.timetoken as number)
      );
      setEmojiPickerShown(false);
      setPrevMessages(allMessages);
      set(CurrentChannelMessagesAtom, allMessages);
      set(
        CurrentChannelPaginationAtom,
        !allMessages.length || newMessages.length !== props.fetchMessages
      );
    }, [])
  );

  const handleOpenReactions = (event: React.MouseEvent, timetoken) => {
    try {
      let newPickerTopPosition =
        listRef.current.scrollTop -
        listRef.current.getBoundingClientRect().top +
        (event.target as HTMLElement).getBoundingClientRect().y;
      if (newPickerTopPosition > pickerRef.current.offsetHeight) {
        newPickerTopPosition += (event.target as HTMLElement).getBoundingClientRect().height;
        newPickerTopPosition -= pickerRef.current.offsetHeight;
      }
      pickerRef.current.style.top = `${newPickerTopPosition}px`;

      setEmojiPickerShown(true);
      setReactingToMessage(timetoken);
    } catch (e) {
      onError(e);
    }
  };

  const handleCloseReactions = (event: MouseEvent) => {
    try {
      setEmojiPickerShown((pickerShown) => {
        if (
          !pickerShown ||
          pickerRef.current?.contains(event.target as Node) ||
          (event.target as Element).classList.contains("pn-msg__reactions-toggle")
        )
          return pickerShown;
        return false;
      });
    } catch (e) {
      onError(e);
    }
  };

  /*
  /* Lifecycle
  */

  useEffect(() => {
    if (!pubnub || !channel) return;
    if (!messages?.length) fetchHistory();
    setupSpinnerObserver();
  }, [channel]);

  useEffect(() => {
    if (React.isValidElement(props.reactionsPicker)) {
      setPicker(React.cloneElement(props.reactionsPicker, { onSelect: handleEmojiInsertion }));
    }
  }, [props.reactionsPicker, handleEmojiInsertion]);

  useEffect(() => {
    if (!messages?.length) return;

    const messagesFromListener = messages.length - prevMessages.length;

    if (scrolledBottom) scrollToBottom();
    if (!scrolledBottom && messagesFromListener)
      setUnreadMessages(unreadMessages + messagesFromListener);

    setupBottomObserver();
    setPrevMessages(messages);
  }, [messages]);

  useEffect(() => {
    document.addEventListener("mousedown", handleCloseReactions);

    return () => {
      document.removeEventListener("mousedown", handleCloseReactions);
    };
  }, []);

  /*
  /* Renderers
  */

  const renderWelcomeMessages = () => {
    if (!props.welcomeMessages) return;
    return Array.isArray(props.welcomeMessages)
      ? props.welcomeMessages.map((m) => renderItem(m))
      : renderItem(props.welcomeMessages);
  };

  const renderItem = (message: Message) => {
    const uuid = message.uuid || message.publisher || "";
    const currentUserClass = isOwnMessage(uuid) ? "pn-msg--own" : "";

    return (
      <div className={`pn-msg ${currentUserClass}`} key={message.timetoken}>
        {renderMessage(message)}
        {props.reactionsPicker && message.message.type !== "welcome" && (
          <div className="pn-msg__actions">
            <div
              className="pn-msg__reactions-toggle"
              onClick={(e) => {
                emojiPickerShown && reactingToMessage === message.timetoken
                  ? setEmojiPickerShown(false)
                  : handleOpenReactions(e, message.timetoken);
              }}
            >
              ☺
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMessage = (message: Message) => {
    const uuid = message.uuid || message.publisher || "";
    const user = message.message.sender || getUser(uuid);
    const time = getTime(message.timetoken as number);
    const isOwn = isOwnMessage(uuid);
    const attachments = message.message?.attachments || [];

    if (props.messageRenderer && (props.filter ? props.filter(message) : true))
      return props.messageRenderer({ message, user, time, isOwn });

    return (
      <>
        <div className="pn-msg__avatar">
          {user?.profileUrl && <img src={user.profileUrl} alt="User avatar " />}
          {!user?.profileUrl && <div className="pn-msg__avatar-placeholder" />}
        </div>
        <div className="pn-msg__main">
          <div className="pn-msg__content">
            <div className="pn-msg__title">
              <span className="pn-msg__author">{user?.name || uuid}</span>
              <span className="pn-msg__time">{time}</span>
            </div>
            {props.bubbleRenderer && (props.filter ? props.filter(message) : true) ? (
              props.bubbleRenderer({ message, user, time, isOwn })
            ) : (
              <div className="pn-msg__bubble">{message.message.text}</div>
            )}
          </div>
          <div className="pn-msg__extras">
            {attachments.map(renderAttachment)}
            {props.enableReactions && renderReactions(message)}
          </div>
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
      <div key={key} className="pn-msg__attachments">
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
    <div className={`pn-msg-list pn-msg-list--${theme}`}>
      {unreadMessages > 0 && (
        <div className="pn-msg-list__unread" onClick={() => scrollToBottom()}>
          {unreadMessages} new messages ↓
        </div>
      )}

      <div className="pn-msg-list-scroller" onScroll={props.onScroll} ref={listRef}>
        {!!props.fetchMessages && !paginationEnd && (
          <span ref={spinnerRef} className="pn-msg-list__spinner">
            <SpinnerIcon />
          </span>
        )}

        <div className="pn-msg-list__spacer" />

        {(!props.fetchMessages || (!fetchingMessages && !messages.length)) &&
          renderWelcomeMessages()}
        {messages && messages.map((m) => renderItem(m))}

        <div className="pn-msg-list__bottom-ref" ref={endRef}></div>

        {props.reactionsPicker && (
          <div
            className={`pn-msg-list__emoji-picker ${
              !emojiPickerShown && "pn-msg-list__emoji-picker-hidden"
            }`}
            ref={pickerRef}
          >
            {picker}
          </div>
        )}

        {props.children}
      </div>
    </div>
  );
};

MessageList.defaultProps = {
  enableReactions: false,
  fetchMessages: 0,
};
