import React, { FC, useEffect, useRef, useCallback, useState } from "react";
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import {
  Animated,
  FlatList,
  Image,
  ListRenderItem,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { throttle } from "lodash";
import {
  CommonMessageListProps,
  MessageEnvelope,
  getNameInitials,
  getPredefinedColor,
  isFilePayload,
  useMessageListCore,
} from "@pubnub/common-chat-components";
import createDefaultStyle, { MessageListStyle } from "./message-list.style";
import { useStyle, useRotation } from "../helpers";
import SpinnerIcon from "../icons/spinner.png";
import ViewReactNativeStyleAttributes from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

// Workaround for workaround for: https://github.com/facebook/react-native/issues/30034
ViewReactNativeStyleAttributes.scaleY = true;

export type MessageListProps = CommonMessageListProps & {
  /** Callback run on a list scroll. */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Options to provide custom StyleSheet for the component. It will be merged with the default styles. */
  style?: MessageListStyle;
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
    fetchHistory,
    getTime,
    getUser,
    isOwnMessage,
    messages,
    paginationEnd,
    prevMessages,
    setScrolledBottom,
    scrolledBottom,
    setUnreadMessages,
    theme,
    unreadMessages,
  } = useMessageListCore(props);

  const style = useStyle<MessageListStyle>({
    theme,
    createDefaultStyle,
    customStyle: props.style,
  });

  const [reverseMessages, setReverseMessages] = useState([...messages].reverse());
  const [spinnerShown, setSpinnerShown] = useState(false);
  const shouldShownSpinner = props.fetchMessages && !paginationEnd;
  const isAndroid = Platform.OS === "android";

  const rotate = useRotation(shouldShownSpinner && spinnerShown);
  const listRef = useRef<FlatList>(null);

  /**
   * Commands
   */
  const scrollToBottom = useCallback(() => {
    setScrolledBottom(true);
    listRef.current.scrollToOffset({ offset: 0 });
  }, [setScrolledBottom]);

  /**
   * Handlers
   */

  const handleScrollBottom = throttle((event) => {
    const scrolledBottom = event.nativeEvent.contentOffset.y < 30;
    if (scrolledBottom) setUnreadMessages(0);
    setScrolledBottom(scrolledBottom);
  }, 500);

  const handleScroll = useCallback(
    (event) => {
      if (props.onScroll) props.onScroll(event);
      event.persist();
      handleScrollBottom(event);
    },
    [props, handleScrollBottom]
  );

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    const spinnerShown = viewableItems.find((el) => el.item.timetoken === "spinner-element");
    setSpinnerShown(!!spinnerShown);
  }, []);

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (!scrolledBottom) return;
    if (prevMessages.length !== messages.length) scrollToBottom();
  }, [messages.length, prevMessages.length, scrollToBottom, scrolledBottom]);

  useEffect(() => {
    setReverseMessages([...messages].reverse());
  }, [messages]);

  /**
   *  Renderers
   */
  const renderSpinner = () => {
    if (!shouldShownSpinner) return;

    return (
      <View style={style.spinnerWrapper}>
        <Animated.Image
          style={[style.spinner, { transform: [{ rotate }] }]}
          source={{ uri: SpinnerIcon }}
        />
      </View>
    );
  };

  const renderItem: ListRenderItem<MessageEnvelope> = ({ item }) => {
    const envelope = item;
    if (envelope.timetoken === "spinner-element") return renderSpinner();
    if (envelope.timetoken === "children-element")
      return <View style={isAndroid && { scaleY: -1 }}>{props.children}</View>;
    const uuid = envelope.uuid || envelope.publisher || "";
    const actions = envelope.actions;
    const deleted = !!Object.keys(actions?.deleted || {}).length;
    const isOwn = isOwnMessage(uuid);

    if (deleted) return;

    return (
      <View style={[style.message, isOwn && style.messageOwn, isAndroid && { scaleY: -1 }]}>
        {renderMessage(envelope)}
        {props.extraActionsRenderer && props.extraActionsRenderer(envelope)}
      </View>
    );
  };

  const renderMessage = (envelope: MessageEnvelope) => {
    const uuid = envelope.uuid || envelope.publisher || "";
    const time = getTime(envelope.timetoken as number);
    const isOwn = isOwnMessage(uuid);
    const message = isFilePayload(envelope.message) ? envelope.message.message : envelope.message;
    const user = message?.sender || getUser(uuid);
    const actions = envelope.actions;
    const file = isFilePayload(envelope.message) && envelope.message.file;
    const editedText = (Object.entries(actions?.updated || {}).pop() || []).shift() as string;

    if (props.messageRenderer && (props.filter ? props.filter(envelope) : true))
      return props.messageRenderer({ message: envelope, user, time, isOwn, editedText });

    return (
      <>
        <View
          style={[
            style.messageAvatar,
            isOwn && style.messageOwnAvatar,
            { backgroundColor: getPredefinedColor(uuid) },
          ]}
        >
          {user?.profileUrl ? (
            <Image style={style.messageAvatarImage} source={{ uri: user.profileUrl }}></Image>
          ) : (
            <Text style={style.messageAvatarText}>{getNameInitials(user?.name || uuid)}</Text>
          )}
        </View>
        <View style={[style.messageMain, isOwn && style.messageOwnMain]}>
          <View style={[style.messageTitle, isOwn && style.messageOwnTitle]}>
            <Text style={style.messageAuthor}>{user?.name || uuid}</Text>
            <Text style={style.messageTime}>{time}</Text>
          </View>
          {message?.text &&
            (props.bubbleRenderer && (props.filter ? props.filter(envelope) : true) ? (
              props.bubbleRenderer({ message: envelope, user, time, isOwn, editedText })
            ) : (
              <Text style={style.messageBubble}>{editedText || message?.text}</Text>
            ))}
        </View>
      </>
    );
  };

  return (
    <>
      {unreadMessages > 0 && (
        <Pressable style={style.unread} onPress={scrollToBottom}>
          <Text style={style.unreadText}>
            {unreadMessages} new message{unreadMessages > 1 ? "s" : ""}
          </Text>
        </Pressable>
      )}
      <FlatList
        testID="message-list"
        style={[style.messageList, isAndroid && { scaleY: -1 }]}
        contentContainerStyle={style.messageListScroller}
        data={[
          { timetoken: "children-element", message: { id: "children-element" } },
          ...reverseMessages,
          { timetoken: "spinner-element", message: { id: "spinner-element" } },
        ]}
        renderItem={renderItem}
        keyExtractor={(envelope) => envelope.timetoken as string}
        ref={listRef}
        onEndReached={() => fetchHistory()}
        onScroll={handleScroll}
        // Workaround for: https://github.com/facebook/react-native/issues/30034
        inverted={!isAndroid}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </>
  );
};

MessageList.defaultProps = {
  enableReactions: false,
  fetchMessages: 0,
};
