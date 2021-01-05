import React, { FC, useEffect, ReactNode } from "react";
import { RecoilRoot, useRecoilState, useSetRecoilState } from "recoil";
import PubNub, {
  BaseObjectsEvent,
  MessageActionEvent,
  PresenceEvent,
  SignalEvent,
  UserData,
} from "pubnub";
import { PickerProps } from "emoji-mart";
import { Themes, Message, Channel } from "../types";
import { getAllPubnubUsers, getAllPubnubChannels, getPubnubChannelMembers } from "../commands";
import { setDeep, cloneDeep } from "../helpers";
import {
  ChannelsMetaAtom,
  CurrentChannelAtom,
  CurrentChannelMembershipsAtom,
  CurrentChannelOccupancyAtom,
  CurrentUserMembershipsAtom,
  EmojiMartOptionsAtom,
  MessagesAtom,
  OccupancyAtom,
  PubnubAtom,
  SubscribeChannelsAtom,
  ThemeAtom,
  TypingIndicatorAtom,
  TypingIndicatorTimeoutAtom,
  UsersMetaAtom,
} from "../state-atoms";

/**
 * Chat wrapper is used to configure various common options and feed the components with data.
 * It expects at least a configured PubNub object and a "current" channel to display within components.
 */
export interface ChatProps {
  children?: ReactNode;
  /** Reference to `pubnubClient` with config for publish key, subscribe key and uuid. */
  pubnub: PubNub;
  /** A general theme to be used by the components.
   * Exact looks can be tweaked later on with the use of CSS variables. */
  theme?: Themes;
  /** A "current" channel to display the messages and members from. */
  channel: string;
  /** Array of channels to subscribe to get events. Allows up to 50 channels. */
  subscribeChannels?: string[];
  /** By default the components will fetch metadata for users, channels and memberships from PubNub Objects. */
  objects?: boolean;
  /** Set to false to disable presence events. OccupancyIndicator and MemberList component will only work with memberships in that case. */
  presence?: boolean;
  /** Provide external list of user metadata. */
  userList?: UserData[];
  /** Provide external list of channel metadata. */
  channelList?: Channel[];
  /** Define a timeout in seconds for typing indicators to hide after last types character */
  typingIndicatorTimeout?: number;
  /** Pass options to emoji-mart picker. */
  emojiMartOptions?: PickerProps;
  /** A callback run on new messages. */
  onMessage?: (message: Message) => unknown;
  /** A callback run on presence events. */
  onPresence?: (event: PresenceEvent) => unknown;
}

export const Chat: FC<ChatProps> = (props: ChatProps) => {
  return (
    <RecoilRoot>
      <ChatInternal {...props}></ChatInternal>
    </RecoilRoot>
  );
};

Chat.defaultProps = {
  emojiMartOptions: { emoji: "", title: "", native: true },
  objects: true,
  subscribeChannels: [],
  theme: "light" as const,
  presence: true,
  typingIndicatorTimeout: 10,
  userList: [],
  channelList: [],
};

/**
 *
 *  Internal Chat wrapper with all business logic
 *
 */
