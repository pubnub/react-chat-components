# React Chat Components

PubNub's Chat Components library provides easy-to-use components to build chat applications using
PubNub Chat on the React Framework. Our component library is the fastest way to add chat features
like direct and group messaging, typing indicators, reactions and more without going through the
complexity of low-level architecture of realtime networks. At the same time it allows you to create
apps for various use cases, with different functionalities and customizable looks.

![PubNub Chat Components](https://i.imgur.com/992eLO8.png)

* **Reduced Implementation Time**. Develop proof-of-concept and production ready apps faster using predefined components.
* **Fast and Simple Extensibility**. Add rich features like typing indicators, read receipts, reactions etc. without writing complex code.
* **Flexible and Customizable Components**. Customize component design and add custom components to extend functionality.
* **High Scalability**. Let PubNub take care of scaling and reliability as you grow your app.
* **Easy Theming**. Use the built-in light and dark themes or create custom ones for various use cases: group, support, and event chats.
* **Strong Typing**. Utilize the power of TypeScript to develop your application.

<img src={Screenshot} alt="PubNub Chat Components" style={{ margin: "20px 0 0 -54px" } } />

## Sample apps

Make sure to check out the [sample applications](https://pubnub.github.io/react-chat-components/samples) built using PubNub Chat Components for React.

## Chat features

* **User and Channel Metadata**: add additional information about the users, channels, and their memberships from PubNub Objects storage using custom hooks
* **Subscriptions**: subscribe to user channels automatically
* **Messages**: publish and display new and historical text messages
* **Presence**: get currently active users, observe their state, and notify about changes
* **Typing Indicators**: display notifications that users are typing
* **Message Reactions**: publish and add emojis to messages

## Requirements

* React v16.8+ and ReactDOM v16.8+
* [PubNub JavaScript SDK v4.29+](https://www.pubnub.com/docs/sdks/javascript/)
* [PubNub React SDK v2.1.0+](https://www.pubnub.com/docs/chat/react/setup)

## Available components

* [Chat (obligatory state provider)](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-chat-provider--default)
* [Message List](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-message-list--default)
* [Message Input](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-message-input--default)
* [Channel List](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-channel-list--default)
* [Member List](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-member-list--default)
* [Typing Indicator](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-typing-indicator--default)

## Usage

Set up and use PubNub Chat Components for React to build your own chat application.

### Set up PubNub account

1. Sign in or create an account to create an app on the [Admin Portal](https://dashboard.pubnub.com/) and get the keys to use in your application.

2. When you create a new app, the first set of keys is generated automatically, but a single app can have as many keysets as you like. We recommend that you create separate keysets for production and test environments.

3. Some of the functionalities you might want to enable on your keyset depending on the use-case include _Presence_, _Storage & Playback_ (including correct Retention) and _Objects_ (be sure to select a geographical region corresponding to most users of your application).

### Install and use components

1. Install the components and all required dependencies using npm.

  ```bash
  npm install --save pubnub pubnub-react @pubnub/react-chat-components
  ```

2. Import PubNub, PubNub React Provider and the components.

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

3. Create your PubNub client and rest of the configuration for the `Chat` provider.

  ```jsx
  const pubnub = new PubNub({
    publishKey: "myPublishKey",
    subscribeKey: "mySubscribeKey",
    uuid: "myUniqueUUID",
  });
  const currentChannel = "myCurrentChannel";
  const theme = "light";
  ```

4. Feed the PubNub Provider with your newly created client as with other PubNub React applications.

  ```jsx
  const MyComponent = () => {
    return <PubNubProvider client={pubnub}></PubNubProvider>;
  };
  ```

5. Place the components within the Chat state provider in any order that your app requires.
   Components can be tweaked later on using option properties and CSS variables.

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

6. Check out the [sample apps](https://pubnub.github.io/react-chat-components/samples) to see what is possible using the components. Source code of the sample applications can be found in the `samples` folder in the repository root.