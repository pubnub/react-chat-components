# PubNub Chat Components for React

PubNub Chat Components for React are the fastest way to add chat features like direct and group
messaging, typing indicators, reactions, without going through the complexity of low-level
architecture of realtime networks.

- **Reduced Implementation Time**: Develop proof-of-concept and production ready apps faster using
  predefined components.
- **Fast and Simple Extensibility**: Add rich features like typing indicators, read receipts,
  reactions etc. without writing complex code.
- **Flexible and Customizable Components**: Customize component design and add custom components to
  extend functionality.
- **High Scalability**: Let PubNub take care of scaling and reliability as you grow your app.
- **Easy Theming**: Use the built-in light and dark themes or create custom ones for various use
  cases: group, support, and event chats.
- **Strong Typing**: Utilize the power of TypeScript to develop your application.

![PubNub Chat Components](https://i.imgur.com/992eLO8.png)

## Features

- **User and Channel Metadata**: Add additional information about the users, channels, and their
  memberships from PubNub Objects storage using custom hooks
- **Subscriptions**: Subscribe to user channels automatically
- **Messages**: Publish and display new and historical text messages
- **Presence**: Get currently active users, observe their state, and notify about changes
- **Typing Indicators**: Display notifications that users are typing
- **Message Reactions**: Publish and add emojis to messages

## Available components

- [Chat (obligatory state provider)](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-chat-provider--default)
- [Message List](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-message-list--default)
- [Message Input](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-message-input--default)
- [Channel List](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-channel-list--default)
- [Member List](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-member-list--default)
- [Typing Indicator](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-typing-indicator--default)

## Prerequisites

- React v16.8+ and ReactDOM v16.8+
- [PubNub JavaScript SDK v4.29+](https://www.pubnub.com/docs/sdks/javascript/)
- [PubNub React SDK v2.1.0+](https://www.pubnub.com/docs/chat/react/setup)

## Usage

Start by exploring our demo apps that were built using chat components:

| Source code                                                                                              | Demo / Tutorial                                                                                                | Description                        |
| :------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :--------------------------------- |
| [`getting-started`](https://github.com/pubnub/react-chat-components/tree/master/samples/getting-started) | [Tutorial](https://pubnub.github.io/react-chat-components/docs/?path=/docs/introduction-getting-started--page) | Sample 1:1 chat app to get started |
| [`group-chat`](https://github.com/pubnub/react-chat-components/tree/master/samples/group-chat)           | [Demo](https://react-components-chat.pubnub.com/)                                                              | Complex moderated group chat app   |
| [`live-events`](https://github.com/pubnub/react-chat-components/tree/master/samples/live-events)         | [Demo](https://rcc-live-event.surge.sh/)                                                                       | Live events app with a chat panel  |
| [`telehealth`](https://github.com/pubnub/react-chat-components/tree/master/samples/telehealth)           | [Demo](https://rcc-telehealth.surge.sh/)                                                                       | Simple patient-doctor chat app     |

## Related documentation

- [PubNub Chat Components for React Documentation](https://pubnub.github.io/react-chat-components/docs/) -
  documentation explaining how to work with PubNub Chat Components for React
- [PubNub chat use-case](https://www.pubnub.com/docs/chat/overview) - documentation for the chat
  use-case
- [PubNub React SDK](https://www.pubnub.com/docs/chat/react/setup) - API documentation for the
  PubNub React SDK

## Support

If you need help or have a general question, [contact support](mailto:support@pubnub.com).
