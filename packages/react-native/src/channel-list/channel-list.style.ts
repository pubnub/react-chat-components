import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Themes } from "@pubnub/common-chat-components";

const lightColors = {
  channelListBackground: "#ffffff",
  channelBackground: "transparent",
  channelActiveBackground: "#f0f3f7",
  channelPressedBackground: "#e4e9f0",
  channelNameColor: "#585858",
  channelDescriptionColor: "#9b9b9b",
};

const darkColors = {
  channelListBackground: "#2a2a39",
  channelBackground: "transparent",
  channelActiveBackground: "#1c1c28",
  channelPressedBackground: "#232333",
  channelNameColor: "#dcddde",
  channelDescriptionColor: "#929292",
};

export interface ChannelListStyle {
  channelListWrapper?: ViewStyle;
  channelList?: ViewStyle;
  channel?: ViewStyle;
  channelActive?: ViewStyle;
  channelPressed?: ViewStyle;
  channelTitle?: ViewStyle;
  channelName?: TextStyle;
  channelDescription?: TextStyle;
  channelThumb?: ImageStyle;
  channelActions?: ViewStyle;
}

export default (theme: Themes): ChannelListStyle => {
  const colors = ["light", "support", "event"].includes(theme) ? lightColors : darkColors;

  return StyleSheet.create<ChannelListStyle>({
    channelListWrapper: {
      flex: 1,
    },
    channelList: {
      backgroundColor: colors.channelListBackground,
    },
    channel: {
      alignItems: "center",
      backgroundColor: colors.channelBackground,
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    channelActive: {
      backgroundColor: colors.channelActiveBackground,
    },
    channelPressed: {
      backgroundColor: colors.channelPressedBackground,
    },
    channelTitle: {
      flex: 1,
    },
    channelName: {
      color: colors.channelNameColor,
      fontSize: 16,
      fontWeight: "500",
    },
    channelDescription: {
      color: colors.channelDescriptionColor,
      fontSize: 14,
      paddingTop: 5,
    },
    channelThumb: {
      borderRadius: 50,
      height: 36,
      marginRight: 16,
      width: 36,
    },
    channelActions: {},
  });
};
