import { useState, useEffect, useMemo } from "react";
import { usePubNub } from "pubnub-react";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";
import {
  VSPPubnub,
  ChannelEntity,
  UserEntity,
  FetchMembershipsFromUserParameters,
  FetchMembershipsFromSpaceParameters,
} from "../types";

export const useMemberships = <
  T extends FetchMembershipsFromUserParameters | FetchMembershipsFromSpaceParameters
>(
  options: T
): [
  T extends FetchMembershipsFromSpaceParameters ? ChannelEntity[] : UserEntity[],
  () => void,
  () => void,
  number,
  Error
] => {
  const jsonOptions = JSON.stringify(options);

  const pubnub = usePubNub() as VSPPubnub;
  const [entities, setEntities] = useState<ChannelEntity[] | UserEntity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState("");
  const [error, setError] = useState<Error>();
  const [doFetch, setDoFetch] = useState(true);

  const paginatedOptions = useMemo(
    () =>
      merge({}, JSON.parse(jsonOptions), {
        page: { next: page },
        include: { totalCount: true },
      }) as T,
    [page, jsonOptions]
  );

  const fetchMoreMemberships = () => {
    setDoFetch(true);
  };

  const resetHook = () => {
    setEntities([]);
    setTotalCount(0);
    setPage("");
    setError(undefined);
    setDoFetch(true);
  };

  useEffect(() => {
    resetHook();
  }, [jsonOptions]);

  useEffect(() => {
    let ignoreRequest = false;
    if (doFetch) fetchPage();

    async function fetchPage() {
      try {
        if (totalCount && entities.length >= totalCount) return;
        const response = await pubnub.fetchMemberships(paginatedOptions);
        if (ignoreRequest) return;
        setDoFetch(false);
        setEntities((entities) => [...entities, ...response.data.map((m) => m.user || m.space)]);
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
  }, [doFetch, entities.length, paginatedOptions, pubnub, totalCount]);

  useEffect(() => {
    const listener = {
      objects: (event) => {
        const message = event.message;
        if (message.type !== "membership") return;

        setEntities((entities) => {
          let membership;
          const entitiesCopy = cloneDeep(entities);

          if (paginatedOptions.spaceId !== undefined) {
            membership = entitiesCopy.find((u) => u.id === message.data.uuid.id);
            if (message.data.channel.id !== paginatedOptions.spaceId) return entitiesCopy;
          } else {
            membership = entitiesCopy.find((u) => u.id === message.data.channel.id);
            const hookUserId = paginatedOptions.userId || pubnub.getUUID();
            if (message.data.uuid.id !== hookUserId) return entitiesCopy;
          }

          // Set events are not handled since there are no events fired for data updates
          // New memberships are not handled in order to conform to filters and pagination
          if (membership && message.event === "delete") {
            entitiesCopy.splice(entitiesCopy.indexOf(membership), 1);
          }

          return entitiesCopy;
        });
      },
    };

    pubnub.addListener(listener);

    return () => {
      pubnub.removeListener(listener);
    };
  }, [pubnub, paginatedOptions.userId, paginatedOptions.spaceId]);

  return [entities, fetchMoreMemberships, resetHook, totalCount, error];
};
