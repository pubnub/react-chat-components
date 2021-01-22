import { useState, useEffect } from "react";
import { HereNowParameters, HereNowResponse } from "pubnub";
import { usePubNub } from "pubnub-react";

type Occupant = {
  uuid: string;
  state?: unknown;
};

type HookReturnValue = [
  number,
  {
    [channel: string]: {
      name: string;
      occupancy: number;
      occupants: Occupant[];
    };
  }
];

export const usePubNubPresence = (
  options: HereNowParameters = {},
  onError = (e) => console.error(e)
): HookReturnValue => {
  const pubnub = usePubNub();
  const [response, setResponse] = useState<HereNowResponse>({});

  const command = async () => {
    try {
      const response = await pubnub.hereNow(options);
      setResponse(response);
    } catch (e) {
      onError(e);
    }
  };

  useEffect(() => {
    command();
  }, [JSON.stringify(options.channels)]);

  return [response.totalOccupancy, response.channels];
};
