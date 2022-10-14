import { useState, useEffect } from "react";
import { GetAllMetadataParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import { merge, cloneDeep } from "lodash";
import { UserEntity } from "../types";

type HookReturnValue = [UserEntity[], () => void, number, Error];

export const useUsers = (options: GetAllMetadataParameters = {}): HookReturnValue => {
  const pubnub = usePubNub();

  const [users, setUsers] = useState<UserEntity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState("");
  const [error, setError] = useState<Error>();
  const [doFetch, setDoFetch] = useState(true);

  const paginatedOptions = merge({}, options, {
    page: { next: page },
    include: { totalCount: true },
  }) as GetAllMetadataParameters;

  const fetchMoreUsers = () => {
    setDoFetch(true);
  };

  useEffect(() => {
    let ignoreRequest = false;
    if (doFetch) fetchPage();

    async function fetchPage() {
      try {
        if (totalCount && users.length >= totalCount) return;
        const response = await pubnub.objects.getAllUUIDMetadata(paginatedOptions);
        if (ignoreRequest) return;
        setDoFetch(false);
        setUsers((users) => [...users, ...response.data]);
        setTotalCount(response.totalCount);
        setPage(response.next);
      } catch (e) {
        setDoFetch(false);
        setError(e);
      }
    }

    return () => {
      ignoreRequest = true;
    };
  }, [doFetch, paginatedOptions, pubnub.objects, totalCount, users.length]);

  useEffect(() => {
    const listener = {
      objects: (event) => {
        const message = event.message;
        if (message.type !== "uuid") return;

        setUsers((users) => {
          const usersCopy = cloneDeep(users);
          const user = usersCopy.find((u) => u.id === message.data.id);

          // Set events are only handled for already fetched users in order to conform to filters and pagination
          if (user && message.event === "set") {
            Object.assign(user, message.data);
          }

          if (user && message.event === "delete") {
            usersCopy.splice(usersCopy.indexOf(user), 1);
          }

          return usersCopy;
        });
      },
    };

    pubnub.addListener(listener);

    return () => {
      pubnub.removeListener(listener);
    };
  }, [pubnub]);

  return [users, fetchMoreUsers, totalCount, error];
};
