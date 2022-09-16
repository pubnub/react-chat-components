import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Themes } from "chat-components-common";

const lightColors = {
  messageListBackground: "#f0f3f7",
  messageColor: "#585858",
  unreadBackground: "#999999",
  unreadColor: "#ffffff",
};

const darkColors = {
  messageListBackground: "#1c1c28",
  messageColor: "rgba(228, 228, 235, 0.8)",
  unreadBackground: "#999999",
  unreadColor: "#2a2a39",
};

export interface MessageListStyle {
  messageList?: ViewStyle;
  messageListScroller?: ViewStyle;
  message?: ViewStyle;
  messageOwn?: ViewStyle;
  messageAvatar?: ViewStyle;
  messageOwnAvatar?: ViewStyle;
  messageAvatarImage?: ImageStyle;
  messageAvatarText?: ViewStyle;
  messageMain?: ViewStyle;
  messageOwnMain?: ViewStyle;
  messageTitle?: ViewStyle;
  messageOwnTitle?: ViewStyle;
  messageAuthor?: TextStyle;
  messageTime?: TextStyle;
  messageBubble?: TextStyle;
  spinner?: ImageStyle;
  spinnerWrapper?: ViewStyle;
  unread?: ViewStyle;
  unreadText?: TextStyle;
}

export default (theme: Themes): MessageListStyle => {
  const colors = ["light", "support", "event"].includes(theme) ? lightColors : darkColors;

  return StyleSheet.create<MessageListStyle>({
    messageList: {
      backgroundColor: colors.messageListBackground,
    },
    messageListScroller: {
      backgroundColor: colors.messageListBackground,
      flexGrow: 1,
    },
    message: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    messageAvatar: {
      alignItems: "center",
      borderRadius: 50,
      height: 36,
      justifyContent: "center",
      marginRight: 16,
      width: 36,
    },
    messageAvatarImage: {
      borderRadius: 50,
      height: "100%",
      resizeMode: "cover",
      width: "100%",
    },
    messageAvatarText: {
      color: colors.messageListBackground,
      fontWeight: "bold",
    },
    messageMain: {
      flex: 1,
    },
    messageTitle: {
      alignItems: "baseline",
      flexDirection: "row",
      marginBottom: 6,
    },
    messageAuthor: {
      color: colors.messageColor,
      fontSize: 16,
      fontWeight: "bold",
    },
    messageTime: {
      color: colors.messageColor,
      fontSize: 12,
      paddingHorizontal: 10,
    },
    messageBubble: {
      color: colors.messageColor,
    },
    spinner: {
      height: 20,
      width: 20,
    },
    spinnerWrapper: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 16,
      paddingBottom: 8,
    },
    unread: {
      alignSelf: "center",
      backgroundColor: colors.unreadBackground,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      position: "absolute",
      top: 20,
      zIndex: 10,
    },
    unreadText: {
      color: colors.unreadColor,
      fontSize: 13,
    },
  });
};
