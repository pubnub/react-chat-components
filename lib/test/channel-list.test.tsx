import React from "react";

import { ChannelList } from "../src/channel-list/channel-list";
import channels from "../../data/channels.json";
import { render } from "./custom-renderer";

test("renders channel info", () => {
  const { getByText } = render(<ChannelList channelList={channels} />);

  expect(getByText("Introductions")).toBeInTheDocument();
  expect(getByText("This channel is for company wide chatter")).toBeInTheDocument();
});

test("renders current channel as active", () => {
  const { getByText } = render(<ChannelList channelList={channels} />, {
    providerProps: {
      channel: "space_ac4e67b98b34b44c4a39466e93e",
    },
  });

  expect(getByText("Introductions").parentElement.parentElement).toHaveClass("pn-channel--active");
});
