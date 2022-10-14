import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Themes } from "@pubnub/common-chat-components";

const lightColors = {
  wrapperBackground: "#f0f3f7",
  inputBackground: "#e4e9f0",
  inputColor: "#585858",
  inputPlaceholder: "#999999",
};

const darkColors = {
  wrapperBackground: "#1c1c28",
  inputBackground: "#2a2a39",
  inputColor: "rgba(228, 228, 235, 0.8)",
  inputPlaceholder: "#555770",
};

export interface MessageInputStyle {
  messageInputWrapper?: ViewStyle;
  messageInput?: ViewStyle;
  messageInputPlaceholder?: TextStyle;
  sendButton?: ViewStyle;
  sendButtonActive?: ViewStyle;
  icon?: ImageStyle;
  extraActions?: ViewStyle;
}

export default (theme: Themes): MessageInputStyle => {
  const colors = ["light", "support", "event"].includes(theme) ? lightColors : darkColors;

  return StyleSheet.create<MessageInputStyle>({
    messageInputWrapper: {
      backgroundColor: colors.wrapperBackground,
      paddingHorizontal: 16,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    messageInput: {
      backgroundColor: colors.inputBackground,
      borderRadius: 20,
      color: colors.inputColor,
      paddingHorizontal: 14,
      paddingTop: 8,
      paddingBottom: 10,
      fontSize: 16,
      flex: 1,
    },
    messageInputPlaceholder: {
      color: colors.inputPlaceholder,
    },
    sendButton: {
      marginLeft: 16,
    },
    sendButtonActive: {},
    icon: {
      height: 20,
      width: 20,
    },
    extraActions: {
      marginRight: 16,
    },
  });
};
