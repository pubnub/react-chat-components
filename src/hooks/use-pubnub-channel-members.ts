import { useState, useEffect } from "react";
import { UserData, GetAllMetadataParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import { mergeDeep } from "../helpers";

export const usePubNubChannelMembers = (
  options: GetAllMetadataParameters = {},
  onError = (e) => console.error(e)
): UserData[] => {
  const pubnub = usePubNub();
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const mandatoryOptions = {
    page: { next: page },
    include: { totalCount: true },
  };
  const mergedOptions = mergeDeep(options, mandatoryOptions);

  const command = async (): Promise<UserData[]> => {
    try {
      if (totalCount && members.length >= totalCount) return;
      const response = await pubnub.objects.getChannelMembers(mergedOptions);
      setPage(response.next);
      setTotalCount(response.totalCount);
      setMembers((members) => [...members, ...response.data.map((m) => m.uuid)]);
    } catch (e) {
      onError(e);
    }
  };

  useEffect(() => {
    command();
  }, []);

  return [members, command, totalCount];
};
