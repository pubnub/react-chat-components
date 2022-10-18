import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { PubNubProvider } from "pubnub-react";

import { useChannelMembers } from "../src/hooks";
import { PubNubMock } from "../mock/pubnub-mock";
import users from "../../../data/users/users.json";

const pubnub = new PubNubMock({});
const wrapper = ({ children }) => <PubNubProvider client={pubnub}>{children}</PubNubProvider>;

describe("useChannelMembers", () => {
  test("fetches and returns the full list of memberships", async () => {
    const { result } = renderHook(() => useChannelMembers({ channel: "test-channel" }), {
      wrapper,
    });

    await waitFor(() => {
      const [receivedMembers, fetchMore, resetHook, total, error] = result.current;
      expect(receivedMembers).toHaveLength(users.length);
      expect(typeof fetchMore).toEqual("function");
      expect(typeof resetHook).toEqual("function");
      expect(total).toEqual(users.length);
      expect(error).toEqual(undefined);
    });
  });

  test("fetches and returns subsequent pages when fetchMore is called", async () => {
    const limit = 10;
    const { result } = renderHook(() => useChannelMembers({ channel: "test-channel", limit }), {
      wrapper,
    });

    await waitFor(() => {
      const [receivedMembers, fetchMore, , total] = result.current;
      expect(receivedMembers).toHaveLength(limit);
      expect(total).toEqual(users.length);
      fetchMore();
    });

    await waitFor(() => {
      const [receivedMembers, fetchMore] = result.current;
      expect(receivedMembers).toHaveLength(limit * 2);
      fetchMore();
    });

    await waitFor(() => {
      const [receivedMembers] = result.current;
      expect(receivedMembers).toHaveLength(limit * 3);
    });
  });

  test("resets the results when reset is called", async () => {
    const limit = 10;
    const { result } = renderHook(() => useChannelMembers({ channel: "test-channel", limit }), {
      wrapper,
    });

    await waitFor(() => {
      const [receivedMembers, fetchMore, , total] = result.current;
      expect(receivedMembers).toHaveLength(limit);
      expect(total).toEqual(users.length);
      fetchMore();
    });

    await waitFor(() => {
      const [receivedMembers, , resetHook] = result.current;
      expect(receivedMembers).toHaveLength(limit * 2);
      resetHook();
    });

    await waitFor(() => {
      const [receivedMembers] = result.current;
      expect(receivedMembers).toHaveLength(limit);
    });
  });

  test("resets the results when reset is called", async () => {
    const limit = 10;
    const { result, rerender } = renderHook((props) => useChannelMembers(props), {
      wrapper,
      initialProps: {
        limit,
        channel: "test-channel",
      },
    });

    await waitFor(() => {
      const [receivedMembers, fetchMore, , total] = result.current;
      expect(receivedMembers).toHaveLength(limit);
      expect(total).toEqual(users.length);
      fetchMore();
    });

    await waitFor(() => {
      const [receivedMembers] = result.current;
      expect(receivedMembers).toHaveLength(limit * 2);
    });

    rerender({ limit, channel: "test-channel-2" });

    await waitFor(() => {
      const [receivedMembers] = result.current;
      expect(receivedMembers).toHaveLength(limit);
    });
  });
});
