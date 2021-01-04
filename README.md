# PubNub Chat Components for React (Beta)

PubNub Chat Components is a development kit of React components that aims to help you to easily build Chat applications using PubNub infrastructure. It removes the complexicity of picking an adequate Chat engine, learning its APIs and dealing with its low-level internals. As the same time it allows you to create apps of various use cases, with different functionalities and customizable looks.

> Warning: The Chat Components are currently in Beta stage and are subject to change

![PubNub Chat Components](https://i.imgur.com/C0fTWCT.png)

## Benefits

- Ease of installation and setup
- Allows to build fully-featured chat applications
- No need to deal with server code
- Useful compontent options to tweak the functionalities
- Built-in light and dark themes for various use cases: group, support and event chats
- Extra customization with CSS variables
- TypeScript support

## Requirements

- `React 16.8+` and `ReactDOM 16.8+`
- `PubNub JavaScript SDK 4.29+`

## Components

- Chat Components (obligatory state provider)
- Message List
- Message Input
- Channel List
- Channel Members
- Occupancy Indicator
- Typing Indicator

<br />

# Usage

## PubNub Account

Sign in or create an account to create an app on the Admin Portal and get the keys to use in your
application.

When you create a new app, the first set of keys is generated automatically, but a single app can
have as many keysets as you like. We recommend that you create separate keysets for production and
test environments.

Please make sure to enable `Objects` functionality and select a geographical region corresponding to
most users of your application.

## Installation

Install the components and all required dependencies using npm:

> Please note that the components are not deployed to npm yet!

```bash
npm install --save pubnub pubnub-chat-components
```

## Usage

1. Import PubNub and the components

```js
import { PubNub } from "pubnub";
import {
  Chat,
  MessageList,
  MessageInput,
  ChannelList,
  MemberList,
} from "pubnub-chat-components";
```

2. Create your PubNub client and rest of the configuration for the Chat, which serves as a
   common context for all of the components:

```jsx
const pubnub = new PubNub({
  publishKey: "myPublishKey",
  subscribeKey: "mySubscribeKey",
  uuid: "myUniqueUUID",
});
const channel = "myCurrentChannel";
const theme = "light";
```

3. Place the components within the state provider in any order that your app requires. Components
   can be tweaked later on using option properties and CSS variables.

```jsx
const MyCommponent = () => {
  return (
    <Chat {...{ pubnub, channel, theme }}>
      <MessageList>
      <MessageInput>
    </Chat>
  );
};
```

