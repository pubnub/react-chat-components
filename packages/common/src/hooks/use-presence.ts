import { useState, useEffect } from "react";
import { HereNowParameters, HereNowResponse } from "pubnub";
import { usePubNub } from "pubnub-react";
import { cloneDeep } from "lodash";

type ChannelsOccupancy = HereNowResponse["channels"];
type HookReturnValue = [ChannelsOccupancy, () => void, number, Error];

export const usePresence = (options: HereNowParameters = {}): HookReturnValue => {
  const jsonOptions = JSON.stringify(options);

  const pubnub = usePubNub();
  const [presence, setPresence] = useState<ChannelsOccupancy>({});
  const [error, setError] = useState<Error>();
  const [doFetch, setDoFetch] = useState(true);

  const presenceValues = Object.values(presence);
  const total = presenceValues.map((ch) => ch.occupancy).reduce((prev, cur) => prev + cur, 0);

  const resetHook = () => {
    setPresence({});
    setError(undefined);
    setDoFetch(true);
  };

  useEffect(() => {
    resetHook();
  }, [jsonOptions]);

  useEffect(() => {
    let ignoreRequest = false;
    if (doFetch) fetch();

    async function fetch() {
      try {
        const response = await pubnub.hereNow(JSON.parse(jsonOptions));
        if (ignoreRequest) return;
        setDoFetch(false);
        setPresence(response.channels);
      } catch (e) {
        setDoFetch(false);
        setError(e);
      }
    }

    return () => {
      ignoreRequest = true;
    };
  }, [pubnub, doFetch, jsonOptions]);

  useEffect(() => {
    const listener = {
      presence: (event) => {
        setPresence((presence) => {
          const presenceClone = cloneDeep(presence);
          if (!presenceClone[event.channel])
            presenceClone[event.channel] = { name: event.channel, occupancy: 0, occupants: [] };
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
    };

    pubnub.addListener(listener);

    return () => {
      pubnub.removeListener(listener);
    };
  }, [pubnub, options.includeUUIDs]);

  return [presence, resetHook, total, error];
};
