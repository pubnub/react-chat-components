import React, { FC, Component, useEffect, useCallback, ReactNode } from "react";
import { useAtom, Provider } from "jotai";
import {
  BaseObjectsEvent,
  FileEvent,
  MessageActionEvent,
  PresenceEvent,
  SignalEvent,
  StatusEvent,
} from "pubnub";
import { usePubNub } from "pubnub-react";
import { MessageEnvelope, RetryOptions, Themes, UserEntity } from "../types";
import { cloneDeep, set as setDeep } from "lodash";
import {
  CurrentChannelAtom,
  ErrorFunctionAtom,
  MessagesAtom,
  MissingUserCallbackAtom,
  RequestMissingUserAtom,
  RetryFunctionAtom,
  SubscribeChannelGroupsAtom,
  SubscribeChannelsAtom,
  ThemeAtom,
  TypingIndicatorAtom,
  TypingIndicatorTimeoutAtom,
  UsersMetaAtom,
} from "../state-atoms";

export interface ChatProps {
  children?: ReactNode;
  /** General theme to be used by the components.
   * Exact looks can be tweaked later on with the use of CSS variables. */
  theme?: Themes;
  /** Current channel to display the messages and members from. */
  currentChannel: string;
  /** Array of channels to subscribe to get events. Allows up to 50 channels. Setting this option will disable the auto subscription when switching the current channel. */
  channels?: string[];
  /** Array of channel groups to subscribe to get events. Allows up to 50 channel groups. Setting this option will disable the auto subscription when switching the current channel group. */
  channelGroups?: string[];
  /** Option to disable presence events when set to "false." OccupancyIndicator and MemberList components will only work with memberships in that case. */
  enablePresence?: boolean;
  /** Option to provide an external list of user metadata. It's used to display information about senders on MessageList and TypingIndicator. */
  users?: UserEntity[];
  /** Pass a callback function that will be called to get a User metadata in case it's not passed to the users option */
  getUser?: (userId: string) => UserEntity | Promise<UserEntity>;
  /** Option to define a timeout in seconds for typing indicators to hide after the last typed character. */
  typingIndicatorTimeout?: number;
  /** Options for automatic retries on errors. */
  retryOptions?: RetryOptions;
  /** Callback run on new messages. */
  onMessage?: (message: MessageEnvelope) => unknown;
  /** Callback run on signals. */
  onSignal?: (message: SignalEvent) => unknown;
  /** Callback run on message actions. */
  onMessageAction?: (event: MessageActionEvent) => unknown;
  /** Callback run on presence events. */
  onPresence?: (event: PresenceEvent) => unknown;
  /** Callback run on object events. */
  onUser?: (event: BaseObjectsEvent) => unknown;
  /** Callback run on object events. */
  onChannel?: (event: BaseObjectsEvent) => unknown;
  /** Callback run on object events. */
  onMembership?: (event: BaseObjectsEvent) => unknown;
  /** Callback run on file events. */
  onFile?: (event: FileEvent) => unknown;
  /** Callback run on status events. */
  onStatus?: (event: StatusEvent) => unknown;
  /** Callback run on any type of errors raised by the components. */
  onError?: (error: Error) => unknown;
}

/**
 * Chat provider is used to configure various common options and feed the components with data.
 * It expects at least a "current" channel to display within components.
 *
 * Chat itself is supposed to be wrapped with a PubNubProvider component that is a part of the
 * PubNub React SDK. You should use it to pre-configure your PubNub instance. Please see Getting
 * Started page for details.
 */
export class Chat extends Component<ChatProps> {
  constructor(props: ChatProps) {
    super(props);
    this.state = { error: null };
  }

  static defaultProps = {
    channels: [],
    channelGroups: [],
    theme: "light" as const,
    enablePresence: true,
    typingIndicatorTimeout: 10,
    users: [],
    retryOptions: {
      maxRetries: 1,
      timeout: 0,
      exponentialFactor: 1,
    },
    onError: (): void => void 0,
  };

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  componentDidCatch(error: Error): void {
    if (this.props.onError) this.props.onError(error);
  }

