import React from "react";
import PubNub from "pubnub";
import { renderHook, waitFor } from "@testing-library/react";
import { PubNubProvider } from "pubnub-react";

import { useUserMemberships } from "../../src/hooks";
import { PubNubMock } from "../../mock/pubnub-mock";
import channels from "../../../data/channels/work.json";

const pubnub = PubNubMock({}) as PubNub;
const wrapper = ({ children }) => <PubNubProvider client={pubnub}>{children}</PubNubProvider>;

describe("useUserMemberships", () => {
  test("fetches and returns the full list of memberships", async () => {
    const { result } = renderHook(() => useUserMemberships({ uuid: "test-user" }), {
      wrapper,
    });

    await waitFor(() => {
      const [receivedChannels, fetchMore, resetHook, total, error] = result.current;
      expect(receivedChannels).toHaveLength(channels.length);
      expect(typeof fetchMore).toEqual("function");
      expect(typeof resetHook).toEqual("function");
      expect(total).toEqual(channels.length);
      expect(error).toEqual(undefined);
    });
  });

  test("fetches and returns subsequent pages when fetchMore is called", async () => {
    const limit = 3;
    const { result } = renderHook(() => useUserMemberships({ uuid: "test-user", limit }), {
      wrapper,
    });

    await waitFor(() => {
      const [receivedChannels, fetchMore, , total] = result.current;
      expect(receivedChannels).toHaveLength(limit);
      expect(total).toEqual(channels.length);
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

  test("resets the results when reset is called", async () => {
    const limit = 3;
    const { result } = renderHook(() => useUserMemberships({ uuid: "test-user", limit }), {
      wrapper,
    });

    await waitFor(() => {
      const [receivedChannels, fetchMore, , total] = result.current;
      expect(receivedChannels).toHaveLength(limit);
      expect(total).toEqual(channels.length);
      fetchMore();
    });

    await waitFor(() => {
      const [receivedChannels, , resetHook] = result.current;
      expect(receivedChannels).toHaveLength(limit * 2);
      resetHook();
    });

    await waitFor(() => {
      const [receivedChannels] = result.current;
      expect(receivedChannels).toHaveLength(limit);
    });
  });

  test("resets the results when reset is called", async () => {
    const limit = 3;
    const { result, rerender } = renderHook((props) => useUserMemberships(props), {
      wrapper,
      initialProps: {
        limit,
        uuid: "test-user",
      },
    });

    await waitFor(() => {
      const [receivedChannels, fetchMore, , total] = result.current;
      expect(receivedChannels).toHaveLength(limit);
      expect(total).toEqual(channels.length);
      fetchMore();
    });

    await waitFor(() => {
      const [receivedChannels] = result.current;
      expect(receivedChannels).toHaveLength(limit * 2);
    });

    rerender({ limit, uuid: "test-user-2" });

    await waitFor(() => {
      const [receivedChannels] = result.current;
      expect(receivedChannels).toHaveLength(limit);
    });
  });
});
