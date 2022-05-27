import { useState, useEffect } from "react";
import { GetAllMetadataParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";
import { ChannelEntity } from "../types";

type HookReturnValue = [ChannelEntity[], () => Promise<void>, number, Error];

export const useChannels = (options: GetAllMetadataParameters = {}): HookReturnValue => {
  const pubnub = usePubNub();

  const [channels, setChannels] = useState<ChannelEntity[]>([]);
  const [page, setPage] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<Error>();

  const paginatedOptions = merge({}, options, {
    page: { next: page },
    include: { totalCount: true },
  }) as GetAllMetadataParameters;

  const command = async () => {
    try {
      if (totalCount && channels.length >= totalCount) return;
      const response = await pubnub.objects.getAllChannelMetadata(paginatedOptions);
      setChannels((channels) => [...channels, ...response.data]);
      setTotalCount(response.totalCount);
      setPage(response.next);
    } catch (e) {
      setError(e);
    }
  };

  const handleObject = (event) => {
    const message = event.message;
    if (message.type !== "channel") return;

    setChannels((channels) => {
      const channelsCopy = cloneDeep(channels);
      const channel = channelsCopy.find((ch) => ch.id === event.channel);

      // Set events are only handled for already fetched channels in order to conform to filters and pagination
      if (channel && message.event === "set") {
        Object.assign(channel, message.data);
      }

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
