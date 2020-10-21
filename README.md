# PubNub Chat Components

This repository contains a POC of PubNub Chat Components for React.

![PubNub Chat Components](https://i.imgur.com/yut9kJs.png)

## Components

- PubNub Provider
- Message List
- Message Input
- Channel List (TBD)
- Channel Members (TBD)

## Usage

1. Install the components and required dependencies

(please note that the components are not deployed to npm yet)

```bash
npm i -S pubnub chat-components emoji-mart
```

2. Import the components

```js
import { PubNubProvider, MessageList, MessageInput } from "chat-components";
```

3. Configure the context provider and put the components inside!

```jsx
const MyCommponent = () => {
  const config = {
    publishKey: "your_publish_key",
    subscribeKey: "your_subscribe_key",
    uuid: "custom_user_id",
    channel: "channel_name",
  };

  return (
    <PubNubProvider {...config}>
      <MessageList>
      <MessageInput>
    </PubNubProvider>
  );
};
```

## Component options

TBD

## Theming

TBD
