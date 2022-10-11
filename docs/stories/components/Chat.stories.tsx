import React from "react";
import { Story, Meta } from "@storybook/react";
import { Chat, ChatProps } from "@pubnub/react-chat-components/src";

export default {
  title: "Components/Chat (Provider)",
  component: Chat,
} as Meta;

const Template: Story<ChatProps> = (args) => <Chat {...args} />;

export const Default = Template.bind({});