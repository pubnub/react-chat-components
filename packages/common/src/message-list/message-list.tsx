import { ReactNode, useCallback, useEffect, useState } from "react";
import { usePubNub } from "pubnub-react";
import { useAtom, useSetAtom } from "jotai";
import { UserEntity, MessageEnvelope, FileAttachment, ProperFetchMessagesResponse } from "../types";
import { usePrevious, isFilePayload } from "../helpers";
import {
  CurrentChannelAtom,
  CurrentChannelMessagesAtom,
  CurrentChannelPaginationAtom,
  ErrorFunctionAtom,
  RequestMissingUserAtom,
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
  /** Set this option to a non-zero value to enable fetching messages from the History API. This feature uses the infinite scrolling pattern and takes a maximum value of 25. */
  fetchMessages?: number;
  /** Option to enable rendering reactions that were added to messages. Make sure to also set up reactionsPicker when this option is enabled. */
  enableReactions?: boolean;
  /** Option to provide custom welcome messages to replace the default ones. Set to "false" to disable it. */
  welcomeMessages?: false | MessageEnvelope | MessageEnvelope[];
  /** Option to provide an extra actions renderer to add custom action buttons to each message. */
  extraActionsRenderer?: (message: MessageEnvelope) => JSX.Element;
  /** Option to provide a custom message item renderer if themes and CSS variables aren't enough. */
  messageRenderer?: (props: MessageRendererProps) => JSX.Element;
  /** Option to provide a custom message bubble renderer if themes and CSS variables aren't enough. */
  bubbleRenderer?: (props: MessageRendererProps) => JSX.Element;
  /** Option to provide a custom file renderer to change how images and other files are shown. */
  fileRenderer?: (file: FileAttachment) => JSX.Element;
  /** This option only works when you use either `messageRenderer` or `bubbleRenderer`. It allows you to apply one of the custom renderers only to the messages selected by the filter. */
  filter?: (message: MessageEnvelope) => boolean;
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
  const requestMissingUser = useSetAtom(RequestMissingUserAtom);
  const [theme] = useAtom(ThemeAtom);
  const [retryObj] = useAtom(RetryFunctionAtom);
  const [onErrorObj] = useAtom(ErrorFunctionAtom);
  const [messages, setMessages] = useAtom(CurrentChannelMessagesAtom);
  const prevMessages = usePrevious(messages);
  const [paginationEnd, setPaginationEnd] = useAtom(CurrentChannelPaginationAtom);
  const retry = retryObj.function;
  const onError = onErrorObj.function;

  const [scrolledBottom, setScrolledBottom] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [reactingToMessage, setReactingToMessage] = useState(null);
  const [emojiPickerShown, setEmojiPickerShown] = useState(false);
  // https://pubnub.atlassian.net/browse/UI-1843
  const [initMessagesLoaded, setInitMessagesLoaded] = useState({});

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

  const fetchHistory = useCallback(async () => {
    if (!props.fetchMessages || paginationEnd) return;
    setFetchingMessages(true);
    try {
      const options = {
        channels: [channel],
        count: props.fetchMessages,
        start: (messages?.[0]?.timetoken as number) || undefined,
        includeMessageActions: true,
        includeMeta: true,
      };
      const response = (await retry(() =>
        pubnub.fetchMessages(options)
      )) as ProperFetchMessagesResponse;
      const newMessages = (response?.channels[channel] || []).map((m) => {
        if (!users.find((u) => u.id === m.uuid)) requestMissingUser(m.uuid);
        const reactions = m.actions?.reaction;
        if (reactions) {
          Object.values(reactions)
            .flat()
            .forEach((r) => {
              if (!users.find((u) => u.id === r.uuid)) requestMissingUser(r.uuid);
            });
        }
        return m.messageType === 4 ? fetchFileUrl(m) : m;
      }) as MessageEnvelope[];
      const allMessages = [...messages, ...newMessages].sort(
        (a, b) => (a.timetoken as number) - (b.timetoken as number)
      );
      setMessages(allMessages);
      setPaginationEnd(
        !response.more && (!allMessages.length || newMessages.length !== props.fetchMessages)
      );
    } catch (e) {
      onError(e);
    } finally {
      setFetchingMessages(false);
    }
  }, [
    channel,
    fetchFileUrl,
    messages,
    onError,
    paginationEnd,
    props.fetchMessages,
    pubnub,
    requestMissingUser,
    retry,
    setMessages,
    setPaginationEnd,
    users,
  ]);

  const addReaction = async (reaction: string, messageTimetoken: string | number) => {
    try {
      await pubnub.addMessageAction({
        channel,
        messageTimetoken: String(messageTimetoken),
        action: {
          type: "reaction",
          value: reaction,
        },
      });
    } catch (e) {
      onError(e);
    }
  };

  const removeReaction = async (reaction: string, messageTimetoken, actionTimetoken) => {
    try {
      await pubnub.removeMessageAction({ channel, messageTimetoken, actionTimetoken });
    } catch (e) {
      onError(e);
    }
  };

  useEffect(() => {
    if (!pubnub || !channel) return;
    if (channel === prevChannel) return;
    if (!initMessagesLoaded[channel]) {
      fetchHistory().then(() => {
        setInitMessagesLoaded((curr) => ({ ...curr, [channel]: true }));
      });
    }
  }, [channel, fetchHistory, initMessagesLoaded, messages.length, prevChannel, pubnub]);

  useEffect(() => {
    if (!messages?.length || scrolledBottom) return;
    if (messages.length - prevMessages.length !== 1) return;
    if (Number(messages.slice(-1)[0]?.timetoken) > Number(prevMessages.slice(-1)[0]?.timetoken))
      setUnreadMessages((unread) => unread + 1);
  }, [messages, prevMessages, scrolledBottom]);

  return {
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
  };
};
