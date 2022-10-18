import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { PubNubProvider } from "pubnub-react";

import { useUser } from "../src/hooks";
import { PubNubMock } from "../mock/pubnub-mock";
import users from "../../../data/users/users.json";

const pubnub = new PubNubMock({});
const wrapper = ({ children }) => <PubNubProvider client={pubnub}>{children}</PubNubProvider>;

describe("useUser", () => {
  test("fetches and returns given user", async () => {
    const expectedUser = users[0];
    const { result } = renderHook(() => useUser({ uuid: expectedUser.id }), { wrapper });

    await waitFor(() => {
      const [receivedUser, error] = result.current;
      expect(receivedUser).toEqual(expectedUser);
      expect(error).toEqual(undefined);
    });
  });

  test("returns nothing when given user was not found", async () => {
    const { result } = renderHook(() => useUser({ uuid: "some-unexisting-user" }), { wrapper });

    await waitFor(() => {
      const [receivedUser, error] = result.current;
      expect(receivedUser).toEqual(null);
      expect(error).toEqual(undefined);
    });
  });

  test("refetches after options were changed", async () => {
    const initialUser = users[0];
    const expectedUser = users[1];
    const { result, rerender } = renderHook((uuid) => useUser({ uuid }), {
      wrapper,
      initialProps: initialUser.id,
    });

    await waitFor(() => {
      const [receivedUser] = result.current;
      expect(receivedUser).toEqual(initialUser);
    });

    rerender(expectedUser.id);

    await waitFor(() => {
      const [receivedUser] = result.current;
      expect(receivedUser).toEqual(expectedUser);
    });
  });
});
