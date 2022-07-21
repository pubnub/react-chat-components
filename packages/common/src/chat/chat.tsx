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
import cloneDeep from "lodash.clonedeep";
import setDeep from "lodash.set";
import {
  CurrentChannelAtom,
  ErrorFunctionAtom,
  MessagesAtom,
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
    onError: (): void => null,
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
  const [, setTypingIndicator] = useAtom(TypingIndicatorAtom);
  const [, setTypingIndicatorTimeout] = useAtom(TypingIndicatorTimeoutAtom);
  const [, setUsersMeta] = useAtom(UsersMetaAtom);
  const [currentChannel, setCurrentChannel] = useAtom(CurrentChannelAtom);
  const [channels, setChannels] = useAtom(SubscribeChannelsAtom);
  const [channelGroups, setChannelGroups] = useAtom(SubscribeChannelGroupsAtom);

  /**
   * Destructure props to easily pass them to dependency arrays
   */

  const {
    children: childrenProp,
    theme: themeProp,
    currentChannel: currentChannelProp,
    channels: channelsProp,
    channelGroups: channelGroupsProp,
    enablePresence: enablePresenceProp,
    users: usersProp,
    typingIndicatorTimeout: typingIndicatorTimeoutProp,
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
    onError: onErrorProp,
  } = props;

  /**
   * Helpers
   */

  const retryOnError = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      const { maxRetries, timeout, exponentialFactor } = retryOptionsProp;
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
    (message: MessageEnvelope) => {
      try {
        setMessages((messages) => {
          const messagesClone = cloneDeep(messages) || {};
          messagesClone[message.channel] = messagesClone[message.channel] || [];
          messagesClone[message.channel].push(message);
          return messagesClone;
        });

        if (onMessageProp) onMessageProp(message);
      } catch (e) {
        onErrorProp(e);
      }
    },
    [onMessageProp, onErrorProp, setMessages]
  );

  const handleSignalEvent = useCallback(
    (signal: SignalEvent) => {
      try {
        if (["typing_on", "typing_off"].includes(signal.message.type)) {
          setTypingIndicator((indicators) => {
            const indicatorsClone = cloneDeep(indicators);
            const value = signal.message.type === "typing_on" ? signal.timetoken : null;
            setDeep(indicatorsClone, [signal.channel, signal.publisher], value);
            return indicatorsClone;
          });
        }

        if (onSignalProp) onSignalProp(signal);
      } catch (e) {
        onErrorProp(e);
      }
    },
    [onSignalProp, onErrorProp, setTypingIndicator]
  );

  const handlePresenceEvent = useCallback(
    (event: PresenceEvent) => {
      try {
        if (onPresenceProp) onPresenceProp(event);
      } catch (e) {
        onErrorProp(e);
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
        onErrorProp(e);
      }
    },
    [onMembershipProp, onChannelProp, onUserProp, onErrorProp]
  );

  const handleAction = useCallback(
    (action: MessageActionEvent) => {
      try {
        setMessages((messages) => {
          if (!messages || !messages[action.channel]) return;

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
              : delete message.actions[type][value];
          }

          return messagesClone;
        });

        if (onMessageActionProp) onMessageActionProp(action);
      } catch (e) {
        onErrorProp(e);
      }
    },
    [onMessageActionProp, onErrorProp, setMessages]
  );

  const handleFileEvent = useCallback(
    (event: FileEvent) => {
      try {
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
        onErrorProp(e);
      }
    },
    [onFileProp, onErrorProp, setMessages]
  );

  const handleStatusEvent = useCallback(
    (event: StatusEvent) => {
      try {
        if (onStatusProp) onStatusProp(event);
      } catch (e) {
        onErrorProp(e);
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

  /**
   * Lifecycle: use currentChannel for subscriptions when neither channels or channelGroups is passed
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
      onErrorProp(e);
    }
  }, [channels, channelGroups, enablePresenceProp, onErrorProp, pubnub]);

  /**
   * Lifecycle: setup event listeners
   */

  useEffect(() => {
    if (!pubnub) return;

    const listener = {
      message: (m) => handleMessage(m),
      messageAction: (m) => handleAction(m),
      presence: (e) => handlePresenceEvent(e),
      objects: (e) => handleObjectsEvent(e),
      signal: (e) => handleSignalEvent(e),
      file: (e) => handleFileEvent(e),
      status: (e) => handleStatusEvent(e),
    };

    try {
      pubnub.addListener(listener);
    } catch (e) {
      onErrorProp(e);
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
    (pubnub as any)._config._addPnsdkSuffix("chat-components", "RCC/__VERSION__");
  }, [pubnub]);

  return <>{childrenProp}</>;
};
