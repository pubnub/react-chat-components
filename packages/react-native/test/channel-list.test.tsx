import React from "react";
import { Text } from "react-native";

import { ChannelList } from "../src/channel-list/channel-list";
import defaultStyle from "../src/channel-list/channel-list.style";
import channels from "../../../data/channels/work.json";
import { render, screen, fireEvent } from "../mock/custom-renderer";

const componentStyles = defaultStyle("light");

describe("Channel List", () => {
  test("renders channels from objects", () => {
    render(<ChannelList channels={channels} />);

    expect(screen.getByText("Introductions")).not.toBeNull();
    expect(screen.getByText("This channel is for company wide chatter")).not.toBeNull();
  });

  test("renders channels from strings", () => {
    render(<ChannelList channels={["Introductions", "Examples"]} />);

    expect(screen.getByText("Introductions")).not.toBeNull();
  });

  test("renders current channel as active", () => {
    const channelId = "space.ac4e67b98b34b44c4a39466e93e";
    render(<ChannelList channels={channels} />, {
      providerProps: {
        currentChannel: channelId,
      },
    });

    expect(screen.getByText("Introductions").parent.parent.parent).toHaveStyle({
      backgroundColor: componentStyles.channelActive.backgroundColor,
    });
  });

  test("renders passed in children", () => {
    render(
      <ChannelList channels={channels}>
        <Text>Test String</Text>
      </ChannelList>
    );

    const child = screen.getByText("Test String");
    expect(screen.getByTestId("channel-list-wrapper")).toContainElement(child);
  });

  test("renders with custom renderer", () => {
    const customRenderer = (channel) => <Text>Custom {channel.name}</Text>;
    render(<ChannelList channels={channels} channelRenderer={customRenderer} />);

    expect(screen.getByText("Custom Introductions")).not.toBeNull();
    expect(screen.queryByText("Introductions")).toBeNull();
  });

  test("renders extra actions", () => {
    const customRenderer = (channel) => <Text>{channel.name} Extra Action</Text>;
    render(<ChannelList channels={channels} extraActionsRenderer={customRenderer} />);

    expect(screen.getByText("Introductions Extra Action")).not.toBeNull();
  });

  test("emits events on channel presses", () => {
    const handleClick = jest.fn();
    render(<ChannelList channels={channels} onChannelSwitched={handleClick} />);
    fireEvent.press(screen.getByText("Introductions"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("emits events on channel long presses", () => {
    const handleClick = jest.fn();
    render(<ChannelList channels={channels} onChannelLongPressed={handleClick} />);
    fireEvent(screen.getByText("Introductions"), "onLongPress");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("emits nothing on channel presses when no callback", () => {
    const handleClick = jest.fn();
    render(<ChannelList channels={channels} />);
    fireEvent.press(screen.getByText("Introductions"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  test("sorts channels with custom function", () => {
    const customSorter = (a, b) => b.name.localeCompare(a.name, "en", { sensitivity: "base" });
    render(<ChannelList channels={channels} sort={customSorter} />);

    expect(screen.getByTestId("channel-list").props.data[0].name).toBe("Running");
    expect(screen.getByTestId("channel-list").props.data[channels.length - 1].name).toBe(
      "Company Culture"
    );
  });
});
