import PubNub, { UserData, ChannelData } from "pubnub";

export const getAllPubnubUsers = async (pubnub: PubNub, limit = 100): Promise<UserData[]> => {
  let records = [];
  let next = "";
  let totalCount = 0;

  do {
    const response = await pubnub.objects.getAllUUIDMetadata({
      page: { next },
      limit,
      include: { totalCount: true, customFields: true },
    });
    records = [...records, ...response.data];
    next = response.next;
    totalCount = response.totalCount;
  } while (records.length < totalCount);

  return records;
};

export const getAllPubnubChannels = async (pubnub: PubNub, limit = 100): Promise<ChannelData[]> => {
  let records = [];
  let next = "";
  let totalCount = 0;

  do {
    const response = await pubnub.objects.getAllChannelMetadata({
      page: { next },
      limit,
      include: { totalCount: true, customFields: true },
    });
    records = [...records, ...response.data];
    next = response.next;
    totalCount = response.totalCount;
  } while (records.length < totalCount);

  return records;
};

export const getPubnubChannelMembers = async (
  pubnub: PubNub,
  channel: string,
  limit = 100
): Promise<string[]> => {
  let records = [];
  let next = "";
  let totalCount = 0;

  do {
    const response = await pubnub.objects.getChannelMembers({
      channel,
      page: { next },
      sort: { "uuid.name": "asc" },
      limit,
      include: { totalCount: true },
    });
    const uuids = response.data.map((u) => u.uuid.id);
    records = [...records, ...uuids];
    next = response.next;
    totalCount = response.totalCount;
  } while (records.length < totalCount);

  return records;
};

export const getPubnubUserChannels = async (
  pubnub: PubNub,
  uuid: string,
  limit = 100
): Promise<string[]> => {
  let records = [];
  let next = "";
  let totalCount = 0;

  do {
    const response = await pubnub.objects.getMemberships({
      uuid,
      page: { next },
      limit,
      include: { totalCount: true },
    });
    const channels = response.data.map((c) => c.channel.id);
    records = [...records, ...channels];
    next = response.next;
    totalCount = response.totalCount;
  } while (records.length < totalCount);

  return records;
};
