import { useState, useEffect, useMemo } from "react";
import { GetMembershipsParametersv2 } from "pubnub";
import { usePubNub } from "pubnub-react";
import { merge, cloneDeep } from "lodash";
import { ChannelEntityWithMembership } from "../types";

type HookReturnValue = [ChannelEntityWithMembership[], () => void, () => void, number, Error];

export const useUserMemberships = (options: GetMembershipsParametersv2 = {}): HookReturnValue => {
  const jsonOptions = JSON.stringify(options);

  const pubnub = usePubNub();
  const [channels, setChannels] = useState<ChannelEntityWithMembership[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState("");
  const [error, setError] = useState<Error>();
  const [doFetch, setDoFetch] = useState(true);

  const paginatedOptions = useMemo(
    () =>
      merge({}, JSON.parse(jsonOptions), {
        page: { next: page },
        include: { totalCount: true },
      }) as GetMembershipsParametersv2,
    [page, jsonOptions]
  );

  const fetchMoreMemberships = () => {
    setDoFetch(true);
  };

  const resetHook = () => {
    setChannels([]);
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
        if (totalCount && channels.length >= totalCount) return;
        const response = await pubnub.objects.getMemberships(paginatedOptions);

        if (ignoreRequest) return;
        setDoFetch(false);
        setChannels((channels) => [
          ...channels,
          ...(response.data.map((m) => {
            const returnObject = {
              ...m.channel,
            } as ChannelEntityWithMembership;

            if (m.custom) {
              returnObject.membership = m.custom;
            }

            return returnObject;
          }) as ChannelEntityWithMembership[]),
        ]);
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
  }, [totalCount, pubnub.objects, paginatedOptions, channels.length, doFetch]);

  useEffect(() => {
    const listener = {
      objects: (event) => {
        const message = event.message;
        if (message.type !== "membership") return;

        setChannels((channels) => {
          const channelsCopy = cloneDeep(channels);
          const channel = channelsCopy.find((u) => u.id === message.data.channel.id);
          const currentUuid = paginatedOptions.uuid || pubnub.getUUID();

          // Make sure the event is for the same uuid as the hook
          if (message.data.uuid.id !== currentUuid) return channelsCopy;

          // Set events are not handled since there are no events fired for data updates
          // New memberships are not handled in order to conform to filters and pagination
          if (channel && message.event === "delete") {
            channelsCopy.splice(channelsCopy.indexOf(channel), 1);
          }

          return channelsCopy;
        });
      },
    };

    pubnub.addListener(listener);

    return () => {
      pubnub.removeListener(listener);
    };
  }, [pubnub, paginatedOptions.uuid]);

  return [channels, fetchMoreMemberships, resetHook, totalCount, error];
};
