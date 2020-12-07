import React from "react";
import { Story, Meta } from "@storybook/react";
import { MessageList, MessageListProps } from "../../../src";

export default {
  title: "Components/Message List",
  component: MessageList,
} as Meta;

const Template: Story<MessageListProps> = (args) => <MessageList {...args} />;

export const Default = Template.bind({});
