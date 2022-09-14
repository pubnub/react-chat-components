import { ReactElement, ReactNode, UIEvent, useCallback, useEffect, useState } from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { FetchMessagesResponse } from "pubnub";
import { usePubNub } from "pubnub-react";
import { useAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { isFilePayload, UserEntity, MessageEnvelope, EmojiPickerElementProps } from "../types";
import { usePrevious } from "../helpers";
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
  onScroll?: (event: UIEvent<HTMLElement> | NativeSyntheticEvent<NativeScrollEvent>) => unknown;
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
  const prevChannel = usePrevious(channel);
  const [users] = useAtom(UsersMetaAtom);
  const [theme] = useAtom(ThemeAtom);
  const [retryObj] = useAtom(RetryFunctionAtom);
  const [onErrorObj] = useAtom(ErrorFunctionAtom);
  const [messages] = useAtom(CurrentChannelMessagesAtom);
  const prevMessages = usePrevious(messages);
  const [paginationEnd] = useAtom(CurrentChannelPaginationAtom);
  const retry = retryObj.function;
  const onError = onErrorObj.function;

  const [scrolledBottom, setScrolledBottom] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [reactingToMessage, setReactingToMessage] = useState(null);

  /*
  /* Helper functions
  */

  const getTime = (timestamp: number) => {
    const ts = String(timestamp);
    const date = new Date(parseInt(ts) / 10000);
    return date.toLocaleTimeString([], { timeStyle: "short" });
    /* toLocaleTimeString internally uses Intl API if available
     * Otherwise the options passed to it will be ignored (e.g. on Android devices) */
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

  /** useAtomCallback to accesses jotai atoms inside of a Intersection Observer callback */
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

  useEffect(() => {
    if (!pubnub || !channel) return;
    if (channel === prevChannel) return;
    if (!messages?.length) fetchHistory();
  }, [channel, fetchHistory, messages?.length, prevChannel, pubnub]);

  useEffect(() => {
    if (!messages?.length) return;
    if (messages.length - prevMessages.length === 1) setUnreadMessages(unreadMessages + 1);
  }, [messages.length, prevMessages.length, unreadMessages]);

  return {
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
  };
};
