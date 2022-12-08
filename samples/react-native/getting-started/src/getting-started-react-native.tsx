/* Imports PubNub JavaScript and React SDKs to create and access PubNub instance accross your app. */
/* Imports the required PubNub Chat Components to easily create chat apps with PubNub. */
import React from "react";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { Chat, MessageList, MessageInput } from "@pubnub/react-native-chat-components";

/* Creates and configures your PubNub instance. Be sure to replace "myPublishKey" and "mySubscribeKey"
  with your own keyset. If you wish, modify the default "myFirstUser" uuid value for the chat user. */
const pubnub = new PubNub({
  publishKey: "pub-c-0457cb83-0786-43df-bc70-723b16a6e816",
  subscribeKey: "sub-c-e654122d-85b5-49a6-a3dd-8ebc93c882de",
  userId: "myFirstUser",
});
const currentChannel = "Default";
const theme = "light";

export function GettingStartedReactNative(): JSX.Element {
  return (
    <PubNubProvider client={pubnub}>
      {/* PubNubProvider is a part of the PubNub React SDK and allows you to access PubNub instance
        in components down the tree. */}
      <Chat {...{ currentChannel, theme }}>
        {/* Chat is an obligatory state provider. It allows you to configure some common component
          options, like the current channel and the general theme for the app. */}
        <MessageList fetchMessages={20} />
        <MessageInput fileUpload="all" />
      </Chat>
    </PubNubProvider>
  );
}
