import { useState, useEffect } from "react";
import { HereNowParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import cloneDeep from "lodash.clonedeep";

type ChannelsOccupancy = {
  [channel: string]: {
    occupancy: number;
    occupants?: {
      name: string;
      uuid: string;
      state?: unknown;
    }[];
  };
};

type HookReturnValue = [ChannelsOccupancy, number, Error];

export const usePresence = (options: HereNowParameters = {}): HookReturnValue => {
  const pubnub = usePubNub();

  const [channels, setChannels] = useState<ChannelsOccupancy>({});
  const [error, setError] = useState<Error>();

  const channelValues = Object.values(channels);
  const total = channelValues.map((ch) => ch.occupancy).reduce((prev, cur) => prev + cur, 0);

  const command = async () => {
    try {
      const response = await pubnub.hereNow(options);
      setChannels(response.channels);
    } catch (e) {
      setError(e);
    }
  };

  const handlePresence = (event) => {
    setChannels((channels) => {
      const channelsClone = cloneDeep(channels);
      if (!channelsClone[event.channel]) channelsClone[event.channel] = {};
      const channel = channelsClone[event.channel];

      if (event.action === "join") {
        channel.occupancy = event.occupancy;

        if (
          options.includeUUIDs !== false &&
          channel.hasOwnProperty("occupants") &&
          !channel.occupants.find((u) => u.uuid == event.uuid)
        ) {
          const { state, uuid } = event;
          channel.occupants.push({ state, uuid });
        }
      }

      if (["leave", "timeout"].includes(event.action)) {
        channel.occupancy = event.occupancy;

        if (
          options.includeUUIDs !== false &&
          channel.hasOwnProperty("occupants") &&
          channel.occupants.find((u) => u.uuid == event.uuid)
        ) {
          channelsClone[event.channel].occupants = channel.occupants.filter(
            (u) => u.uuid !== event.uuid
          );
        }
      }

      return channelsClone;
    });
  };

  useEffect(() => {
    pubnub.addListener({ presence: handlePresence });
  }, []);

  useEffect(() => {
    setChannels({});
    setError(null);
    command();
  }, [JSON.stringify(options.channels)]);

  return [channels, total, error];
};
