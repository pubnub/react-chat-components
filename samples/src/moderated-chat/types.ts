import { ObjectCustom } from "pubnub";

export interface UserCustom extends ObjectCustom {
  profileUrl: string;
  ban: boolean;
  flag: boolean;
  flaggedAt: string;
  flaggedBy: string;
  mutedChannels: string;
  blockedChannels: string;
  reason: string;
  title: string;
}
