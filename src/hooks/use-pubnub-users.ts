import { useState, useEffect } from "react";
import { UserData, GetAllMetadataParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import { mergeDeep } from "../helpers";

export const usePubNubUsers = (
  options: GetAllMetadataParameters = {},
  onError = (e) => console.error(e)
): UserData[] => {
  const pubnub = usePubNub();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const mandatoryOptions = {
    page: { next: page },
    include: { totalCount: true },
  };
  const mergedOptions = mergeDeep(options, mandatoryOptions);

  const command = async (): Promise<UserData[]> => {
    try {
      if (totalCount && users.length >= totalCount) return;
      const response = await pubnub.objects.getAllUUIDMetadata(mergedOptions);
      setPage(response.next);
      setTotalCount(response.totalCount);
      setUsers((users) => [...users, ...response.data]);
    } catch (e) {
      onError(e);
    }
  };

  useEffect(() => {
    command();
  }, []);

  return [users, command, totalCount];
};
