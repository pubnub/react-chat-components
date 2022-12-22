import React from "react";
import { View, KeyboardAvoidingView, useColorScheme, Platform, Modal } from "react-native";
import {
  MessageInput,
  MessageList,
  TypingIndicator,
  EmojiPickerElementProps,
} from "@pubnub/react-native-chat-components";
import { useHeaderHeight } from "@react-navigation/elements";
import EmojiPicker from "rn-emoji-keyboard";

import EmojiSelector from "react-native-emoji-selector";

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
          fetchMessages={25}
          enableReactions
          reactionsPicker={
            // <EmojiSelectorAdapter />
            <EmojiPicker
              open={false}
              onClose={() => {
                return;
              }}
              onEmojiSelected={() => {
                return;
              }}
              disableSafeArea
              defaultHeight="60%"
              theme={isDark ? darkEmojiPickerTheme : undefined}
            />
          }
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

const darkEmojiPickerTheme = {
  backdrop: "#16161888",
  knob: "#fff",
  container: "#2a2a39",
  header: "#fff",
  skinTonesContainer: "#252427",
  category: {
    icon: "#fff",
    iconActive: "#1c1c28",
    container: "#1c1c28",
    containerActive: "#fff",
  },
};

const EmojiSelectorAdapter = (props: EmojiPickerElementProps) => {
  return props.open ? (
    <Modal>
      <EmojiSelector
        onEmojiSelected={(emoji) => {
          if (props.onEmojiSelected) props.onEmojiSelected({ emoji });
          if (props.onClose) props.onClose();
        }}
      />
    </Modal>
  ) : null;
};
