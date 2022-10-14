import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { PubNubProvider } from "pubnub-react";

import { usePresence } from "../src/hooks";
import { PubNubMock } from "../mock/pubnub-mock";
import users from "../../../data/users/users.json";

const pubnub = new PubNubMock({});
const wrapper = ({ children }) => <PubNubProvider client={pubnub}>{children}</PubNubProvider>;

describe("usePresence", () => {
  test("fetches and returns presence data for a single channel", async () => {
    const channelName = "test-channel";
    const { result } = renderHook(() => usePresence({ channels: [channelName] }), { wrapper });

    await waitFor(() => {
      const [presenceData, , total, error] = result.current;
      expect(presenceData).toHaveProperty(channelName);
      expect(presenceData[channelName].occupancy).toEqual(users.length);
      expect(presenceData[channelName].occupants).toHaveLength(users.length);
      expect(total).toEqual(users.length);
      expect(error).toEqual(undefined);
    });
  });

  test("fetches and returns presence data for multiple channels", async () => {
    const channelName = "test-channel";
    const channelName2 = "test-channel-2";
    const { result } = renderHook(() => usePresence({ channels: [channelName, channelName2] }), {
      wrapper,
    });

    await waitFor(() => {
      const [presenceData, , total, error] = result.current;
      expect(presenceData).toHaveProperty(channelName);
      expect(presenceData).toHaveProperty(channelName2);
      expect(presenceData[channelName].occupancy).toEqual(users.length);
      expect(presenceData[channelName].occupants).toHaveLength(users.length);
      expect(total).toEqual(users.length * 2);
      expect(error).toEqual(undefined);
    });
  });

  test("resets the presence data when options change", async () => {
    const channelName = "test-channel";
    const channelName2 = "test-channel-2";
    const { result, rerender } = renderHook((options) => usePresence(options), {
      wrapper,
      initialProps: { channels: [channelName, channelName2] },
    });

    await waitFor(() => {
      const [presenceData, , total] = result.current;
      expect(Object.keys(presenceData).length).toEqual(2);
      expect(total).toEqual(users.length * 2);
    });

    rerender({ channels: [channelName] });

    await waitFor(() => {
      const [presenceData, , total] = result.current;
      expect(Object.keys(presenceData).length).toEqual(1);
      expect(presenceData).not.toHaveProperty(channelName2);
      expect(total).toEqual(users.length);
    });
  });
});
