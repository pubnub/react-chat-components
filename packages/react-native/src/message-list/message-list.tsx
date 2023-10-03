import React, {
  cloneElement,
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
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
  FileAttachment,
} from "@pubnub/common-chat-components";
import createDefaultStyle, { MessageListStyle } from "./message-list.style";
import { EmojiPickerElementProps } from "../types";
import { useStyle, useRotation } from "../helpers";
import SpinnerIcon from "../icons/spinner.png";
import { RemoteFile } from "./remote-file";

export type MessageListProps = CommonMessageListProps & {
  /** Option to pass in a component that will be used for picking message reactions. For more details, refer to the Message Reactions section in the docs. */
  reactionsPicker?: ReactElement<EmojiPickerElementProps>;
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
    addReaction,
    emojiPickerShown,
    fetchHistory,
    getTime,
    getUser,
    isOwnMessage,
    messages,
    onError,
    paginationEnd,
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
  } = useMessageListCore(props);

  const style = useStyle<MessageListStyle>({
    theme,
    createDefaultStyle,
    customStyle: props.style,
  });

  const [reverseMessages, setReverseMessages] = useState([...messages].reverse());
  const [spinnerShown, setSpinnerShown] = useState(false);
  const [sheetPosition] = useState(new Animated.Value(0));
  const shouldShownSpinner = props.fetchMessages && !paginationEnd;

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
  function handleOpenReactions(timetoken) {
    try {
      setReactingToMessage(timetoken);
      setEmojiPickerShown(true);
    } catch (e) {
      onError(e);
    }
  }

  function handleEmojiInsertion(emoji: { emoji: string }) {
    try {
      if (!("emoji" in emoji)) return;
      addReaction(emoji.emoji, reactingToMessage);
      setEmojiPickerShown(false);
    } catch (e) {
      onError(e);
    }
  }

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
    if (envelope.timetoken === "children-element") return <View>{props.children}</View>;
    const uuid = envelope.uuid || envelope.publisher || "";
    const actions = envelope.actions;
    const deleted = !!Object.keys(actions?.deleted || {}).length;
    const isOwn = isOwnMessage(uuid);

    if (deleted) return;

    return (
      <Pressable
        style={({ pressed }) => [
          style.message,
          props.enableReactions && pressed && style.messagePressed,
          isOwn && style.messageOwn,
        ]}
        onLongPress={() => handleOpenReactions(envelope.timetoken)}
      >
        {renderMessage(envelope)}
        {props.extraActionsRenderer && props.extraActionsRenderer(envelope)}
      </Pressable>
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
          <View>{file && file.name && renderFile(file)}</View>
          <View>{props.enableReactions && renderReactions(envelope)}</View>
        </View>
      </>
    );
  };

  const renderFile = (file: FileAttachment) => {
    if (props.fileRenderer) return props.fileRenderer(file);

    return <RemoteFile style={style} file={file} onError={onError} sheetPosition={sheetPosition} />;
  };

  const renderReactions = (envelope: MessageEnvelope) => {
    const reactions = envelope.actions?.reaction;
    if (!reactions) return;

    return (
      <View style={style.reactionWrapper}>
        {Object.entries(reactions)
          .sort(([, a], [, b]) => b.length - a.length)
          .map(([reaction, instances]) => {
            const instancesLimit = 99;
            const instancesLimited = instances.slice(0, instancesLimit);
            const instancesOverLimit = instances.length - instancesLimited.length;
            const userReaction = instances?.find((i) => i.uuid === pubnub.getUUID());
            const userNames = instancesLimited.map((i) => {
              const user = users.find((u) => u.id === i.uuid);
              return user ? user.name : i.uuid;
            });
            const tooltipContent = `${userNames.join(", ")} ${
              instancesOverLimit ? `and ${instancesOverLimit} more` : ``
            }`;

            return (
              <Pressable
                key={reaction}
                style={[style.reaction, userReaction && style.reactionActive]}
                onPress={() => {
                  userReaction
                    ? removeReaction(reaction, envelope.timetoken, userReaction.actionTimetoken)
                    : addReaction(reaction, envelope.timetoken);
                }}
                onLongPress={() => {
                  Alert.alert(`Reacted with ${reaction}`, tooltipContent, null, {
                    userInterfaceStyle: ["light", "support", "event"].includes(theme)
                      ? "light"
                      : "dark",
                  });
                }}
              >
                <Text style={style.reactionText}>
                  {reaction} {instancesLimited.length}
                  {instancesOverLimit ? "+" : ""}
                </Text>
              </Pressable>
            );
          })}
      </View>
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
        style={style.messageList}
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
        inverted={true}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      {props.reactionsPicker &&
        cloneElement(props.reactionsPicker, {
          onEmojiSelected: handleEmojiInsertion,
          open: emojiPickerShown,
          onClose: () => setEmojiPickerShown(false),
        })}
      {props.fileRenderer ? null : (
        <Animated.View
          style={[style.downloadedSuccessBanner, { transform: [{ translateY: sheetPosition }] }]}
        >
          <View style={[StyleSheet.absoluteFill, style.downloadedSuccessBannerContent]} />
          <Text style={style.downloadedSuccessBannerText}>File downloaded successfully</Text>
        </Animated.View>
      )}
    </>
  );
};

MessageList.defaultProps = {
  enableReactions: false,
  fetchMessages: 0,
};
