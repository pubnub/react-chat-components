import React from "react";
import { Story, Meta } from "@storybook/react";
import { MessageInput, MessageInputProps } from "../../../src";

export default {
  title: "Components/Message Input",
  component: MessageInput,
} as Meta;

const Template: Story<MessageInputProps> = (args) => <MessageInput {...args} />;

export const Default = Template.bind({});
