import React from "react";
import { Story, Meta } from "@storybook/react";
import { ChannelList, ChannelListProps } from "@pubnub/react-chat-components/src";
import { workChannels as channels } from "@pubnub/sample-chat-data";

export default {
  title: "Components/Channel List",
  component: ChannelList,
} as Meta;

const Template: Story<ChannelListProps> = (args) => <ChannelList {...args} />;

export const Default = Template.bind({});

Default.args = {
  channels: channels,
};
