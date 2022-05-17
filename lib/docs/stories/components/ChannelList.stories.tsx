import React from "react";
import { Story, Meta } from "@storybook/react";
import { ChannelList, ChannelListProps } from "../../../src";
import { workChannels as channels } from "@pubnub/react-chat-data";

export default {
  title: "Components/Channel List",
  component: ChannelList,
} as Meta;

const Template: Story<ChannelListProps> = (args) => <ChannelList {...args} />;

export const Default = Template.bind({});

Default.args = {
  channels: channels,
};
