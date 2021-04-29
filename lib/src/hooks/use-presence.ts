import { useState, useEffect, useCallback, useMemo } from "react";
import { HereNowParameters, HereNowResponse } from "pubnub";
import { usePubNub } from "pubnub-react";
import cloneDeep from "lodash.clonedeep";

type ChannelsOccupancy = HereNowResponse["channels"];
type HookReturnValue = [ChannelsOccupancy, () => Promise<void>, number, Error];

export const usePresence = ({
  channels,
  channelGroups,
  includeUUIDs,
  includeState,
}: HereNowParameters = {}): HookReturnValue => {
  const pubnub = usePubNub();

  const [presence, setPresence] = useState<ChannelsOccupancy>({});
  const [error, setError] = useState<Error>();

  const presenceValues = Object.values(presence);
  const total = presenceValues.map((ch) => ch.occupancy).reduce((prev, cur) => prev + cur, 0);

  const options = useMemo(() => ({ channels, channelGroups, includeUUIDs, includeState }), [
    channels,
    channelGroups,
    includeUUIDs,
    includeState,
  ]);

  const command = useCallback(async () => {
    try {
      const response = await pubnub.hereNow(options);
      setPresence(response.channels);
    } catch (e) {
      setError(e);
    }
  }, [pubnub, options]);

  const handlePresence = useCallback(
    (event) => {
      setPresence((presence) => {
        const presenceClone = cloneDeep(presence);
        if (!presenceClone[event.channel]) presenceClone[event.channel] = {};
        const channel = presenceClone[event.channel];

        if (event.action === "join") {
          if (!channel.hasOwnProperty("occupants")) channel.occupants = [];
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
            presenceClone[event.channel].occupants = channel.occupants.filter(
              (u) => u.uuid !== event.uuid
            );
          }
        }

        return presenceClone;
      });
    },
    [options.includeUUIDs]
  );

  useEffect(() => {
    pubnub.addListener({ presence: handlePresence });
  }, [handlePresence, pubnub]);

  useEffect(() => {
    setPresence({});
    setError(null);
    command();
  }, [command]);

  return [presence, command, total, error];
};
