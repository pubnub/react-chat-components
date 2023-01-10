import { Dimensions, ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Themes } from "@pubnub/common-chat-components";

const lightColors = {
  messagePressedBackground: "#e9eef4",
  messageListBackground: "#f0f3f7",
  messageColor: "#585858",
  unreadBackground: "#999999",
  unreadColor: "#ffffff",
  reactionBorder: "#ced6e0",
  reactionActiveBackground: "rgba(239, 58, 67, 0.2)",
  downloadedSuccessBannerBackground: "rgba(224, 224, 224, 0.9)",
  downloadedSuccessBannerText: "#000000",
  downloadLinkText: "#000000",
  downloadLinkIcon: "#000000",
};

const darkColors = {
  messagePressedBackground: "#28293d",
  messageListBackground: "#1c1c28",
  messageColor: "rgba(228, 228, 235, 0.8)",
  unreadBackground: "#999999",
  unreadColor: "#2a2a39",
  reactionBorder: "#28293d",
  reactionActiveBackground: "rgba(239, 58, 67, 0.3)",
  downloadedSuccessBannerBackground: "rgba(0,0,0,0.9)",
  downloadedSuccessBannerText: "#ffffff",
  downloadLinkText: "#ffffff",
  downloadLinkIcon: "#ffffff",
};

export interface MessageListStyle {
  messageList?: ViewStyle;
  messageListScroller?: ViewStyle;
  message?: ViewStyle;
  messagePressed?: ViewStyle;
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
  reactionWrapper?: ViewStyle;
  reaction?: ViewStyle;
  reactionActive?: ViewStyle;
  reactionText?: TextStyle;
  spinner?: ImageStyle;
  spinnerWrapper?: ViewStyle;
  unread?: ViewStyle;
  unreadText?: TextStyle;
  imageFile?: ImageStyle;
  fileNameText?: TextStyle;
  downloadIconStyle?: ImageStyle;
  fileDownloadContainer?: ViewStyle;
  downloadedSuccessBanner?: ViewStyle;
  downloadedSuccessBannerContent?: ViewStyle;
  downloadedSuccessBannerText?: TextStyle;
  downloadingInProgressIconContainer?: ViewStyle;
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
    messageOwn: {},
    messagePressed: {
      backgroundColor: colors.messagePressedBackground,
    },
    messageOwnAvatar: {},
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
    messageOwnMain: {},
    messageTitle: {
      alignItems: "baseline",
      flexDirection: "row",
      marginBottom: 6,
    },
    messageOwnTitle: {},
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
    reactionWrapper: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    reaction: {
      borderColor: colors.reactionBorder,
      borderRadius: 15,
      borderWidth: 1,
      marginRight: 5,
      marginTop: 6,
      paddingLeft: 4,
      paddingRight: 8,
      paddingVertical: 3,
    },
    reactionText: {
      color: colors.messageColor,
    },
    reactionActive: {
      backgroundColor: colors.reactionActiveBackground,
      borderColor: colors.reactionActiveBackground,
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
    imageFile: {
      width: "100%",
    },
    downloadIconStyle: {
      width: 24,
      height: 24,
      marginLeft: 8,
      tintColor: colors.downloadLinkIcon,
    },
    fileDownloadContainer: {
      flexDirection: "row",
      marginTop: 12,
      alignItems: "center",
      maxWidth: 250,
      minHeight: 24,
    },
    fileNameText: {
      textDecorationLine: "underline",
      color: colors.downloadLinkText,
    },
    downloadedSuccessBanner: {
      position: "absolute",
      left: Dimensions.get("window").width / 2 - 80,
      bottom: -300,
      width: 160,
      height: 160,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      overflow: "hidden",
      zIndex: 10,
    },
    downloadedSuccessBannerContent: {
      backgroundColor: colors.downloadedSuccessBannerBackground,
    },
    downloadedSuccessBannerText: {
      color: colors.downloadedSuccessBannerText,
      textAlign: "center",
    },
    downloadingInProgressIconContainer: {
      alignItems: "flex-start",
      marginTop: 12,
      minHeight: 24,
    },
  });
};
