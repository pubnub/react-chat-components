import { atom } from "jotai";
import { ChannelEntity } from "@pubnub/react-native-chat-components";

export const CurrentChannelAtom = atom<ChannelEntity>(null);
