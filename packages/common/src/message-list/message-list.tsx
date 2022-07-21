import React, {
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
import { isFilePayload, UserEntity, MessageEnvelope, EmojiPickerElementProps } from "../types";
import {
  CurrentChannelAtom,
  CurrentChannelMessagesAtom,
  CurrentChannelPaginationAtom,
  ErrorFunctionAtom,
  RetryFunctionAtom,
  ThemeAtom,
  UsersMetaAtom,
} from "../state-atoms";

export interface MessageRendererProps {
  isOwn: boolean;
  message: MessageEnvelope;
  time: string;
  editedText: string;
  user?: UserEntity;
}

export interface CommonMessageListProps {
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
export const useMessageListCore = (props: CommonMessageListProps) => {
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

  // const endRef = useRef<HTMLDivElement>(null);
  // const listRef = useRef<HTMLDivElement>(null);
  // const spinnerRef = useRef<HTMLDivElement>(null);
  // const pickerRef = useOuterClick((event) => {
  //   if ((event.target as Element).closest(".pn-msg__reactions-toggle")) return;
  //   setEmojiPickerShown(false);
  // });
  // const listSizeObserver = useRef(new ResizeObserver(() => handleListMutations()));
  // const listMutObserver = useRef(new MutationObserver(() => handleListMutations()));
  // const spinnerIntObserver = useRef(
  //   new IntersectionObserver((e) => e[0].isIntersecting === true && fetchMoreHistory())
  // );
  // const bottomIntObserver = useRef(
  //   new IntersectionObserver((e) => handleBottomIntersection(e[0].isIntersecting))
  // );

  /*
  /* Helper functions
  */

  const getTime = (timestamp: number) => {
    const ts = String(timestamp);
    const date = new Date(parseInt(ts) / 10000);
    const formatter = new Intl.DateTimeFormat([], { timeStyle: "short" });
    return formatter.format(date);
  };

  const scrollToBottom = () => {
    // if (!endRef.current) return;
    setScrolledBottom(true);
    // endRef.current.scrollIntoView({ block: "end" });
  };

  const setupSpinnerObserver = () => {
    // if (!spinnerRef.current) return;
    // spinnerIntObserver.current.observe(spinnerRef.current);
  };

  const setupBottomObserver = () => {
    // if (!endRef.current) return;
    // bottomIntObserver.current.disconnect();
    // bottomIntObserver.current.observe(endRef.current);
  };

  const setupListObservers = () => {
    // if (!listRef.current) return;
    // listSizeObserver.current.disconnect();
    // listSizeObserver.current.observe(listRef.current);
    // listMutObserver.current.disconnect();
    // listMutObserver.current.observe(listRef.current, { childList: true });
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
      // const firstMessage = listRef.current?.querySelector(".pn-msg");

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
        // if (firstMessage) firstMessage.scrollIntoView();
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

  const fetchFileUrl = (envelope: MessageEnvelope) => {
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

  const handleHistoryFetch = useAtomCallback(
    useCallback((get, set, response: FetchMessagesResponse) => {
      const channel = get(CurrentChannelAtom);
      const messages = get(CurrentChannelMessagesAtom);
      const newMessages =
        ((response?.channels[channel] || []).map((m) =>
          m.messageType === 4 ? fetchFileUrl(m) : m
        ) as MessageEnvelope[]) || [];
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
      // let newPickerTopPosition =
      //   listRef.current.scrollTop -
      //   listRef.current.getBoundingClientRect().top +
      //   (event.target as HTMLElement).getBoundingClientRect().y;
      // if (newPickerTopPosition > pickerRef.current.offsetHeight) {
      //   newPickerTopPosition += (event.target as HTMLElement).getBoundingClientRect().height;
      //   newPickerTopPosition -= pickerRef.current.offsetHeight;
      // }
      // pickerRef.current.style.top = `${newPickerTopPosition}px`;

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
    if (!messages?.length) fetchHistory();
    setupSpinnerObserver();
    setupListObservers();
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

  return {
    addReaction,
    emojiPickerShown,
    // endRef,
    fetchingMessages,
    getTime,
    getUser,
    handleOpenReactions,
    isOwnMessage,
    // listRef,
    messages,
    paginationEnd,
    picker,
    // pickerRef,
    pubnub,
    reactingToMessage,
    removeReaction,
    scrollToBottom,
    scrolledBottom,
    setEmojiPickerShown,
    // spinnerRef,
    theme,
    unreadMessages,
    users,
  };
};
