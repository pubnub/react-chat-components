# Group Chat

`group-chat` is an app that showcases a complex chat use case allowing you to see most PubNub Chat Components for React in action. After running the app, you can send messages as a sample user in a 1:1 and group channel, upload files, and add message reactions to messages. Additionally, this app (also referred to as "moderated chat app") works as a showcase app on which you can test features offered by our [Moderation Dashboard](https://www.pubnub.com/docs/chat/moderation-dashboard/getting-started) to learn how to moderate and manage users, messages, and channels with PubNub.

![Group chat app for React](../assets/group-chat.png")

## Prerequisites

This application uses [React v16.8+](https://www.npmjs.com/package/react/v/16.8.0), [ReactDOM v16.8+](https://www.npmjs.com/package/react-dom), [PubNub JavaScript SDK v4.29+](https://www.pubnub.com/docs/sdks/javascript/), and [PubNub React SDK v2.1.0+](https://www.pubnub.com/docs/chat/react/setup).

To use the app, you need:

* [npm](https://docs.npmjs.com/cli/v6/commands/npm-install)
* [Node.js](https://nodejs.org/en/download/)
* Code editor (e.g. [Visual Studio Code](https://code.visualstudio.com/download))
* PubNub [account](https://www.pubnub.com/docs/setup/account-setup) on the
[Admin Portal](https://admin.pubnub.com/) with [Publish and Subscribe Keys](https://www.pubnub.com/docs/basics/initialize-pubnub) for your chat app with this configuration enabled:
    * Presence
    * Files (select a region)
    * Message persistence
    * Objects (select a region and enable User Metadata Events, Channel Metadata Events, and Membership Events)

## Usage

Follow the steps to run the app locally.

1. Clone the repository.

    ```bash
    git clone https://github.com/pubnub/react-chat-components.git
    ```

1. Go to the `samples/group-chat` folder.

    ```bash
    cd samples/group-chat
    ```

1. Install the dependencies.

    ```bash
    npm install
    ```

1. Copy the `.env.example` file as `.env` and paste your Publish and Subscribe Keys there.

1. Prepopulate sample user and channel object metadata (required if you want to test the sample app against [Moderation Dashboard](https://www.pubnub.com/docs/chat/moderation-dashboard/getting-started)).

    ```bash
    npm run setup
    ```

1. Run the application.

    ```bash
    npm start
    ```

## Components

The `group-chat` app showcases these PubNub Chat Components for React:

* [Chat Provider](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-chat-provider--default)
* [Message List](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-message-list--default)
* [Message Input](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-message-input--default)
* [Member List](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-member-list--default)
* [Channel List](https://pubnub.github.io/react-chat-components/docs/?path=/docs/components-channel-list--default)