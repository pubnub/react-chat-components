/* Import PubNub JavaScript and React SDKs to create and access PubNub instance accross your app. */
/* Import PubNub Chat Components to easily create chat apps with PubNub. */
import React from "react";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { Chat, MessageList, MessageInput } from "@pubnub/react-chat-components";

/* Create and configure your PubNub instance. Be sure to replace "myPublishKey" and "mySubscribeKey"
with your own keyset and create a unique UUID for your default user. */
const pubnub = new PubNub({
  publishKey: "myPublishKey",
  subscribeKey: "mySubscribeKey",
  uuid: "your-first-user",
});
const currentChannel = "your-first-channel";
const theme = "light";

function GettingStarted(): JSX.Element {
  return (
    <PubNubProvider client={pubnub}>
      {/* PubNubProvider is a part of the PubNub React SDK and allows you to access PubNub instance
      in components down the tree. */}
      <Chat {...{ currentChannel, theme }}>
        {/* Chat is an obligatory state provider. It allows you to configure some common component
        options, like the current channel and the general theme for the app. */}
        <MessageList />
        <MessageInput />
      </Chat>
    </PubNubProvider>
  );
}

export default GettingStarted;
