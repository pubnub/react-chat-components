import React from "react";
import { Story, Meta } from "@storybook/react";
import { MessageList, MessageListProps } from "pubnub-chat-components";

export default {
  title: "Components/Message List",
  component: MessageList,
} as Meta;

const Template: Story<MessageListProps> = (args) => <MessageList {...args} />;

export const Default = Template.bind({});

Default.args = {
  fetchMessages: 3,
  enableReactions: true
};