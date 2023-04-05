import React, {
  FC,
  ReactElement,
  UIEvent,
  cloneElement,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  CommonMessageListProps,
  useMessageListCore,
  usePrevious,
} from "@pubnub/common-chat-components";
import {
  useOuterClick,
  useIntersectionObserver,
  useMutationObserver,
  useResizeObserver,
} from "../helpers";
import { EmojiPickerElementProps } from "../types";
import SpinnerIcon from "../icons/spinner.svg";
import ArrowDownIcon from "../icons/arrow-down.svg";
import { MessageListItem } from "./message-item";
import "./message-list.scss";

export type MessageListProps = CommonMessageListProps & {
  /** Option to pass in a component that will be used for picking message reactions. For more details, refer to the Message Reactions section in the docs. */
  reactionsPicker?: ReactElement<EmojiPickerElementProps>;
  /** Callback run on a list scroll. */
  onScroll?: (event: UIEvent<HTMLDivElement>) => void;
};

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
    emojiPickerShown,
    fetchHistory,
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
    setEmojiPickerShown,
    setReactingToMessage,
    setScrolledBottom,
    setUnreadMessages,
    theme,
    unreadMessages,
    users,
    initMessagesLoaded,
  } = useMessageListCore(props);

  const lastMessageUniqueReactions = Object.keys(messages.slice(-1)[0]?.actions?.reaction || {});
  const prevLastMessageUniqueReactions = usePrevious(lastMessageUniqueReactions);

  const endRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useOuterClick(handleCloseReactions);

  const isSpinnerVisible = useIntersectionObserver(spinnerRef)?.isIntersecting;
  const wasSpinnerVisible = usePrevious(isSpinnerVisible);
  const isBottomVisible = useIntersectionObserver(endRef)?.isIntersecting;
  const mutationEntry = useMutationObserver(listRef, { childList: true });
  const resizeEntry = useResizeObserver(listRef);

  const welcomeMessages =
    props.welcomeMessages &&
    (Array.isArray(props.welcomeMessages) ? props.welcomeMessages : [props.welcomeMessages]);

  /*
  /* Commands
  */
  const scrollToBottom = useCallback(() => {
    if (!listRef.current || !listRef.current.scroll) return;
    setScrolledBottom(true);
    listRef.current.scroll({ top: listRef.current.scrollHeight });
  }, [setScrolledBottom]);

  /**
   * Event handlers
   */
  function handleOpenReactions(event: React.MouseEvent, timetoken) {
    try {
      const pickerEl = pickerRef.current;
      const listEl = listRef.current;
      const listRect = listEl.getBoundingClientRect();
      const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
      let newPickerTopPosition = listEl.scrollTop - listRect.top + buttonRect.y;
      if (newPickerTopPosition + pickerEl.offsetHeight > listEl.scrollHeight) {
        newPickerTopPosition += buttonRect.height;
        newPickerTopPosition -= pickerEl.offsetHeight;
      }
      pickerEl.style.top = `${newPickerTopPosition}px`;
      setReactingToMessage(timetoken);
      setEmojiPickerShown(true);
    } catch (e) {
      onError(e);
    }
  }

  function handleCloseReactions(event) {
    if ((event.target as Element).closest(".pn-msg__reactions-toggle")) return;
    if (pickerRef.current) pickerRef.current.style.top = "0px";
    setEmojiPickerShown(false);
  }

  function handleEmojiInsertion(emoji: { native: string }) {
    try {
      if (!("native" in emoji)) return;
      addReaction(emoji.native, reactingToMessage);
      setEmojiPickerShown(false);
    } catch (e) {
      onError(e);
    }
  }

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (!isSpinnerVisible || wasSpinnerVisible || !initMessagesLoaded[channel] || fetchingMessages)
      return;
    fetchMoreHistory();

    async function fetchMoreHistory() {
      const firstMessage = listRef.current?.querySelector(".pn-msg") as HTMLDivElement;
      await fetchHistory();
      if (firstMessage && listRef.current?.scroll)
        listRef.current?.scroll({ top: firstMessage.offsetTop });
    }
  }, [
    fetchHistory,
    isSpinnerVisible,
    wasSpinnerVisible,
    initMessagesLoaded,
    channel,
    fetchingMessages,
  ]);

  useEffect(() => {
    if (isBottomVisible) setUnreadMessages(0);
    setScrolledBottom(isBottomVisible);
  }, [isBottomVisible, setScrolledBottom, setUnreadMessages]);

  useEffect(() => {
    if (scrolledBottom && mutationEntry?.addedNodes?.length) scrollToBottom();
  }, [mutationEntry, scrollToBottom, scrolledBottom]);

  useEffect(() => {
    if (scrolledBottom && resizeEntry) scrollToBottom();
  }, [resizeEntry, scrollToBottom, scrolledBottom]);

  useEffect(() => {
    if (!scrolledBottom) return;
    if (prevMessages.length !== messages.length) scrollToBottom();
    if (prevChannel !== channel) scrollToBottom();
    if (lastMessageUniqueReactions.length !== prevLastMessageUniqueReactions.length)
      scrollToBottom();
  }, [
    channel,
    lastMessageUniqueReactions.length,
    messages.length,
    prevChannel,
    prevLastMessageUniqueReactions.length,
    prevMessages.length,
    scrollToBottom,
    scrolledBottom,
  ]);

  const messageItemProps = {
    addReaction,
    emojiPickerShown,
    getTime,
    getUser,
    handleOpenReactions,
    isOwnMessage,
    listProps: {
      bubbleRenderer: props.bubbleRenderer,
      enableReactions: props.enableReactions,
      extraActionsRenderer: props.extraActionsRenderer,
      fileRenderer: props.fileRenderer,
      filter: props.filter,
      messageRenderer: props.messageRenderer,
      reactionsPicker: props.reactionsPicker,
    },
    pubnub,
    reactingToMessage,
    removeReaction,
    scrollToBottom,
    scrolledBottom,
    setEmojiPickerShown,
    users,
  };

  return (
    <div className={`pn-msg-list pn-msg-list--${theme}`}>
      {unreadMessages > 0 && (
        <div className="pn-msg-list__unread" onClick={() => scrollToBottom()}>
          {unreadMessages} new message{unreadMessages > 1 ? "s" : ""} <ArrowDownIcon />
        </div>
      )}

      <div className="pn-msg-list-scroller" onScroll={props.onScroll} ref={listRef}>
        <span ref={spinnerRef} className="pn-msg-list__spinner">
          {!!props.fetchMessages && !paginationEnd && <SpinnerIcon />}
        </span>

        <div className="pn-msg-list__spacer" />

        {(!props.fetchMessages || (!fetchingMessages && !messages.length)) &&
          welcomeMessages &&
          welcomeMessages.map((m) => (
            <MessageListItem key={m.timetoken} envelope={m} {...messageItemProps} />
          ))}

        {messages &&
          messages.map((m) => (
            <MessageListItem key={m.timetoken} envelope={m} {...messageItemProps} />
          ))}

        {props.children}

        <div className="pn-msg-list__bottom-ref">
          <div ref={endRef}></div>
        </div>

        {props.reactionsPicker && (
          <div
            className={`pn-msg-list__emoji-picker ${
              !emojiPickerShown && "pn-msg-list__emoji-picker-hidden"
            }`}
            ref={pickerRef}
          >
            {cloneElement(props.reactionsPicker, { onEmojiSelect: handleEmojiInsertion })}
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
