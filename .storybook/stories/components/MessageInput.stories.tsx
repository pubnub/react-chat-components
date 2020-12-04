import React from "react";
import { Story, Meta } from "@storybook/react";
import { MessageInput, MessageInputProps } from "../../../src";

export default {
  title: "Components/Message Input",
  component: MessageInput,
} as Meta;

const Template: Story<MessageInputProps> = (args) => <MessageInput {...args} />;

export const Primary = Template.bind({});
// Primary.args = {
//   primary: true,
//   label: "Button",
// };

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: "Button",
// };

// export const Large = Template.bind({});
// Large.args = {
//   size: "large",
//   label: "Button",
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: "small",
//   label: "Button",
// };
