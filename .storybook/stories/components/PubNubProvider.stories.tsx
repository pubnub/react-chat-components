import React from "react";
import { Story, Meta } from "@storybook/react";
import { PubNubProvider, PubNubProviderProps } from "../../../src";

export default {
  title: "Components/PubNub Provider",
  component: PubNubProvider,
} as Meta;

const Template: Story<PubNubProviderProps> = (args) => <PubNubProvider {...args} />;

export const Default = Template.bind({});
