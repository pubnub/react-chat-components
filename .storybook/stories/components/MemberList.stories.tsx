import React from "react";
import { Story, Meta } from "@storybook/react";
import { MemberList, MemberListProps } from "../../../src";

export default {
  title: "Components/Member List",
  component: MemberList,
} as Meta;

const Template: Story<MemberListProps> = (args) => <MemberList {...args} />;

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
