import React from "react";
import { Text, View, KeyboardAvoidingView, Button, useColorScheme, Platform } from "react-native";
import { MessageInput, MessageList, TypingIndicator } from "@pubnub/react-native-chat-components";
import { useHeaderHeight } from "@react-navigation/elements";

export function ChatScreen(): JSX.Element {
  const headerHeight = useHeaderHeight();
  const theme = useColorScheme();
  const isDark = theme === "dark";

  return (
    <View style={{ backgroundColor: isDark ? "#1c1c28" : "#f0f3f7", flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, marginBottom: Platform.OS === "ios" ? 20 : 0 }}
        keyboardVerticalOffset={headerHeight}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <MessageList
          fetchMessages={20}
          // extraActionsRenderer={(msg) => <Button title="EA" onPress={() => console.log(msg)} />}
          // filter={(msg) => msg.message.text === "3"}
          // messageRenderer={(env) => <Text>{env.message.message.text}</Text>}
          // bubbleRenderer={(env) => <Text>Hello - {env.message.message.text}</Text>}
          // style={{
          //   messageOwn: { flexDirection: "row-reverse" },
          //   messageOwnMain: { alignItems: "flex-end" },
          //   messageOwnAvatar: { display: "none" },
          // }}
          // onScroll={(e) => console.log(e)}
        >
          {/* <Text>Hello</Text> */}
          <TypingIndicator showAsMessage={true} />
        </MessageList>
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
    </View>
  );
}
