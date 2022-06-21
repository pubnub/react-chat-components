import { useState, useEffect, useMemo, useCallback } from "react";
import { GetMembershipsParametersv2 } from "pubnub";
import { usePubNub } from "pubnub-react";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";
import {
  VSPPubnub,
  ChannelEntity,
  UserEntity,
  FetchMembershipsFromUserParametersUsers,
  FetchMembershipsFromSpaceParameters,
} from "../types";

export const useMemberships = <
  T extends FetchMembershipsFromUserParametersUsers | FetchMembershipsFromSpaceParameters
>(
  options: T
): [
  T extends FetchMembershipsFromSpaceParameters ? ChannelEntity[] : UserEntity[],
  () => Promise<void>,
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
  const [fetching, setFetching] = useState(false);

  const paginatedOptions = useMemo(
    () =>
      merge({}, JSON.parse(jsonOptions), {
        page: { next: page },
        include: { totalCount: true },
      }) as GetMembershipsParametersv2,
    [page, jsonOptions]
  );

  const resetHook = () => {
    setEntities([]);
    setTotalCount(0);
    setPage("");
    setError(undefined);
    setDoFetch(true);
  };

  const fetchPage = useCallback(async () => {
    setDoFetch(false);
    setFetching(true);
    try {
      if (totalCount && entities.length >= totalCount) return;
      const response = await pubnub.fetchMemberships(paginatedOptions);
      // console.log("response from new hook: ", response);
      setEntities((entities) => [...entities, ...response.data.map((m) => m.user || m.space)]);
      setTotalCount(response.totalCount);
      setPage(response.next);
    } catch (e) {
      setError(e);
    } finally {
      setFetching(false);
    }
  }, [pubnub, paginatedOptions, entities.length, totalCount]);

  useEffect(() => {
    const listener = {
      space: (event) => {
        console.log("Received SPACE event: ", event);
      },
      user: (event) => {
        console.log("Received USER event: ", event);
      },
      membership: (event) => {
        console.log("Received MEMBERSHIP event: ", event);
      },
      objects: (event) => {
        console.log("Received OBJECT event: ", event);

        const message = event.message;
        if (message.type !== "membership") return;

        setEntities((entities) => {
          const entitiesCopy = cloneDeep(entities);
          const channel = entitiesCopy.find((u) => u.id === message.data.channel.id);
          const currentUuid = paginatedOptions.uuid || pubnub.getUUID();

          // Make sure the event is for the same uuid as the hook
          if (message.data.uuid.id !== currentUuid) return entitiesCopy;

          // Set events are not handled since there are no events fired for data updates
          // New memberships are not handled in order to conform to filters and pagination
          if (channel && message.event === "delete") {
            entitiesCopy.splice(entitiesCopy.indexOf(channel), 1);
          }

          return entitiesCopy;
        });
      },
    };

    pubnub.addListener(listener);

    return () => {
      pubnub.removeListener(listener);
    };
  }, [pubnub, paginatedOptions.uuid]);

  useEffect(() => {
    resetHook();
  }, [jsonOptions]);

  useEffect(() => {
    if (doFetch && !fetching) fetchPage();
  }, [doFetch, fetching, fetchPage]);

  return [entities, fetchPage, resetHook, totalCount, error];
};
