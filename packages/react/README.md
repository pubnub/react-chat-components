# PubNub Chat Components for React

PubNub Chat Components for React are the fastest way to add chat features like direct and group messaging, typing indicators, or reactions, without going through the complexity of the low-level architecture of real-time networks.

- **Reduced Implementation Time**: Develop proof-of-concept and production-ready apps faster using predefined components.
- **Fast and Simple Extensibility**: Add rich features, like typing indicators, read receipts, or reactions, without writing complex code.
- **Flexible and Customizable Components**: Customize component design and add custom components to extend functionality.
- **High Scalability**: Let PubNub take care of scaling and reliability as you grow your app.
- **Easy Theming**: Use the built-in light and dark themes or create custom ones for various use cases: group, support, and event chats.
- **Strong Typing**: Utilize the power of TypeScript to develop your application.

![PubNub Chat Components](screenshot-desktop.png)

> Apart from PubNub Chat Components for React, we provide a separate npm package for React Native. Check out our [PubNub Chat Components for React Native](https://www.npmjs.com/package/@pubnub/react-native-chat-components) for more details.

## Features

- **User and Channel Metadata**: Add additional information about the users, channels, and their memberships from PubNub Objects storage using custom hooks
- **Subscriptions**: Subscribe to user channels automatically
- **Messages**: Publish and display new and historical text messages
- **Presence**: Get currently active users, observe their state, and notify them about changes
- **Typing Indicators**: Display notifications that users are typing
- **Message Reactions**: Publish and add emojis to messages

## Available components

- [Chat Provider](https://www.pubnub.com/docs/chat/components/react/chat-provider)
- [Message List](https://www.pubnub.com/docs/chat/components/react/ui-components/message-list)
- [Message Input](https://www.pubnub.com/docs/chat/components/react/ui-components/message-input)
- [Channel List](https://www.pubnub.com/docs/chat/components/react/ui-components/channel-list)
- [Member List](https://www.pubnub.com/docs/chat/components/react/ui-components/member-list)
- [Typing Indicator](https://www.pubnub.com/docs/chat/components/react/ui-components/typing-indicator)

## Prerequisites

- React v16.8+ and ReactDOM v16.8+
- [PubNub JavaScript SDK v4.29+](https://www.pubnub.com/docs/sdks/javascript/)
- [PubNub React SDK v2.1.0+](https://www.pubnub.com/docs/chat/react/setup)

## Usage

Start by exploring our demo apps that were built using chat components:

| Source code | Link | Description |
| :-- | :-- | :-- |
| [`getting-started`](https://github.com/pubnub/react-chat-components/tree/master/samples/react/getting-started) | [Tutorial](https://www.pubnub.com/docs/chat/components/react) | Sample 1:1 chat app to get started |
| [`group-chat`](https://github.com/pubnub/react-chat-components/tree/master/samples/react/group-chat) | [Demo](https://react-components-chat.pubnub.com/) / [Tutorial](https://www.pubnub.com/tutorials/group-chat-tutorial-react/) | Complex moderated group chat app |
| [`live-events`](https://github.com/pubnub/react-chat-components/tree/master/samples/react/live-events) | [Demo](https://rcc-live-event.surge.sh/) / [Tutorial](https://www.pubnub.com/tutorials/virtual-events-tutorial-react/) | Live events app with a chat panel |
| [`telehealth`](https://github.com/pubnub/react-chat-components/tree/master/samples/react/telehealth) | [Demo](https://rcc-telehealth.surge.sh/) / [Tutorial](https://www.pubnub.com/tutorials/cross-platform-chat-application-telehealth-react/) | Simple patient-doctor chat app |

## Related documentation

- [PubNub Chat Components for React Documentation](https://www.pubnub.com/docs/chat/components/react) - documentation explaining how to work with PubNub Chat Components for React
- [PubNub chat use-case](https://www.pubnub.com/docs/chat/overview) - documentation for the chat use-case
- [PubNub React SDK](https://www.pubnub.com/docs/chat/react/setup) - API documentation for the PubNub React SDK

## Support

If you need help or have a general question, [contact support](mailto:support@pubnub.com).