  render(): JSX.Element {
    return (
      <Provider>
        <ChatInternal {...this.props}></ChatInternal>
      </Provider>
    );
  }
}

/**
 *
 *  Internal Chat wrapper with all business logic
 *
 */
export const ChatInternal: FC<ChatProps> = (props: ChatProps) => {
  const pubnub = usePubNub();
  const [, setMessages] = useAtom(MessagesAtom);
  const [, setTheme] = useAtom(ThemeAtom);
  const [, setErrorFunction] = useAtom(ErrorFunctionAtom);
  const [, setRetryFunction] = useAtom(RetryFunctionAtom);
  const [, setMissingUserCallback] = useAtom(MissingUserCallbackAtom);
  const [, requestMissingUser] = useAtom(RequestMissingUserAtom);
  const [, setTypingIndicator] = useAtom(TypingIndicatorAtom);
  const [, setTypingIndicatorTimeout] = useAtom(TypingIndicatorTimeoutAtom);
  const [usersMeta, setUsersMeta] = useAtom(UsersMetaAtom);
  const [currentChannel, setCurrentChannel] = useAtom(CurrentChannelAtom);
  const [channels, setChannels] = useAtom(SubscribeChannelsAtom);
  const [channelGroups, setChannelGroups] = useAtom(SubscribeChannelGroupsAtom);

  /**
   * Destructure props to easily pass them to dependency arrays
   */

  const {
    children: childrenProp,
    theme: themeProp = "light",
    currentChannel: currentChannelProp,
    channels: channelsProp = [],
    channelGroups: channelGroupsProp = [],
    enablePresence: enablePresenceProp,
    users: usersProp = [],
    getUser: getUserProp,
    typingIndicatorTimeout: typingIndicatorTimeoutProp = 10,
    retryOptions: retryOptionsProp,
    onMessage: onMessageProp,
    onSignal: onSignalProp,
    onMessageAction: onMessageActionProp,
    onPresence: onPresenceProp,
    onUser: onUserProp,
    onChannel: onChannelProp,
    onMembership: onMembershipProp,
    onFile: onFileProp,
    onStatus: onStatusProp,
    onError: onErrorProp = () => null,
  } = props;

  /**
   * Helpers
   */

  const retryOnError = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
      const { maxRetries, timeout, exponentialFactor } = retryOptionsProp as RetryOptions;
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await fn();
        } catch (error) {
          if (maxRetries === i + 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, timeout * exponentialFactor ** i));
        }
      }
    },
    [retryOptionsProp]
  );

  /**
   * Event handlers
   */

  const handleMessage = useCallback(
    (
      message: Required<Pick<MessageEnvelope, "channel" | "message" | "timetoken" | "publisher">>
    ) => {
      try {
        if (!usersMeta.find((u) => u.id === message.publisher))
          requestMissingUser(message.publisher);
        setMessages((messages) => {
          const messagesClone = cloneDeep(messages) || {};
          messagesClone[message.channel] = messagesClone[message.channel] || [];
          messagesClone[message.channel].push(message);
          return messagesClone;
        });

        if (onMessageProp) onMessageProp(message);
      } catch (e) {
        onErrorProp(e as Error);
      }
    },
    [onErrorProp, onMessageProp, requestMissingUser, setMessages, usersMeta]
  );

  const handleSignalEvent = useCallback(
    (signal: SignalEvent) => {
      try {
        if (["typing_on", "typing_off"].includes(signal.message.type)) {
          if (!usersMeta.find((u) => u.id === signal.publisher))
            requestMissingUser(signal.publisher);
          setTypingIndicator((indicators) => {
            const indicatorsClone = cloneDeep(indicators);
            const value = signal.message.type === "typing_on" ? signal.timetoken : null;
            setDeep(indicatorsClone, [signal.channel, signal.publisher], value);
            return indicatorsClone;
          });
        }

        if (onSignalProp) onSignalProp(signal);
      } catch (e) {
        onErrorProp(e as Error);
      }
    },
    [onErrorProp, onSignalProp, requestMissingUser, setTypingIndicator, usersMeta]
  );

  const handlePresenceEvent = useCallback(
    (event: PresenceEvent) => {
      try {
        if (onPresenceProp) onPresenceProp(event);
      } catch (e) {
        onErrorProp(e as Error);
      }
    },
    [onPresenceProp, onErrorProp]
  );

  const handleObjectsEvent = useCallback(
    (event: BaseObjectsEvent) => {
      try {
        if (event.message.type === "membership" && onMembershipProp) onMembershipProp(event);
        if (event.message.type === "channel" && onChannelProp) onChannelProp(event);
        if (event.message.type === "uuid" && onUserProp) onUserProp(event);
      } catch (e) {
        onErrorProp(e as Error);
      }
    },
    [onMembershipProp, onChannelProp, onUserProp, onErrorProp]
  );

  const handleAction = useCallback(
    (action: MessageActionEvent) => {
      try {
        if (!usersMeta.find((u) => u.id === action.publisher)) requestMissingUser(action.publisher);
        setMessages((messages) => {
          if (!messages || !messages[action.channel]) return messages;

          const { channel, event } = action;
          const { type, value, actionTimetoken, messageTimetoken, uuid } = action.data;
          const messagesClone = cloneDeep(messages);
          const message = messagesClone[channel].find((m) => m.timetoken === messageTimetoken);
          const actions = message?.actions?.[type]?.[value] || [];

          if (message && event === "added") {
            const newActions = [...actions, { uuid, actionTimetoken }];
            setDeep(message, ["actions", type, value], newActions);
          }

          if (message && event === "removed") {
            const newActions = actions.filter((a) => a.actionTimetoken !== actionTimetoken);
            newActions.length
              ? setDeep(message, ["actions", type, value], newActions)
              : delete message.actions?.[type]?.[value];
          }

          return messagesClone;
        });

        if (onMessageActionProp) onMessageActionProp(action);
      } catch (e) {
        onErrorProp(e as Error);
      }
    },
    [onErrorProp, onMessageActionProp, requestMissingUser, setMessages, usersMeta]
  );

  const handleFileEvent = useCallback(
    (event: FileEvent) => {
      try {
        if (!usersMeta.find((u) => u.id === event.publisher)) requestMissingUser(event.publisher);
        setMessages((messages) => {
          const { file, message, ...payload } = event;
          const newMessage = { ...payload, message: { file, message }, messageType: 4 };
          const messagesClone = cloneDeep(messages) || {};
          messagesClone[newMessage.channel] = messagesClone[newMessage.channel] || [];
          messagesClone[newMessage.channel].push(newMessage);
          return messagesClone;
        });

        if (onFileProp) onFileProp(event);
      } catch (e) {
        onErrorProp(e as Error);
      }
    },
    [onErrorProp, onFileProp, requestMissingUser, setMessages, usersMeta]
  );

  const handleStatusEvent = useCallback(
    (event: StatusEvent) => {
      try {
        if (onStatusProp) onStatusProp(event);
      } catch (e) {
        onErrorProp(e as Error);
      }
    },
    [onStatusProp, onErrorProp]
  );

  /**
   * Lifecycle: load updateable props
   */

  useEffect(() => {
    setUsersMeta(usersProp);
  }, [usersProp, setUsersMeta]);

  useEffect(() => {
    setTheme(themeProp);
  }, [themeProp, setTheme]);

  useEffect(() => {
    setCurrentChannel(currentChannelProp);
  }, [currentChannelProp, setCurrentChannel]);

  useEffect(() => {
    setChannels(channelsProp);
  }, [channelsProp, setChannels]);

  useEffect(() => {
    setChannelGroups(channelGroupsProp);
  }, [channelGroupsProp, setChannelGroups]);

  useEffect(() => {
    setTypingIndicatorTimeout(typingIndicatorTimeoutProp);
  }, [typingIndicatorTimeoutProp, setTypingIndicatorTimeout]);

  useEffect(() => {
    setErrorFunction({ function: (error) => onErrorProp(error) });
  }, [onErrorProp, setErrorFunction]);

  useEffect(() => {
    setRetryFunction({ function: (fn) => retryOnError(fn) });
  }, [retryOnError, setRetryFunction]);

  useEffect(() => {
    if (getUserProp) setMissingUserCallback({ function: (userId: string) => getUserProp(userId) });
  }, [getUserProp, setMissingUserCallback]);

  /**
   * Lifecycle: use currentChannel for subscriptions when neither channels nor channelGroups is passed
   */

  useEffect(() => {
    if (!currentChannel) return;
    if (!channels.includes(currentChannel) && !channelsProp.length && !channelGroupsProp.length) {
      setChannels([...channels, currentChannel]);
    }
  }, [currentChannel, channels, channelsProp.length, channelGroupsProp.length, setChannels]);

  /**
   * Lifecycle: setup correct subscriptions based on channels and channelGroups
   */

  useEffect(() => {
    if (!channels.length && !channelGroups.length) return;

    const currentSubscriptions = pubnub.getSubscribedChannels();
    const currentGroups = pubnub.getSubscribedChannelGroups();

    try {
      const newChannels = channels.filter((c) => !currentSubscriptions.includes(c));
      const oldChannels = currentSubscriptions.filter((c) => !channels.includes(c));

      const newGroups = channelGroups.filter((c) => !currentGroups.includes(c));
      const oldGroups = currentGroups.filter((c) => !channelGroups.includes(c));

      if (newChannels.length || newGroups.length) {
        pubnub.subscribe({
          channels: newChannels,
          channelGroups: newGroups,
          withPresence: enablePresenceProp,
        });
      }

      if (oldChannels.length || oldGroups.length) {
        pubnub.unsubscribe({
          channels: oldChannels,
          channelGroups: oldGroups,
        });
      }
    } catch (e) {
      onErrorProp(e as Error);
    }
  }, [channels, channelGroups, enablePresenceProp, onErrorProp, pubnub]);

  /**
   * Lifecycle: setup event listeners
   */

  useEffect(() => {
    if (!pubnub) return;

    const listener = {
      message: (
        m: Required<Pick<MessageEnvelope, "channel" | "message" | "timetoken" | "publisher">>
      ) => handleMessage(m),
      messageAction: (m: MessageActionEvent) => handleAction(m),
      presence: (e: PresenceEvent) => handlePresenceEvent(e),
      objects: (e: BaseObjectsEvent) => handleObjectsEvent(e),
      signal: (e: SignalEvent) => handleSignalEvent(e),
      file: (e: FileEvent) => handleFileEvent(e),
      status: (e: StatusEvent) => handleStatusEvent(e),
    };

    try {
      pubnub.addListener(listener);
    } catch (e) {
      onErrorProp(e as Error);
    }

    return () => {
      if (pubnub && pubnub.removeListener) {
        pubnub.removeListener(listener);
      }
    };
  }, [
    pubnub,
    handleMessage,
    handleAction,
    handlePresenceEvent,
    handleObjectsEvent,
    handleSignalEvent,
    handleFileEvent,
    handleStatusEvent,
    onErrorProp,
  ]);

  /**
   * Lifecycle: add telemetry config to PubNub instance
   */

  useEffect(() => {
    if (!pubnub) return;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (pubnub as any)._config._addPnsdkSuffix("chat-components", "__PLATFORM__/__VERSION__");
  }, [pubnub]);

  return <>{childrenProp}</>;
};
