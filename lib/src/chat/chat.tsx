import React, { FC, Component, useEffect, useCallback, ReactNode } from "react";
import { useAtom, Provider } from "jotai";
import {
  BaseObjectsEvent,
  MessageActionEvent,
  PresenceEvent,
  SignalEvent,
  UUIDMetadataObject,
  ObjectCustom,
  FileEvent,
  StatusEvent,
} from "pubnub";
import { usePubNub } from "pubnub-react";
import { Themes, MessageEnvelope, RetryOptions } from "../types";
import cloneDeep from "lodash.clonedeep";
import setDeep from "lodash.set";
import {
  CurrentChannelAtom,
  MessagesAtom,
  SubscribeChannelsAtom,
  SubscribeChannelGroupsAtom,
  ThemeAtom,
  TypingIndicatorAtom,
  TypingIndicatorTimeoutAtom,
  UsersMetaAtom,
  RetryFunctionAtom,
  ErrorFunctionAtom,
} from "../state-atoms";
import "./chat.scss";

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
  users?: UUIDMetadataObject<ObjectCustom>[];
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
   * Helpers
   */
  const retryOnError = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      const { maxRetries, timeout, exponentialFactor } = props.retryOptions;
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await fn();
        } catch (error) {
          if (maxRetries === i + 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, timeout * exponentialFactor ** i));
        }
      }
    },
    [props.retryOptions]
  );

  /**
   * Lifecycle: load one-off props
   */
  useEffect(() => {
    (pubnub as any)._config._addPnsdkSuffix("chat-components", "RCC/__VERSION__");
  }, []);

  useEffect(() => {
    setTypingIndicatorTimeout(props.typingIndicatorTimeout);
  }, []);

  useEffect(() => {
    setUsersMeta(props.users);
  }, [props.users]);

  /**
   * Lifecycle: load updateable props
   */
  useEffect(() => {
    setTheme(props.theme);
  }, [props.theme]);

  useEffect(() => {
    setCurrentChannel(props.currentChannel);
  }, [props.currentChannel]);

  useEffect(() => {
    setChannels(props.channels);
  }, [props.channels]);

  useEffect(() => {
    setChannelGroups(props.channelGroups);
  }, [props.channelGroups]);

  useEffect(() => {
    setErrorFunction({ function: (error) => props.onError(error) });
  }, [props.onError]);

  useEffect(() => {
    setRetryFunction({ function: (fn) => retryOnError(fn) });
  }, [retryOnError]);

  /**
   * Lifecycle: react to state changes
   */
  useEffect(() => {
    if (!pubnub) return;
    setupListeners();

    /* Try to unsubscribe beofore window is unloaded */
    window.addEventListener("beforeunload", () => {
      pubnub.stop();
    });

    return () => {
      pubnub.stop();
    };
  }, [pubnub]);

  useEffect(() => {
    if (!currentChannel) return;
    if (
      !channels.includes(currentChannel) &&
      !props.channels.length &&
      !props.channelGroups.length
    ) {
      setChannels([...channels, currentChannel]);
    }
  }, [currentChannel]);

  useEffect(() => {
    if (!channels.length && !channelGroups.length) return;
    setupSubscriptions();
  }, [channels, channelGroups]);

  /**
   * Commands
   */
  const setupListeners = () => {
    try {
      pubnub.addListener({
        message: (m) => handleMessage(m),
        messageAction: (m) => handleAction(m),
        presence: (e) => handlePresenceEvent(e),
        objects: (e) => handleObjectsEvent(e),
        signal: (e) => handleSignalEvent(e),
        file: (e) => handleFileEvent(e),
        status: (e) => handleStatusEvent(e),
      });
    } catch (e) {
      props.onError(e);
    }
  };

  const setupSubscriptions = () => {
    try {
      const currentSubscriptions = pubnub.getSubscribedChannels();
      const newChannels = channels.filter((c) => !currentSubscriptions.includes(c));

      const currentGroups = pubnub.getSubscribedChannelGroups();
      const newGroups = channelGroups.filter((c) => !currentGroups.includes(c));

      if (newChannels.length || newGroups.length) {
        pubnub.subscribe({
          channels: newChannels,
          channelGroups: newGroups,
          withPresence: props.enablePresence,
        });
      }
    } catch (e) {
      props.onError(e);
    }
  };

  /**
   * Event handlers
   */
  const handleMessage = (message: MessageEnvelope) => {
    if (props.onMessage) props.onMessage(message);

    try {
      setMessages((messages) => {
        const messagesClone = cloneDeep(messages) || {};
        messagesClone[message.channel] = messagesClone[message.channel] || [];
        messagesClone[message.channel].push(message);
        return messagesClone;
      });
    } catch (e) {
      props.onError(e);
    }
  };

  const handleSignalEvent = (signal: SignalEvent) => {
    if (props.onSignal) props.onSignal(signal);

    try {
      if (["typing_on", "typing_off"].includes(signal.message.type)) {
        setTypingIndicator((indicators) => {
          const indicatorsClone = cloneDeep(indicators);
          const value = signal.message.type === "typing_on" ? signal.timetoken : null;
          setDeep(indicatorsClone, [signal.channel, signal.publisher], value);
          return indicatorsClone;
        });
      }
    } catch (e) {
      props.onError(e);
    }
  };

  const handlePresenceEvent = (event: PresenceEvent) => {
    if (props.onPresence) props.onPresence(event);
  };

  const handleObjectsEvent = (event: BaseObjectsEvent) => {
    if (event.message.type === "membership" && props.onMembership) props.onMembership(event);
    if (event.message.type === "channel" && props.onChannel) props.onChannel(event);
    if (event.message.type === "uuid" && props.onUser) props.onUser(event);
  };

  const handleAction = (action: MessageActionEvent) => {
    if (props.onMessageAction) props.onMessageAction(action);

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
    } catch (e) {
      props.onError(e);
    }
  };

  const handleFileEvent = (event: FileEvent) => {
    if (props.onFile) props.onFile(event);

    try {
      setMessages((messages) => {
        const { file, message, ...payload } = event;
        const newMessage = { ...payload, message: { file, message }, messageType: 4 };
        const messagesClone = cloneDeep(messages) || {};
        messagesClone[newMessage.channel] = messagesClone[newMessage.channel] || [];
        messagesClone[newMessage.channel].push(newMessage);
        return messagesClone;
      });
    } catch (e) {
      props.onError(e);
    }
  };

  const handleStatusEvent = (event: StatusEvent) => {
    if (props.onStatus) props.onStatus(event);
  };

  return <>{props.children}</>;
};
