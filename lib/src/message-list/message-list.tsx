import React, {
  FC,
  ReactElement,
  ReactNode,
  UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FetchMessagesResponse } from "pubnub";
import { usePubNub } from "pubnub-react";
import { useAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import {
  isFilePayload,
  UserEntity,
  MessageEnvelope,
  LinkAttachment,
  ImageAttachment,
  FileAttachment,
  EmojiPickerElementProps,
} from "../types";
import {
  CurrentChannelAtom,
  CurrentChannelMessagesAtom,
  CurrentChannelPaginationAtom,
  ErrorFunctionAtom,
  RetryFunctionAtom,
  ThemeAtom,
  UsersMetaAtom,
} from "../state-atoms";
import { getNameInitials, getPredefinedColor, useOuterClick, usePrevious } from "../helpers";
import SpinnerIcon from "../icons/spinner.svg";
import EmojiIcon from "../icons/emoji.svg";
import DownloadIcon from "../icons/download.svg";
import ArrowDownIcon from "../icons/arrow-down.svg";
import "./message-list.scss";

export interface MessageRendererProps {
  isOwn: boolean;
  message: MessageEnvelope;
  time: string;
  editedText: string;
  user?: UserEntity;
}

export interface MessageListProps {
  children?: ReactNode;
  /** Option to fetch past messages from storage and display them on a channel. Set a number from "0" to "100". Defaults to "0" to fetch no messages from storage. */
  fetchMessages?: number;
  /** Option to enable rendering reactions that were added to messages. Make sure to also set up reactionsPicker when this option is enabled. */
  enableReactions?: boolean;
  /** Option to provide custom welcome messages to replace the default ones. Set to "false" to disable it. */
  welcomeMessages?: false | MessageEnvelope | MessageEnvelope[];
  /** Option to enable message reactions. Pass it in the emoji picker component. For more details, refer to the Emoji Pickers section in the docs. */
  reactionsPicker?: ReactElement<EmojiPickerElementProps>;
  /** Option to provide an extra actions renderer to add custom action buttons to each message. */
  extraActionsRenderer?: (message: MessageEnvelope) => JSX.Element;
  /** Option to provide a custom message item renderer if themes and CSS variables aren't enough. */
  messageRenderer?: (props: MessageRendererProps) => JSX.Element;
  /** Option to provide a custom message bubble renderer if themes and CSS variables aren't enough. */
  bubbleRenderer?: (props: MessageRendererProps) => JSX.Element;
  /** Option to render only selected messages. */
  filter?: (message: MessageEnvelope) => boolean;
  /** Callback run on a list scroll. */
  onScroll?: (event: UIEvent<HTMLElement>) => unknown;
}

/**
 * Fetches historical messages using the scrolling pagination pattern and subscribes to the current
 * channel to stay up to date with new messages.
 *
 * It also displays data in an interactive list, including
 * user names, avatars, the time when a message was sent, and attachments (links, images) and allows to react to
 * messages with emojis and to show those reactions immediately.
 */
export const MessageList: FC<MessageListProps> = (props: MessageListProps) => {
  const pubnub = usePubNub();

  const [channel] = useAtom(CurrentChannelAtom);
  const prevChannel = usePrevious(channel);
  const [users] = useAtom(UsersMetaAtom);
  const [theme] = useAtom(ThemeAtom);
  const [retryObj] = useAtom(RetryFunctionAtom);
  const [onErrorObj] = useAtom(ErrorFunctionAtom);
  const [messages] = useAtom(CurrentChannelMessagesAtom);
  const prevMessages = usePrevious<typeof messages>(messages);
  const lastMessageUniqueReactions = Object.keys(messages.slice(-1)[0]?.actions?.reaction || {});
  const [paginationEnd] = useAtom(CurrentChannelPaginationAtom);
  const retry = retryObj.function;
  const onError = onErrorObj.function;

  const [scrolledBottom, setScrolledBottom] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [picker, setPicker] = useState<ReactElement>();
  const [emojiPickerShown, setEmojiPickerShown] = useState(false);
  const [reactingToMessage, setReactingToMessage] = useState(null);

  const endRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useOuterClick((event) => {
    if ((event.target as Element).closest(".pn-msg__reactions-toggle")) return;
    setEmojiPickerShown(false);
  });
  const listSizeObserver = useRef(new ResizeObserver(() => handleListMutations()));
  const listMutObserver = useRef(new MutationObserver(() => handleListMutations()));
  const spinnerIntObserver = useRef(
    new IntersectionObserver((e) => handleSpinnerIntersection(e[0].isIntersecting))
  );
  const bottomIntObserver = useRef(
    new IntersectionObserver((e) => handleBottomIntersection(e[0].isIntersecting))
  );

  /*
  /* Helper functions
  */

  const getTime = (timestamp: number) => {
    const ts = String(timestamp);
    const date = new Date(parseInt(ts) / 10000);
    const formatter = new Intl.DateTimeFormat([], { timeStyle: "short" });
    return formatter.format(date);
  };

  const scrollToBottom = useCallback(() => {
    if (!listRef.current || !listRef.current.scroll) return;
    setScrolledBottom(true);
    listRef.current.scroll({ top: listRef.current.scrollHeight });
  }, []);

  const setupSpinnerObserver = () => {
    if (!spinnerRef.current) return;
    spinnerIntObserver.current.observe(spinnerRef.current);
  };

  const setupBottomObserver = () => {
    if (!endRef.current) return;
    bottomIntObserver.current.disconnect();
    bottomIntObserver.current.observe(endRef.current);
  };

  const setupListObservers = () => {
    if (!listRef.current) return;

    listSizeObserver.current.disconnect();
    listSizeObserver.current.observe(listRef.current);

    listMutObserver.current.disconnect();
    listMutObserver.current.observe(listRef.current, { childList: true });
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
  const fetchFileUrl = useCallback(
    (envelope: MessageEnvelope) => {
      if (!isFilePayload(envelope.message)) return envelope;

      try {
        const url = pubnub.getFileUrl({
          channel: envelope.channel,
          id: envelope.message.file.id,
          name: envelope.message.file.name,
        });

        envelope.message.file.url = url;
      } catch (e) {
        onError(e);
      } finally {
        return envelope;
      }
    },
    [pubnub, onError]
  );

  const handleHistoryFetch = useAtomCallback(
    useCallback(
      (get, set, response: FetchMessagesResponse) => {
        const channel = get(CurrentChannelAtom);
        const messages = get(CurrentChannelMessagesAtom);
        const newMessages =
          ((response?.channels[channel] || []).map((m) =>
            m.messageType === 4 ? fetchFileUrl(m) : m
          ) as MessageEnvelope[]) || [];
        const allMessages = [...messages, ...newMessages].sort(
          (a, b) => (a.timetoken as number) - (b.timetoken as number)
        );
        set(CurrentChannelMessagesAtom, allMessages);
        set(
          CurrentChannelPaginationAtom,
          !allMessages.length || newMessages.length !== props.fetchMessages
        );
      },
      [fetchFileUrl, props.fetchMessages]
    )
  );

  const fetchHistory = useCallback(async () => {
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
    } catch (e) {
      onError(e);
    } finally {
      setFetchingMessages(false);
    }
  }, [channel, handleHistoryFetch, onError, props.fetchMessages, pubnub, retry]);

  const fetchMoreHistory = useAtomCallback(
    useCallback(
      async (get) => {
        const channel = get(CurrentChannelAtom);
        const retryObj = get(RetryFunctionAtom);
        const errorObj = get(ErrorFunctionAtom);
        const messages = get(CurrentChannelMessagesAtom);
        const retry = retryObj.function;
        const onError = errorObj.function;
        if (!messages.length) return;
        setFetchingMessages(true);

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
        } catch (e) {
          onError(e);
        } finally {
          setFetchingMessages(false);
        }
      },
      [handleHistoryFetch, props.fetchMessages, pubnub]
    )
  );

  const addReaction = useCallback(
    (reaction: string, messageTimetoken) => {
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
    },
    [channel, onError, pubnub]
  );

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
  const handleSpinnerIntersection = async (isIntersecting: boolean) => {
    if (isIntersecting) {
      const firstMessage = listRef.current?.querySelector(".pn-msg") as HTMLDivElement;
      await fetchMoreHistory();
      if (firstMessage && listRef.current?.scroll)
        listRef.current?.scroll({ top: firstMessage.offsetTop });
    }
  };

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
    [reactingToMessage, addReaction, onError]
  );

  const handleBottomIntersection = (isIntersecting: boolean) => {
    try {
      if (isIntersecting) setUnreadMessages(0);
      setScrolledBottom(isIntersecting);
    } catch (e) {
      onError(e);
    }
  };

  const handleListMutations = () => {
    try {
      setScrolledBottom((scrolledBottom) => {
        if (scrolledBottom) scrollToBottom();
        return scrolledBottom;
      });
    } catch (e) {
      onError(e);
    }
  };

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

  /*
  /* Lifecycle
  */

  useEffect(() => {
    if (!pubnub || !channel) return;
    if (channel === prevChannel) return;
    if (!messages?.length) fetchHistory();
  }, [channel, fetchHistory, messages?.length, prevChannel, pubnub]);

  useEffect(() => {
    if (!messages?.length || scrolledBottom) return;
    if (messages.length - prevMessages.length !== 1) return;
    if (Number(messages.slice(-1)[0]?.timetoken) > Number(prevMessages.slice(-1)[0]?.timetoken))
      setUnreadMessages((unread) => unread + 1);
  }, [messages, prevMessages, scrolledBottom]);

  useEffect(() => {
    if (prevMessages.length !== messages.length) {
      if (scrolledBottom) scrollToBottom();
      setupBottomObserver();
    }

    if (!prevMessages.length && messages.length) {
      setupSpinnerObserver();
      setupListObservers();
    }
  }, [messages.length, prevMessages.length, scrollToBottom, scrolledBottom]);

  useEffect(() => {
    if (prevChannel !== channel) {
      scrollToBottom();
    }
  }, [channel, prevChannel, scrollToBottom]);

  useEffect(() => {
    if (scrolledBottom) scrollToBottom();
  }, [lastMessageUniqueReactions.length, scrolledBottom, scrollToBottom]);

  useEffect(() => {
    if (React.isValidElement(props.reactionsPicker)) {
      setPicker(React.cloneElement(props.reactionsPicker, { onSelect: handleEmojiInsertion }));
    }
  }, [props.reactionsPicker, handleEmojiInsertion]);

  /*
  /* Renderers
  */

  const renderWelcomeMessages = () => {
    if (!props.welcomeMessages) return;
    return Array.isArray(props.welcomeMessages)
      ? props.welcomeMessages.map((m) => renderItem(m))
      : renderItem(props.welcomeMessages);
  };

  const renderItem = (envelope: MessageEnvelope) => {
    const uuid = envelope.uuid || envelope.publisher || "";
    const currentUserClass = isOwnMessage(uuid) ? "pn-msg--own" : "";
    const actions = envelope.actions;
    const deleted = !!Object.keys(actions?.deleted || {}).length;
    const message = isFilePayload(envelope.message) ? envelope.message.message : envelope.message;

    if (deleted) return;

    return (
      <div className={`pn-msg ${currentUserClass}`} key={envelope.timetoken}>
        {renderMessage(envelope)}
        <div className="pn-msg__actions">
          {props.extraActionsRenderer && props.extraActionsRenderer(envelope)}
          {props.reactionsPicker && message?.type !== "welcome" && (
            <div
              className="pn-msg__reactions-toggle"
              title="Add a reaction"
              onClick={(e) => {
                emojiPickerShown && reactingToMessage === envelope.timetoken
                  ? setEmojiPickerShown(false)
                  : handleOpenReactions(e, envelope.timetoken);
              }}
            >
              <EmojiIcon />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMessage = (envelope: MessageEnvelope) => {
    const uuid = envelope.uuid || envelope.publisher || "";
    const time = getTime(envelope.timetoken as number);
    const isOwn = isOwnMessage(uuid);
    const message = isFilePayload(envelope.message) ? envelope.message.message : envelope.message;
    const user = message?.sender || getUser(uuid);
    const attachments = message?.attachments || [];
    const file = isFilePayload(envelope.message) && envelope.message.file;
    const actions = envelope.actions;
    const editedText = (Object.entries(actions?.updated || {}).pop() || []).shift() as string;

    if (props.messageRenderer && (props.filter ? props.filter(envelope) : true))
      return props.messageRenderer({ message: envelope, user, time, isOwn, editedText });

    return (
      <>
        <div className="pn-msg__avatar" style={{ backgroundColor: getPredefinedColor(uuid) }}>
          {user?.profileUrl ? (
            <img src={user.profileUrl} alt="User avatar" />
          ) : (
            getNameInitials(user?.name || uuid)
          )}
        </div>
        <div className="pn-msg__main">
          <div className="pn-msg__content">
            <div className="pn-msg__title">
              <span className="pn-msg__author">{user?.name || uuid}</span>
              <span className="pn-msg__time">{time}</span>
            </div>
            {message?.text &&
              (props.bubbleRenderer && (props.filter ? props.filter(envelope) : true) ? (
                props.bubbleRenderer({ message: envelope, user, time, isOwn, editedText })
              ) : (
                <div className="pn-msg__bubble">{editedText || message?.text}</div>
              ))}
          </div>
          <div className="pn-msg__extras">
            {file && file.name && renderFile(file)}
            {attachments.map(renderAttachment)}
            {props.enableReactions && renderReactions(envelope)}
          </div>
        </div>
      </>
    );
  };

  const renderReactions = (envelope: MessageEnvelope) => {
    const reactions = envelope.actions?.reaction;
    if (!reactions) return;

    return (
      <div className="pn-msg__reactions">
        {Object.keys(reactions).map((reaction) => {
          const instances = reactions[reaction];
          const instancesLimit = 99;
          const instancesLimited = instances.slice(0, instancesLimit);
          const instancesOverLimit = instances.length - instancesLimited.length;
          const userReaction = instances?.find((i) => i.uuid === pubnub.getUUID());
          const userNames = instancesLimited.map((i) => {
            const user = users.find((u) => u.id === i.uuid);
            return user ? user.name : i.uuid;
          });
          const tooltipContent = `
            ${userNames.join(", ")}
            ${instancesOverLimit ? `and ${instancesOverLimit} more` : ``}
          `;

          return (
            <div
              className={`pn-tooltip pn-msg__reaction ${
                userReaction ? "pn-msg__reaction--active" : ""
              }`}
              key={reaction}
              data-tooltip={tooltipContent}
              onClick={() => {
                userReaction
                  ? removeReaction(reaction, envelope.timetoken, userReaction.actionTimetoken)
                  : addReaction(reaction, envelope.timetoken);
              }}
            >
              {reaction} {instancesLimited.length}
              {instancesOverLimit ? "+" : ""}
            </div>
          );
        })}
      </div>
    );
  };

  const renderFile = (file: FileAttachment) => {
    return (
      <div className="pn-msg__file">
        {/\.(svg|gif|jpe?g|tiff?|png|webp|bmp)$/i.test(file.name) ? (
          <img
            alt={file.name}
            className="pn-msg__image"
            src={file.url}
            onLoad={() => {
              if (scrolledBottom) scrollToBottom();
            }}
          />
        ) : (
          <div className="pn-msg__bubble">
            <a
              className="pn-msg__nonImage"
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              {file.name}
              <DownloadIcon className="pn-msg__downloadIcon" />
            </a>
          </div>
        )}
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
        <div className="pn-msg-list__unread" onClick={() => endRef.current.scrollIntoView()}>
          {unreadMessages} new message{unreadMessages > 1 ? "s" : ""} <ArrowDownIcon />
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

        {props.children}

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
      </div>
    </div>
  );
};

MessageList.defaultProps = {
  enableReactions: false,
  fetchMessages: 0,
};
