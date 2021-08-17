import { useState, useEffect } from "react";
import { ChannelMetadataObject, ObjectCustom, GetMembershipsParametersv2 } from "pubnub";
import { usePubNub } from "pubnub-react";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";

type HookReturnValue = [ChannelMetadataObject<ObjectCustom>[], () => Promise<void>, number, Error];

export const useUserMemberships = (options: GetMembershipsParametersv2 = {}): HookReturnValue => {
  const pubnub = usePubNub();

  const [channels, setChannels] = useState<ChannelMetadataObject<ObjectCustom>[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState("");
  const [error, setError] = useState<Error>();

  const paginatedOptions = merge(options, {
    page: { next: page },
    include: { totalCount: true },
  }) as GetMembershipsParametersv2;

  const command = async () => {
    try {
      if (totalCount && channels.length >= totalCount) return;
      const response = await pubnub.objects.getMemberships(paginatedOptions);
      setChannels((channels) => [
        ...channels,
        ...(response.data.map((m) => m.channel) as ChannelMetadataObject<ObjectCustom>[]),
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

    setChannels((channels) => {
      const channelsCopy = cloneDeep(channels);
      const channel = channelsCopy.find((u) => u.id === message.data.channel.id);

      // Set events are not handled since there are no events fired for data updates
      // New memberships are not handled in order to conform to filters and pagination

      if (channel && message.event === "delete") {
        channelsCopy.splice(channelsCopy.indexOf(channel), 1);
      }

      return channelsCopy;
    });
  };

  useEffect(() => {
    pubnub.addListener({ objects: handleObject });
    command();
  }, []);

  return [channels, command, totalCount, error];
};
