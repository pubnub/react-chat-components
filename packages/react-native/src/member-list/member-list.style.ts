import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Themes } from "@pubnub/common-chat-components";

const lightColors = {
  memberListBackground: "#ffffff",
  memberBackground: "transparent",
  memberNameColor: "#585858",
  memberDescriptionColor: "#9b9b9b",
  memberPresenceColor: "#01bd4c",
};

const darkColors = {
  memberListBackground: "#2a2a39",
  memberBackground: "transparent",
  memberNameColor: "#dcddde",
  memberDescriptionColor: "#929292",
  memberPresenceColor: "#01bd4c",
};

export interface MemberListStyle {
  memberListWrapper?: ViewStyle;
  memberList?: ViewStyle;
  member?: ViewStyle;
  memberPressed?: ViewStyle;
  memberTitle?: ViewStyle;
  memberName?: TextStyle;
  memberDescription?: TextStyle;
  memberThumb?: ViewStyle;
  memberThumbImage?: ImageStyle;
  memberThumbText?: TextStyle;
  memberActions?: ViewStyle;
  memberPresence?: ViewStyle;
}

export default (theme: Themes): MemberListStyle => {
  const colors = ["light", "support", "event"].includes(theme) ? lightColors : darkColors;

  return StyleSheet.create<MemberListStyle>({
    memberListWrapper: {
      flex: 1,
    },
    memberList: {
      backgroundColor: colors.memberListBackground,
    },
    member: {
      alignItems: "center",
      backgroundColor: colors.memberBackground,
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    memberPressed: {},
    memberTitle: {
      flex: 1,
    },
    memberName: {
      color: colors.memberNameColor,
      fontSize: 16,
      fontWeight: "500",
    },
    memberDescription: {
      color: colors.memberDescriptionColor,
      fontSize: 14,
      paddingTop: 5,
    },
    memberThumb: {
      alignItems: "center",
      borderRadius: 50,
      height: 36,
      justifyContent: "center",
      marginRight: 16,
      width: 36,
    },
    memberThumbImage: {
      borderRadius: 50,
      height: "100%",
      resizeMode: "cover",
      width: "100%",
    },
    memberThumbText: {
      color: colors.memberListBackground,
      fontWeight: "bold",
    },
    memberActions: {},
    memberPresence: {
      width: 8,
      height: 8,
      backgroundColor: colors.memberPresenceColor,
      borderRadius: 10,
      position: "absolute",
      left: 50,
      top: 42,
    },
  });
};
