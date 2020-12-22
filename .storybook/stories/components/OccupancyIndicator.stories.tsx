import React from "react";
import { Story, Meta } from "@storybook/react";
import { OccupancyIndicator, OccupancyIndicatorProps } from "../../../src";

export default {
  title: "Components/Occupancy Indicator",
  component: OccupancyIndicator,
} as Meta;

const Template: Story<OccupancyIndicatorProps> = (args) => <OccupancyIndicator {...args} />;

export const Default = Template.bind({});
