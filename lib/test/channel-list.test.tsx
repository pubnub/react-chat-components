import React from "react";

import { ChannelList } from "../src/channel-list/channel-list";
import channels from "../../data/channels-work.json";
import { render, screen, fireEvent } from "../mock/custom-renderer";

describe("Channel List", () => {
  test("renders channels from objects", () => {
    render(<ChannelList channels={channels} />);

    expect(screen.getByText("Introductions")).toBeVisible();
    expect(screen.getByText("This channel is for company wide chatter")).toBeVisible();
  });

  test("renders channels from strings", () => {
    render(<ChannelList channels={["Introductions", "Examples"]} />);

    expect(screen.getByText("Introductions")).toBeVisible();
  });

  test("renders current channel as active", () => {
    render(<ChannelList channels={channels} />, {
      providerProps: {
        currentChannel: "space_ac4e67b98b34b44c4a39466e93e",
      },
    });

    expect(screen.getByText("Introductions").parentElement.parentElement).toHaveClass(
      "pn-channel--active"
    );
  });

  test("renders passed in children", () => {
    const { container } = render(
      <ChannelList channels={channels}>
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
    render(<ChannelList channels={channels} channelRenderer={customRenderer} />);

    expect(screen.getByText("Custom Introductions")).toBeVisible();
    expect(screen.queryByText("Introductions")).not.toBeInTheDocument();
  });

  test("filters channels with custom function", () => {
    const customFilter = (channel) => channel.name !== "Introductions";
    render(<ChannelList channels={channels} filter={customFilter} />);

    expect(screen.getByText("Running")).toBeVisible();
    expect(screen.queryByText("Introductions")).not.toBeInTheDocument();
  });

  test("sorts channels with custom function", () => {
    const customSorter = (a, b) => b.name.localeCompare(a.name, "en", { sensitivity: "base" });
    const { container } = render(<ChannelList channels={channels} sort={customSorter} />);

    expect(container.firstChild.firstChild).toHaveTextContent("Running");
    expect(container.firstChild.lastChild).toHaveTextContent("Company Culture");
  });

  test("emits events on channel clicks", () => {
    const handleClick = jest.fn();
    render(<ChannelList channels={channels} onChannelSwitched={handleClick} />);
    fireEvent.click(screen.getByText("Introductions"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("emits nothing on channel clicks when no callback", () => {
    const handleClick = jest.fn();
    render(<ChannelList channels={channels} />);
    fireEvent.click(screen.getByText("Introductions"));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
