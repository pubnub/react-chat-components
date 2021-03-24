# PubNub Chat Components for React (Beta)

PubNub Chat Components is a development kit of React components that aims to help you to easily build Chat applications using PubNub infrastructure. It removes the complexicity of picking an adequate Chat engine, learning its APIs and dealing with its low-level internals. As the same time it allows you to create apps of various use cases, with different functionalities and customizable looks.

> Warning: The Chat Components are currently in Beta stage and are subject to change

![PubNub Chat Components](https://i.imgur.com/CydXVNT.png)

## Links

- [PubNub Chat Components Samples](https://pubnub.github.io/react-chat-components/samples) - sample
  applications built using Chat Components for React
- [PubNub Chat Components Documentation](https://pubnub.github.io/react-chat-components/docs) - describes
  the components' features, options, customizations etc.

#### PubNub related docs:

- [PubNub General Documentation](https://www.pubnub.com/docs/platform/home) - look into this first to
  have a general understanding of how PubNub works
- [PubNub Chat Documentation](https://www.pubnub.com/docs/chat/overview) - might be useful to also
  know how PubNub works in regards to Chat applications
- [PubNub React Documentation](https://www.pubnub.com/docs/chat/react/setup) - React wrapper can
  be used for other types of applications as well

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
- `PubNub React SDK 2.1.0+`

## Components

- Chat Components (obligatory state provider)
- Message List
- Message Input
- Channel List
- Channel Members
- Typing Indicator

<br />

# Usage

## PubNub Account

Sign in or create an account to create an app on the Admin Portal and get the keys to use in your
application.

When you create a new app, the first set of keys is generated automatically, but a single app can
have as many keysets as you like. We recommend that you create separate keysets for production and
test environments.

Some of the functionalities you might want to enable on your keyset depending on the use-case
include _Presence_, _Storage & Playback_ (including correct Renention) and _Objects_ (be sure to
select a geographical region corresponding to most users of your application).

## Installation

Install the components and all required dependencies using npm:

> Please note that the components are not deployed to npm yet!

```bash
npm install --save pubnub pubnub-react @pubnub/react-chat-components
```

## Usage

1. Import PubNub, PubNub React Provider and the components

```js
import { PubNub } from "pubnub";
import { PubNubProvider } from "pubnub-react";
import {
  Chat,
  MessageList,
  MessageInput,
  ChannelList,
  MemberList,
} from "@pubnub/react-chat-components";
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

3. Feed the PubNub Provider with your newly created client as with other PubNub React applications.

```jsx
const MyCommponent = () => {
  return <PubNubProvider client={pubnub}></PubNub>;
};
```

4. Place the components within the Chat state provider in any order that your app requires. Components
   can be tweaked later on using option properties and CSS variables.

```jsx
const MyCommponent = () => {
  return (
    <PubNubProvider client={pubnub}>
      <Chat {...{ channel, theme }}>
        <MessageList>
        <MessageInput>
      </Chat>
    </PubNub>
  );
};
```

5. Check out the [PubNub Chat Components Documentation](https://pubnub.github.io/react-chat-components/docs)
   to learn more about how to use the components and the [PubNub Chat Components Samples](https://pubnub.github.io/react-chat-components/samples) to see what is possible using the components. Source code of the sample applications can be found in the `samples` folder in the repository root.
