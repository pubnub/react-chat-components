import { useState, useEffect } from "react";
import { UserData, GetAllMetadataParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import merge from "lodash.merge";

type HookReturnValue = [UserData[], () => Promise<void>, number];

export const usePubNubUsers = (
  options: GetAllMetadataParameters = {},
  onError = (e) => console.error(e)
): HookReturnValue => {
  const pubnub = usePubNub();

  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState("");

  const paginatedOptions = merge({}, options, {
    page: { next: page },
    include: { totalCount: true },
  });

  const command = async () => {
    try {
      if (totalCount && users.length >= totalCount) return;
      const response = await pubnub.objects.getAllUUIDMetadata(paginatedOptions);
      setUsers((users) => [...users, ...response.data]);
      setTotalCount(response.totalCount);
      setPage(response.next);
    } catch (e) {
      onError(e);
    }
  };

  useEffect(() => {
    command();
  }, []);

  return [users, command, totalCount];
};
