import { useState, useEffect } from "react";
import { ObjectCustom, UUIDMetadataObject, GetChannelMembersParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";

type HookReturnValue = [UUIDMetadataObject<ObjectCustom>[], () => Promise<void>, number, Error];

export const useChannelMembers = (options: GetChannelMembersParameters): HookReturnValue => {
  const pubnub = usePubNub();

  const [members, setMembers] = useState<UUIDMetadataObject<ObjectCustom>[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState("");
  const [error, setError] = useState<Error>();

  const paginatedOptions = merge({}, options, {
    page: { next: page },
    include: { totalCount: true },
  }) as GetChannelMembersParameters;

  const command = async () => {
    try {
      if (totalCount && members.length >= totalCount) return;
      const response = await pubnub.objects.getChannelMembers(paginatedOptions);
      setMembers((members) => [
        ...members,
        ...(response.data.map((m) => m.uuid) as UUIDMetadataObject<ObjectCustom>[]),
      ]);
      setTotalCount(response.totalCount);
      setPage(response.next);
    } catch (e) {
      setError(e);
    }
  };

  const handleObject = (event) => {
    const message = event.message;
    if (message.type !== "membership") return;

    setMembers((members) => {
      const membersCopy = cloneDeep(members);
      const member = membersCopy.find((u) => u.id === message.data.uuid.id);

      // Set events are not handled since there are no events fired for data updates
      // New memberships are not handled in order to conform to filters and pagination

      if (member && message.event === "delete") {
        membersCopy.splice(membersCopy.indexOf(member), 1);
      }

      return membersCopy;
    });
  };

  useEffect(() => {
    pubnub.addListener({ objects: handleObject });
  }, []);

  useEffect(() => {
    setMembers([]);
    setTotalCount(0);
    setPage("");
  }, [options.channel]);

  useEffect(() => {
    if (!page) command();
  }, [page]);

  return [members, command, totalCount, error];
};
