import React from "react";

import { ChannelList } from "../src/channel-list/channel-list";
import channels from "../../data/channels.json";
import { render, screen, fireEvent } from "./helpers/custom-renderer";

test("renders channels from objects", () => {
  const { getByText } = render(<ChannelList channelList={channels} />);

  expect(getByText("Introductions")).toBeInTheDocument();
  expect(getByText("This channel is for company wide chatter")).toBeInTheDocument();
});

test("renders channels from strings", () => {
  const { getByText } = render(<ChannelList channelList={["Introductions", "Examples"]} />);

  expect(getByText("Introductions")).toBeInTheDocument();
});

test("renders current channel as active", () => {
  const { getByText } = render(<ChannelList channelList={channels} />, {
    providerProps: {
      channel: "space_ac4e67b98b34b44c4a39466e93e",
    },
  });

  expect(getByText("Introductions").parentElement.parentElement).toHaveClass("pn-channel--active");
});

test("renders passed in children", () => {
  const { container } = render(
    <ChannelList channelList={channels}>
      <p>Test String</p>
    </ChannelList>
  );

  expect(container.firstChild.lastChild).toMatchInlineSnapshot(`
    <p>
      Test String
    </p>
  `);
});

test("renders with custom renderer", () => {
  const customRenderer = (channel) => <p key={channel.name}>Custom {channel.name}</p>;
  const { getByText, queryByText } = render(
    <ChannelList channelList={channels} channelRenderer={customRenderer} />
  );

  expect(getByText("Custom Introductions")).toBeInTheDocument();
  expect(queryByText("Introductions")).not.toBeInTheDocument();
});

test("filters channels with custom function", () => {
  const customFilter = (channel) => channel.name !== "Introductions";
  const { getByText, queryByText } = render(
    <ChannelList channelList={channels} filter={customFilter} />
  );

  expect(getByText("Running")).toBeInTheDocument();
  expect(queryByText("Introductions")).not.toBeInTheDocument();
});

test("sorts channels with custom function", () => {
  const customSorter = (a, b) => b.name.localeCompare(a.name, "en", { sensitivity: "base" });
  const { container } = render(<ChannelList channelList={channels} sort={customSorter} />);

  expect(container.firstChild.firstChild).toHaveTextContent("Running");
  expect(container.firstChild.lastChild).toHaveTextContent("Company Culture");
});

test("emits events on channel clicks", () => {
  const handleClick = jest.fn();
  render(<ChannelList channelList={channels} onChannelSwitched={handleClick} />);
  fireEvent.click(screen.getByText("Introductions"));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

test("emits nothing on channel clicks when no callback", () => {
  const handleClick = jest.fn();
  render(<ChannelList channelList={channels} />);
  fireEvent.click(screen.getByText("Introductions"));

  expect(handleClick).not.toHaveBeenCalled();
});
