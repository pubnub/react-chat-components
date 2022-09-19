import React from "react";
import { Story, Meta } from "@storybook/react";
import {
  TypingIndicator,
  TypingIndicatorProps,
  MessageInput,
  MessageList,
} from "@pubnub/react-chat-components/src";

export default {
  title: "Components/Typing Indicator",
  component: TypingIndicator,
} as Meta;

const Template: Story<TypingIndicatorProps> = (args) => (
  <div>
    <MessageList welcomeMessages={false}>
      <TypingIndicator {...args} />
    </MessageList>
    <MessageInput typingIndicator />
  </div>
);

export const Default = Template.bind({});
