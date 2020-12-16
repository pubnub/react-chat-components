# PubNub Chat Components

This repository contains a POC of PubNub Chat Components for React.

![PubNub Chat Components](https://i.imgur.com/yut9kJs.png)

## Components

- ChatComponents (wrapper)
- Message List
- Message Input
- Channel List
- Channel Members

## Usage

1. Install the components and required dependencies

(please note that the components are not deployed to npm yet)

```bash
npm i -S pubnub chat-components emoji-mart
```

2. Import the components

```js
import PubNub from "pubnub";
import { ChatComponents, MessageList, MessageInput } from "chat-components";
```

3. Configure the context provider and put the components inside!

```jsx
const MyCommponent = () => {
  const pubnub = new PubNub({
    publishKey: "your_publish_key",
    subscribeKey: "your_subscribe_key",
    uuid: "custom_user_id",
  });
  const channel = "channel_name";

  return (
    <ChatComponents {...{pubnub, channel }}>
      <MessageList>
      <MessageInput>
    </ChatComponents>
  );
};
```
