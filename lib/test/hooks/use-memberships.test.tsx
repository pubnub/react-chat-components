import React from "react";
import PubNub from "pubnub";
import { renderHook, waitFor } from "@testing-library/react";
import { PubNubProvider } from "pubnub-react";

import { useMemberships } from "../../src/hooks";
import { PubNubMock } from "../../mock/pubnub-mock";
import users from "../../../data/users/users.json";
import channels from "../../../data/channels/work.json";

const pubnub = PubNubMock({}) as PubNub;
const wrapper = ({ children }) => <PubNubProvider client={pubnub}>{children}</PubNubProvider>;

describe("useMemberships", () => {
  describe("when spaceId is passed", () => {
    test("fetches and returns the full list of memberships", async () => {
      const { result } = renderHook(() => useMemberships({ spaceId: "test-channel" }), {
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
      const { result } = renderHook(() => useMemberships({ spaceId: "test-channel", limit }), {
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
      const { result } = renderHook(() => useMemberships({ spaceId: "test-channel", limit }), {
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

    test("resets the results when options are changed", async () => {
      const limit = 10;
      const { result, rerender } = renderHook((props) => useMemberships(props), {
        wrapper,
        initialProps: {
          limit,
          spaceId: "test-channel",
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

      rerender({ limit, spaceId: "test-channel-2" });

      await waitFor(() => {
        const [receivedMembers] = result.current;
        expect(receivedMembers).toHaveLength(limit);
      });
    });
  });

  describe("when userId is passed", () => {
    test("fetches and returns the full list of memberships", async () => {
      const { result } = renderHook(() => useMemberships({ userId: "test-user" }), {
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
      const { result } = renderHook(() => useMemberships({ userId: "test-user", limit }), {
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
      const { result } = renderHook(() => useMemberships({ userId: "test-user", limit }), {
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

    test("resets the results when options are changed", async () => {
      const limit = 3;
      const { result, rerender } = renderHook((props) => useMemberships(props), {
        wrapper,
        initialProps: {
          limit,
          userId: "test-user",
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

      rerender({ limit, userId: "test-user-2" });

      await waitFor(() => {
        const [receivedChannels] = result.current;
        expect(receivedChannels).toHaveLength(limit);
      });
    });
  });
});
