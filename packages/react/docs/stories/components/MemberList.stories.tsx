import React from "react";
import { Story, Meta } from "@storybook/react";
import { MemberList, MemberListProps } from "../../../src";
import users from "../../../../data/users/users.json";

export default {
  title: "Components/Member List",
  component: MemberList,
} as Meta;

const Template: Story<MemberListProps> = (args) => <MemberList {...args} />;

export const Default = Template.bind({});

Default.args = {
  members: users,
};
