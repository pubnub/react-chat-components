import { StyleSheet, TextStyle } from "react-native";
import { Themes } from "@pubnub/common-chat-components";

const lightColors = {
  textBackground: "#f0f3f7",
  textColor: "#585858",
};

const darkColors = {
  textBackground: "#1c1c28",
  textColor: "rgba(228, 228, 235, 0.8)",
};

export interface TypingIndicatorStyle {
  typingIndicator?: TextStyle;
}

export default (theme: Themes): TypingIndicatorStyle => {
  const colors = ["light", "support", "event"].includes(theme) ? lightColors : darkColors;

  return StyleSheet.create<TypingIndicatorStyle>({
    typingIndicator: {
      backgroundColor: colors.textBackground,
      color: colors.textColor,
      fontSize: 12,
      paddingHorizontal: 16,
      paddingVertical: 5,
    },
  });
};
