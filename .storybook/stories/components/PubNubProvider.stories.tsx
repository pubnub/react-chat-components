import React from "react";
import { Story, Meta } from "@storybook/react";
import { ChatComponents, ChatComponentsProps } from "../../../src";

export default {
  title: "Components/Chat Components (Wrapper)",
  component: ChatComponents,
} as Meta;

const Template: Story<ChatComponentsProps> = (args) => <ChatComponents {...args} />;

export const Default = Template.bind({});
