export type TimetokenData = {
  t: string;
  r: number;
};

export type Envelope = {
  a: string;
  b?: string;
  c: string;
  d: any;
  e?: number;
  f: number;
  i: string;
  k: string;
  o?: TimetokenData;
  p: TimetokenData;
  u?: any;
};

export type SubscribeResponse = {
  t: TimetokenData;
  m: Envelope[];
};

export type SubscribeErrorResponse = {
  error: true;
  status: number;
  message: string;
  service: "Access Manager";
  payload?: {
    channels?: string[];
    "channel-groups"?: string[];
  };
};

export type PublishResponse = [number, string, string];

export const timetokenData = (timetoken: string, region?: number): TimetokenData => ({
  t: timetoken,
  r: region ?? 1,
});

export const envelope = (input: {
  shard?: string;
  subscriptionMatch?: string;
  channel: string;
  payload: any;
  messageType?: number;
  flags?: number;
  sender: string;
  subKey: string;
  metadata?: any;
  originatingTimetoken?: TimetokenData;
  publishingTimetoken: TimetokenData;
}): Envelope => ({
  a: input.shard ?? "1",
  b: input.subscriptionMatch ?? input.channel,
  c: input.channel,
  d: input.payload,
  e: input.messageType ?? 0,
  f: input.flags ?? 0,
  i: input.sender,
  k: input.subKey,
  o: input.originatingTimetoken,
  p: input.publishingTimetoken,
  u: input.metadata,
});

export const successfulResponse = (
  timetoken: TimetokenData,
  envelopes: Envelope[] = []
): SubscribeResponse => ({
  t: timetoken,
  m: envelopes,
});
