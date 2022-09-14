import React, { ReactElement, FC, useRef, useState, useCallback, useEffect } from "react";
import {
  isFilePayload,
  MessageEnvelope,
  LinkAttachment,
  ImageAttachment,
  FileAttachment,
  CommonMessageListProps,
  useMessageListCore,
} from "chat-components-common";
import { getNameInitials, getPredefinedColor } from "chat-components-common";
import { useOuterClick } from "../helpers";
import SpinnerIcon from "../icons/spinner.svg";
import EmojiIcon from "../icons/emoji.svg";
import DownloadIcon from "../icons/download.svg";
import ArrowDownIcon from "../icons/arrow-down.svg";
import "./message-list.scss";

export type MessageListProps = CommonMessageListProps;

/**
 * Fetches historical messages using the scrolling pagination pattern and subscribes to the current
 * channel to stay up to date with new messages.
 *
 * It also displays data in an interactive list, including
 * user names, avatars, the time when a message was sent, and attachments (links, images) and allows to react to
 * messages with emojis and to show those reactions immediately.
 */
export const MessageList: FC<MessageListProps> = (props: MessageListProps) => {
  const {
    addReaction,
    channel,
    fetchMoreHistory,
    fetchingMessages,
    getTime,
    getUser,
    isOwnMessage,
    messages,
    onError,
    paginationEnd,
    prevChannel,
    prevMessages,
    pubnub,
    reactingToMessage,
    removeReaction,
    scrolledBottom,
    setReactingToMessage,
    setScrolledBottom,
    setUnreadMessages,
    theme,
    unreadMessages,
    users,
  } = useMessageListCore(props);

  const [picker, setPicker] = useState<ReactElement>();
  const [emojiPickerShown, setEmojiPickerShown] = useState(false);

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
  const scrollToBottom = useCallback(() => {
    if (!endRef.current) return;
    setScrolledBottom(true);
    endRef.current.scrollIntoView({ block: "end" });
  }, [setScrolledBottom]);

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

  /**
   * Event handlers
   */
  const handleSpinnerIntersection = async (isIntersecting: boolean) => {
    if (isIntersecting) {
      const firstMessage = listRef.current?.querySelector(".pn-msg");
      await fetchMoreHistory();
      if (firstMessage) firstMessage.scrollIntoView();
    }
  };

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

  /**
   * Lifecycle
   */

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
        <div className="pn-msg-list__unread" onClick={() => scrollToBottom()}>
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
