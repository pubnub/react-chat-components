import { useState, useEffect } from "react";
import { ChannelData, GetAllMetadataParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import { mergeDeep } from "../helpers";

export const usePubNubUserMemberships = (
  options: GetAllMetadataParameters = {},
  onError = (e) => console.error(e)
): ChannelData[] => {
  const pubnub = usePubNub();
  const [channels, setChannels] = useState([]);
  const [page, setPage] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const mandatoryOptions = {
    page: { next: page },
    include: { totalCount: true },
  };
  const mergedOptions = mergeDeep(options, mandatoryOptions);

  const command = async (): Promise<ChannelData[]> => {
    try {
      if (totalCount && channels.length >= totalCount) return;
      const response = await pubnub.objects.getMemberships(mergedOptions);
      setPage(response.next);
      setTotalCount(response.totalCount);
      setChannels((channels) => [...channels, ...response.data]);
    } catch (e) {
      onError(e);
    }
  };

  useEffect(() => {
    command();
  }, []);

  return [channels, command, totalCount];
};
