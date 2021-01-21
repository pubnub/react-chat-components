import { useState, useEffect } from "react";
import { UserData, GetChannelMembersParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import merge from "lodash.merge";

type HookReturnValue = [UserData[], () => Promise<void>, number];

export const usePubNubChannelMembers = (
  options: GetChannelMembersParameters = {},
  onError = (e) => console.error(e)
): HookReturnValue => {
  const pubnub = usePubNub();

  const [members, setMembers] = useState<UserData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState("");

  const paginatedOptions = merge({}, options, {
    page: { next: page },
    include: { totalCount: true },
  });

  const command = async () => {
    try {
      if (totalCount && members.length >= totalCount) return;
      const response = await pubnub.objects.getChannelMembers(paginatedOptions);
      setMembers((members) => [...members, ...response.data.map((m) => m.uuid)]);
      setTotalCount(response.totalCount);
      setPage(response.next);
    } catch (e) {
      onError(e);
    }
  };

  useEffect(() => {
    setMembers([]);
    setTotalCount(0);
    setPage("");
  }, [options.channel]);

  useEffect(() => {
    if (!page) command();
  }, [page]);

  return [members, command, totalCount];
};
