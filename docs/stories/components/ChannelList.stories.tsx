import React from "react";
import { Story, Meta } from "@storybook/react";
import { ChannelList, ChannelListProps } from "../../../lib/src";
import { mockChannels } from "../../pubnub-mock";

export default {
  title: "Components/Channel List",
  component: ChannelList,
} as Meta;

const Template: Story<ChannelListProps> = (args) => <ChannelList {...args} />;

export const Default = Template.bind({});

Default.args = {
  channelList: mockChannels(),
};
