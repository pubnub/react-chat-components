import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Themes } from "@pubnub/common-chat-components";

const lightColors = {
  wrapperBackground: "#f0f3f7",
  inputBackground: "#e4e9f0",
  inputColor: "#585858",
  inputPlaceholder: "#999999",
  actionsSheetBackground: "#FFFFFF",
  actionsSheetButtonIconTint: "#1F2937",
  actionsSheetLabelColor: "#1F2937",
  sheetContentHeaderText: "#000000",
  messagePreview: "#585858",
};

const darkColors = {
  wrapperBackground: "#1c1c28",
  inputBackground: "#2a2a39",
  inputColor: "rgba(228, 228, 235, 0.8)",
  inputPlaceholder: "#555770",
  actionsSheetBackground: "#000000",
  actionsSheetButtonIconTint: "#e4e5e5",
  actionsSheetLabelColor: "#e7eaec",
  sheetContentHeaderText: "#ffffff",
  messagePreview: "rgba(228, 228, 235, 0.8)",
};

export interface MessageInputStyle {
  messageInputWrapper?: ViewStyle;
  messageInputContent?: ViewStyle;
  messageInput?: ViewStyle;
  messageInputPlaceholder?: TextStyle;
  messageInputFileLabel?: ViewStyle;
  messageInputRemoveFileLabel?: ViewStyle;
  sendButton?: ViewStyle;
  sendButtonActive?: ViewStyle;
  icon?: ImageStyle;
  extraActions?: ViewStyle;
  fileUploadModalContent?: ViewStyle;
  fileUploadModalSheetContainer?: ViewStyle;
  fileUploadModalSheetContent?: ViewStyle;
  fileUploadModalSheetContentHeaderContainer?: ViewStyle;
  fileUploadModalSheetContentHeaderText?: ViewStyle;
  fileUploadModalSheetContentCloseIconContainer?: ViewStyle;
  fileUploadModalSheetContentCloseIcon?: ImageStyle;
  fileUploadModalSheetContentButton?: ViewStyle;
  fileUploadModalSheetContentButtonIcon?: ImageStyle;
  fileUploadModalSheetContentTextStyle?: ViewStyle;
  filePreviewContainer?: ViewStyle;
  filePreviewText?: TextStyle;
}

export default (theme: Themes): MessageInputStyle => {
  const colors = ["light", "support", "event"].includes(theme) ? lightColors : darkColors;

  return StyleSheet.create<MessageInputStyle>({
    messageInputWrapper: {
      backgroundColor: colors.wrapperBackground,
      paddingHorizontal: 8,
      paddingVertical: 10,
      flexDirection: "column",
    },
    messageInputContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    messageInputFileLabel: {
      width: 20,
      height: 20,
      marginHorizontal: 9,
    },
    messageInputRemoveFileLabel: {
      width: 20,
      height: 20,
      marginHorizontal: 9,
    },
    messageInput: {
      backgroundColor: colors.inputBackground,
      borderRadius: 20,
      color: colors.inputColor,
      paddingHorizontal: 14,
      paddingTop: 8,
      paddingBottom: 10,
      fontSize: 16,
      marginHorizontal: 9,
      flex: 1,
    },
    messageInputPlaceholder: {
      color: colors.inputPlaceholder,
    },
    sendButton: {
      marginHorizontal: 9,
    },
    sendButtonActive: {},
    icon: {
      height: 20,
      width: 20,
    },
    extraActions: {
      marginRight: 8,
    },
    fileUploadModalContent: {
      flex: 1,
    },
    fileUploadModalSheetContainer: {
      position: "absolute",
      left: 4,
      right: 4,
      bottom: 4,
      top: 0,
      backgroundColor: "transparent",
      flexDirection: "row",
      alignItems: "flex-end",
    },
    fileUploadModalSheetContent: {
      backgroundColor: colors.actionsSheetBackground,
      borderRadius: 16,
      flex: 1,
      padding: 16,
    },
    fileUploadModalSheetContentHeaderContainer: {
      paddingBottom: 24,
    },
    fileUploadModalSheetContentHeaderText: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.sheetContentHeaderText,
    },
    fileUploadModalSheetContentCloseIconContainer: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    fileUploadModalSheetContentCloseIcon: {
      width: 20,
      height: 20,
    },
    fileUploadModalSheetContentButton: {
      height: 44,
      flexDirection: "row",
      alignItems: "center",
    },
    fileUploadModalSheetContentButtonIcon: {
      marginRight: 8,
      tintColor: colors.actionsSheetButtonIconTint,
      width: 24,
      height: 24,
    },
    fileUploadModalSheetContentTextStyle: {
      color: colors.actionsSheetLabelColor,
      fontSize: 16,
      lineHeight: 24,
    },
    filePreviewContainer: {
      marginBottom: 8,
      marginLeft: 10,
    },
    filePreviewText: {
      color: colors.messagePreview,
      fontSize: 14,
    },
  });
};
