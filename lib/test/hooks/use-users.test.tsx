import React from "react";
import PubNub from "pubnub";
import { renderHook, waitFor } from "@testing-library/react";
import { PubNubProvider } from "pubnub-react";

import { useUsers } from "../../src/hooks";
import { PubNubMock } from "../../mock/pubnub-mock";
import users from "../../../data/users/users.json";

const pubnub = PubNubMock({}) as PubNub;
const wrapper = ({ children }) => <PubNubProvider client={pubnub}>{children}</PubNubProvider>;

describe("useUsers", () => {
  test("fetches and returns the full list of users", async () => {
    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      const [receivedUsers, fetchMore, total, error] = result.current;
      expect(receivedUsers).toHaveLength(users.length);
      expect(typeof fetchMore).toEqual("function");
      expect(total).toEqual(users.length);
      expect(error).toEqual(undefined);
    });
  });

  test("fetches and returns subsequent pages when fetchMore is called", async () => {
    const limit = 10;
    const { result } = renderHook(() => useUsers({ limit }), { wrapper });

    await waitFor(() => {
      const [receivedUsers, fetchMore, total] = result.current;
      expect(receivedUsers).toHaveLength(limit);
      expect(total).toEqual(users.length);
      fetchMore();
    });

    await waitFor(() => {
      const [receivedUsers, fetchMore] = result.current;
      expect(receivedUsers).toHaveLength(limit * 2);
      fetchMore();
    });

    await waitFor(() => {
      const [receivedUsers] = result.current;
      expect(receivedUsers).toHaveLength(limit * 3);
    });
  });
});
