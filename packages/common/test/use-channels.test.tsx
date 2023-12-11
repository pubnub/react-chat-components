import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { PubNubProvider } from "pubnub-react";

import { useChannels } from "../src/hooks";
import { PubNubMock } from "../mock/pubnub-mock";
import channels from "../../../data/channels/work.json";

const pubnub = new PubNubMock({});
const wrapper = ({ children }) => <PubNubProvider client={pubnub}>{children}</PubNubProvider>;

describe("useChannels", () => {
  test("fetches and returns the full list of channels", async () => {
    const { result } = renderHook(() => useChannels(), { wrapper });
    expect(result.current[4]).toBe(true);

    await waitFor(() => {
      const [receivedChannels, fetchMore, total, error, loading] = result.current;
      expect(receivedChannels).toHaveLength(channels.length);
      expect(typeof fetchMore).toEqual("function");
      expect(total).toEqual(channels.length);
      expect(error).toEqual(undefined);
      expect(loading).toEqual(false);
    });
  });

  test("fetches and returns subsequent pages when fetchMore is called", async () => {
    const limit = 3;
    const { result } = renderHook(() => useChannels({ limit }), { wrapper });

    await waitFor(() => {
      const [receivedChannels, fetchMore, total, , loading] = result.current;
      expect(receivedChannels).toHaveLength(limit);
      expect(total).toEqual(channels.length);
      expect(loading).toEqual(false);
      fetchMore();
    });

    await waitFor(() => {
      const [receivedChannels, fetchMore] = result.current;
      expect(receivedChannels).toHaveLength(limit * 2);
      fetchMore();
    });

    await waitFor(() => {
      const [receivedChannels] = result.current;
      expect(receivedChannels).toHaveLength(limit * 3);
    });
  });
});
