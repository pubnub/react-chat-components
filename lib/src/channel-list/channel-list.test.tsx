import React from "react";
import { render } from "@test/custom-renderer";
import "@testing-library/jest-dom/extend-expect";

import channels from "../../data/channels.json";
import { ChannelList } from "./channel-list";

test("renders a message", () => {
  const { container, getByText } = render(<ChannelList channelList={channels} />);

  expect(getByText("Hello, world!")).toBeInTheDocument();
  expect(container.firstChild).toMatchInlineSnapshot(`
    <h1>Hello, World!</h1>
  `);
});
