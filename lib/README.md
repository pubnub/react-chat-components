# React Chat Components (Beta)

PubNub's Chat Components library provides easy-to-use components to build chat applications using
PubNub Chat on the React Framework. Our component library is the fastest way to add chat features
like direct and group messaging, typing indicators, reactions and more without going through the
complexity of low-level architecture of realtime networks. At the same time it allows you to create
apps for various use cases, with different functionalities and customizable looks.

![PubNub Chat Components](https://i.imgur.com/CydXVNT.png)

## Quick Links

- [Sample Apps](https://pubnub.github.io/react-chat-components/samples) - sample applications built
  using Chat Components for React
- [React Component Docs](https://pubnub.github.io/react-chat-components/docs) - describes the
  components' features, options, customizations etc.
- [PubNub Chat Docs](https://www.pubnub.com/docs/chat/overview) - look into this first to have a
  general understanding of how PubNub works
- [PubNub React SDK](https://www.pubnub.com/docs/chat/react/setup) - React wrapper can be used for
  other types of applications as well

## Features

- User and Channel Metadata: fetching metadata about users, channels and memberships from PB Objects
  storage using custom hooks
- Subscriptions: automatic subscriptions to current channel, optional subscriptions to other
  channels and channel groups
- Messages: publishing and listening to text messages, fetching history for each channel
- Presence: fetching currently present users and listening to new presence, publishing presence
  events
- Typing Indicators: typing indicators displayed as text notifications or messages
- Message Reactions: publishing and displaying message reactions (emojis) for each message

## Benefits

- Ease of installation and setup
- Allows to build fully-featured chat applications
- No need to deal with server code
- Useful component options to tweak the functionalities
- Built-in light and dark themes for various use cases: group, support and event chats
- Extra customization with CSS variables
- TypeScript support

## Requirements

- [`React 16.8+`](https://reactjs.org/docs/getting-started.html) and
  [`ReactDOM 16.8+`](https://reactjs.org/docs/react-dom.html)
- [`PubNub JavaScript SDK 4.29+`](https://github.com/pubnub/javascript)
- [`PubNub React SDK 2.1.0+`](https://github.com/pubnub/react)

## List of Components

- Chat (obligatory state provider)
- Message List
- Message Input
- Channel List
- Channel Members
- Typing Indicator

<br />

# Usage

## PubNub Account

1. Sign in or create an account to create an app on the
   [Admin Portal](https://dashboard.pubnub.com/) and get the keys to use in your application.

2. When you create a new app, the first set of keys is generated automatically, but a single app can
   have as many keysets as you like. We recommend that you create separate keysets for production
   and test environments.

3. Some of the functionalities you might want to enable on your keyset depending on the use-case
   include _Presence_, _Files_, _Storage & Playback_ (including correct Retention) and _Objects_ (be sure to
   select a geographical region corresponding to most users of your application).

## Run Sample Apps

Start with exploring our [Sample Apps](https://pubnub.github.io/react-chat-components/samples) that
are built using chat components. Follow the steps below to run the apps locally in your own
environment.

1. Clone the repository:

```bash
git clone git@github.com:pubnub/react-chat-components.git
```

2. Go to the `samples` folder and install the dependencies:

```bash
cd react-chat-components/samples
npm install
```

3. Follow steps from the
   [PubNub Account section](https://github.com/pubnub/react-chat-components/blob/master/lib/README.md#pubnub-account)
   to create your own keys and paste them into `pubnub-keys.json`:

```bash
vi pubnub-keys.json
```

4. Run the application:

```bash
npm start
```

5. For the moderated chat sample, enable _Files_, _Storage & Playback_, and _Objects_ with _Channel Metadata Events_ and _User Metadata Events_ on your keyset. 

    Then, initialize the keyset with objects data.

```bash
node moderated-chat/populate.js
```

## Components Installation

Install the components and all required dependencies using npm:

```bash
npm install --save pubnub pubnub-react @pubnub/react-chat-components
```

## Components Usage

1. Import PubNub, PubNub React Provider and the components:

```js
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import {
  Chat,
  MessageList,
  MessageInput,
  ChannelList,
  MemberList,
} from "@pubnub/react-chat-components";
```

2. Create your PubNub client and rest of the configuration for the Chat, which serves as a common
   context for all of the components:

```jsx
const pubnub = new PubNub({
  publishKey: "myPublishKey",
  subscribeKey: "mySubscribeKey",
  uuid: "myUniqueUUID",
});
const currentChannel = "myCurrentChannel";
const theme = "light";
```

3. Feed the PubNub Provider with your newly created client as with other PubNub React applications:

```jsx
const MyComponent = () => {
  return <PubNubProvider client={pubnub}></PubNubProvider>;
};
```

4. Place the components within the Chat state provider in any order that your app requires.
   Components can be tweaked later on using option properties and CSS variables:

```jsx
const MyComponent = () => {
  return (
    <PubNubProvider client={pubnub}>
      <Chat {...{ currentChannel, theme }}>
        <MessageList />
        <MessageInput />
      </Chat>
    </PubNubProvider>
  );
};
```

5. Check out the
   [PubNub Chat Components Documentation](https://pubnub.github.io/react-chat-components/docs) to
   learn more about how to use the components and the
   [PubNub Chat Components Samples](https://pubnub.github.io/react-chat-components/samples) to see
   what is possible using the components. Source code of the sample applications can be found in the
   `samples` folder in the repository root.
