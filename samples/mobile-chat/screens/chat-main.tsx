import React from "react";
import { Text, View, KeyboardAvoidingView, Button } from "react-native";
import { MessageInput } from "@pubnub/react-native-chat-components";
import { useHeaderHeight } from "@react-navigation/elements";

export function ChatScreen(): JSX.Element {
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, marginBottom: Platform.OS === "ios" ? 20 : 0 }}
      keyboardVerticalOffset={headerHeight}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <MessageInput
        // sendButton={<Text> Send </Text>}
        // placeholder="Please type here!"
        // draftMessage="This is my message"
        // extraActionsRenderer={() => <Text>Extra button</Text>}
        // onSend={(message) => console.log(message)}
        // onBeforeSend={(message) => console.log(`Before send callback: ${message.text}`)}
        // onChange={(message) => alert(`Input was changed: ${message}`)}
        // disabled={true}
        senderInfo={true}
        typingIndicator={true}
      />
    </KeyboardAvoidingView>
  );
}