export const ChatInternal: FC<ChatProps> = (props: ChatProps) => {
  const setChannelsMeta = useSetRecoilState(ChannelsMetaAtom);
  const setEmojiMartOptions = useSetRecoilState(EmojiMartOptionsAtom);
  const setJoinedChannels = useSetRecoilState(CurrentUserMembershipsAtom);
  const setMessages = useSetRecoilState(MessagesAtom);
  const setOccupancy = useSetRecoilState(OccupancyAtom);
  const setTheme = useSetRecoilState(ThemeAtom);
  const setTypingIndicator = useSetRecoilState(TypingIndicatorAtom);
  const setUsersMeta = useSetRecoilState(UsersMetaAtom);
  const [currentChannel, setCurrentChannel] = useRecoilState(CurrentChannelAtom);
  const [members, setMembers] = useRecoilState(CurrentChannelMembershipsAtom);
  const [presentMembers, setPresentMembers] = useRecoilState(CurrentChannelOccupancyAtom);
  const [pubnub, setPubnub] = useRecoilState(PubnubAtom);
  const [subscribeChannels, setSubscribeChannels] = useRecoilState(SubscribeChannelsAtom);
  const [typingIndicatorTimeout, setTypingIndicatorTimeout] = useRecoilState(
    TypingIndicatorTimeoutAtom
  );

  /**
   * Lifecycle: load one-off props
   */
  useEffect(() => {
    setPubnub(props.pubnub);
    setUsersMeta(props.userList);
    setChannelsMeta(props.channelList);
    setTheme(props.theme);
    setEmojiMartOptions(props.emojiMartOptions);
    setTypingIndicatorTimeout(props.typingIndicatorTimeout);
  }, []);

  /**
   * Lifecycle: load updateable props
   */
  useEffect(() => {
    setCurrentChannel(props.channel);
  }, [props.channel]);

  useEffect(() => {
    setSubscribeChannels(props.subscribeChannels);
  }, [props.subscribeChannels]);

  /**
   * Lifecycle: react to state changes
   */
  useEffect(() => {
    if (!pubnub) return;
    if (props.objects) fetchAllMetadata();
    setupListeners();

    // Try to unsubscribe beofore window is unloaded
    window.addEventListener("beforeunload", () => {
      pubnub.stop();
    });

    return () => {
      pubnub.stop();
    };
  }, [pubnub]);

  useEffect(() => {
    if (!currentChannel) return;
    if (!subscribeChannels.includes(currentChannel)) {
      setSubscribeChannels([...subscribeChannels, currentChannel]);
    }
    if (!members.length) fetchMembers();
    if (!presentMembers.length && props.presence) fetchPresence();
  }, [currentChannel]);

  useEffect(() => {
    if (!subscribeChannels.length) return;
    setupSubscriptions();
  }, [subscribeChannels]);

  /**
   * Commands
   */
  const setupListeners = () => {
    pubnub.addListener({
      message: (m) => handleMessage(m),
      messageAction: (m) => handleAction(m),
      presence: (e) => handlePresenceEvent(e),
      objects: (e) => handleObjectsEvent(e),
      signal: (e) => handleSignalEvent(e),
    });
  };

  const setupSubscriptions = () => {
    const currentSubscriptions = pubnub.getSubscribedChannels();
    const userChannel = pubnub.getUUID();
    const newChannels = subscribeChannels.filter((c) => !currentSubscriptions.includes(c));

    if (!currentSubscriptions.includes(userChannel)) {
      pubnub.subscribe({ channels: [userChannel] });
    }

    if (newChannels.length) {
      pubnub.subscribe({ channels: newChannels, withPresence: props.presence });
    }
  };

  const fetchAllMetadata = async () => {
    const users = await getAllPubnubUsers(pubnub);
    setUsersMeta((existingUsers) => {
      const existingUsersIds = existingUsers.map((u) => u.id);
      const newUsers = users.filter((u) => !existingUsersIds.includes(u.id));
      return [...existingUsers, ...newUsers];
    });

    const channels = await getAllPubnubChannels(pubnub);
    setChannelsMeta((existingChannels) => {
      const existingChannelsIds = existingChannels.map((user) => user.id);
      const newChannels = channels.filter((u) => !existingChannelsIds.includes(u.id));
      return [...existingChannels, ...newChannels];
    });
  };

  const fetchMembers = async () => {
    const members = await getPubnubChannelMembers(pubnub, currentChannel);
    setMembers(members);
  };

  const fetchPresence = async () => {
    const response = await pubnub.hereNow({ channels: [currentChannel] });
    const presentMembers = response.channels[currentChannel].occupants.map((u) => u.uuid);
    setPresentMembers(presentMembers);
  };

  /**
   * Event handlers
   */
  const handleMessage = (message: Message) => {
    if (props.onMessage) props.onMessage(message);
    setMessages((messages) => {
      const messagesClone = cloneDeep(messages);
      messagesClone[message.channel].push(message);
      return messagesClone;
    });
  };

  const handleSignalEvent = async (signal: SignalEvent) => {
    if (["typing_on", "typing_off"].includes(signal.message.type)) {
      setTypingIndicator((indicators) => {
        const indicatorsClone = cloneDeep(indicators);
        const value = signal.message.type === "typing_on" ? signal.timetoken : null;
        setDeep(indicatorsClone, [signal.channel, signal.publisher], value);
        return indicatorsClone;
      });

      setTimeout(() => {
        setTypingIndicator((indicators) => {
          const indicatorsClone = cloneDeep(indicators);
          setDeep(indicatorsClone, [signal.channel, signal.publisher], null);
          return indicatorsClone;
        });
      }, typingIndicatorTimeout * 1000);
    }
  };

  const handlePresenceEvent = (event: PresenceEvent) => {
    if (props.onPresence) props.onPresence(event);

    setOccupancy((occupancy) => {
      const occupancyClone = cloneDeep(occupancy);
      if (event.action === "join" && !occupancyClone[event.channel].includes(event.uuid)) {
        occupancyClone[event.channel].push(event.uuid);
      }
      if (
        ["leave", "timeout"].includes(event.action) &&
        occupancyClone[event.channel].includes(event.uuid)
      ) {
        occupancyClone[event.channel] = occupancyClone[event.channel].filter(
          (id) => id !== event.uuid
        );
      }
      return occupancyClone;
    });
  };

  const handleObjectsEvent = (event: BaseObjectsEvent) => {
    const message = event.message;
    const eventChannel = message.data.channel.id;

    if (message.type == "membership" && message.data.uuid.id == pubnub.getUUID()) {
      setJoinedChannels((joinedChannels) => {
        let joinedChannelsClone = cloneDeep(joinedChannels);
        if (message.event === "set" && !joinedChannelsClone.includes(eventChannel)) {
          joinedChannelsClone.push(eventChannel);
        }
        if (message.event === "delete" && joinedChannelsClone.includes(eventChannel)) {
          joinedChannelsClone = joinedChannelsClone.filter((id) => id !== eventChannel);
        }
        return joinedChannelsClone;
      });
    }
  };

  const handleAction = (action: MessageActionEvent) => {
    if (action.data.type == "reaction") {
      const actionData = action.data;
      setMessages((messages) => {
        const messagesClone = cloneDeep(messages);
        const message = messagesClone[action.channel].find(
          (m) => m.timetoken === actionData.messageTimetoken
        );
        if (message && action.event === "added") {
          if (!message.actions?.reaction?.[actionData.value])
            setDeep(message, ["actions", "reaction", actionData.value], []);
          message.actions.reaction[actionData.value].push({
            uuid: actionData.uuid,
            actionTimetoken: actionData.actionTimetoken,
          });
        }
        if (message && action.event === "removed") {
          const messageReactions = message.actions.reaction[actionData.value];
          const messageReaction = messageReactions.findIndex(
            (i) => i.actionTimetoken === actionData.actionTimetoken
          );
          messageReactions.splice(messageReaction, 1);
          if (!messageReactions.length) delete message.actions.reaction[actionData.value];
        }
        return messagesClone;
      });
    }
  };

  return <>{props.children}</>;
};
