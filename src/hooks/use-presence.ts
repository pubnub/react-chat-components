import { useState, useEffect } from "react";
import { HereNowParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import cloneDeep from "lodash.clonedeep";

type ChannelsOccupancy = {
  [channel: string]: {
    uuid: string;
    state?: unknown;
  }[];
};

type HookReturnValue = [ChannelsOccupancy, number, Error];

export const usePresence = (options: HereNowParameters = {}): HookReturnValue => {
  const pubnub = usePubNub();

  const [channels, setChannels] = useState<ChannelsOccupancy>({});
  const [error, setError] = useState<Error>();
  const channelValues = Object.values(channels);
  const total = channelValues.map((ch) => ch.length).reduce((prev, cur) => prev + cur, 0);

  const command = async () => {
    try {
      const response = await pubnub.hereNow(options);
      const mapped = {};
      for (const channel in response.channels) {
        mapped[channel] = response.channels[channel].occupants;
      }
      setChannels(mapped);
    } catch (e) {
      setError(e);
    }
  };

  const handlePresence = (event) => {
    setChannels((channels) => {
      const channelsClone = cloneDeep(channels);
      const channel = channelsClone[event.channel];
      if (!channel) channelsClone[event.channel] = [];

      if (event.action === "join" && !channel.find((u) => u.uuid == event.uuid)) {
        const { state, uuid } = event;
        channel.push({ state, uuid });
      }

      if (
        ["leave", "timeout"].includes(event.action) &&
        channel.find((u) => u.uuid == event.uuid)
      ) {
        channelsClone[event.channel] = channel.filter((u) => u.uuid !== event.uuid);
      }

      return channelsClone;
    });
  };

  useEffect(() => {
    pubnub.addListener({ presence: handlePresence });
  }, []);

  useEffect(() => {
    command();
  }, [JSON.stringify(options.channels)]);

  return [channels, total, error];
};
