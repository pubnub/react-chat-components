import { useState, useEffect, useMemo } from "react";
import { GetChannelMembersParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";
import { UserEntity } from "../types";

type HookReturnValue = [UserEntity[], () => void, () => void, number, Error];

export const useChannelMembers = (options: GetChannelMembersParameters): HookReturnValue => {
  const jsonOptions = JSON.stringify(options);

  const pubnub = usePubNub();
  const [members, setMembers] = useState<UserEntity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState("");
  const [error, setError] = useState<Error>();
  const [doFetch, setDoFetch] = useState(true);

  const paginatedOptions = useMemo(
    () =>
      merge({}, JSON.parse(jsonOptions), {
        page: { next: page },
        include: { totalCount: true },
      }) as GetChannelMembersParameters,
    [page, jsonOptions]
  );

  const fetchMoreMembers = () => {
    setDoFetch(true);
  };

  const resetHook = () => {
    setMembers([]);
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
        if (totalCount && members.length >= totalCount) return;
        const response = await pubnub.objects.getChannelMembers(paginatedOptions);
        if (ignoreRequest) return;
        setDoFetch(false);
        setMembers((members) => [
          ...members,
          ...(response.data.map((m) => m.uuid) as UserEntity[]),
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
  }, [totalCount, pubnub.objects, paginatedOptions, members.length, doFetch]);

  useEffect(() => {
    const listener = {
      objects: (event) => {
        const message = event.message;
        if (message.type !== "membership") return;

        setMembers((members) => {
          const membersCopy = cloneDeep(members);
          const member = membersCopy.find((u) => u.id === message.data.uuid.id);

          // Make sure the event is for the same channel as the hook
          if (message.data.channel.id !== paginatedOptions.channel) return membersCopy;

          // Set events are not handled since there are no events fired for data updates
          // New memberships are not handled in order to conform to filters and pagination
          if (member && message.event === "delete") {
            membersCopy.splice(membersCopy.indexOf(member), 1);
          }

          return membersCopy;
        });
      },
    };

    pubnub.addListener(listener);

    return () => {
      pubnub.removeListener(listener);
    };
  }, [pubnub, paginatedOptions.channel]);

  return [members, fetchMoreMembers, resetHook, totalCount, error];
};
