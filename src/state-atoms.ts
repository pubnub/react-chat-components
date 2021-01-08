import { atom, selector } from "recoil";
import { UserData } from "pubnub";
import { PickerProps } from "emoji-mart";
import { Message, Themes, Channel } from "./types";

export const ThemeAtom = atom<Themes | "">({
  key: "theme",
  default: "",
});

export const CurrentChannelAtom = atom<string>({
  key: "currentChannel",
  default: "",
});

export const SubscribeChannelsAtom = atom<string[]>({
  key: "subscribeChannels",
  default: [],
});

export const ChannelsMetaAtom = atom<Channel[]>({
  key: "channelsMeta",
  default: [],
});

export const UsersMetaAtom = atom<UserData[]>({
  key: "usersMeta",
  default: [],
});

export const MessagesAtom = atom<{ [channel: string]: Message[] }>({
  key: "messages",
  default: {},
});

export const CurrentChannelMessagesAtom = selector<Message[]>({
  key: "channelMessages",
  get: ({ get }) => get(MessagesAtom)[get(CurrentChannelAtom)] || [],
  set: ({ get, set }, value) =>
    set(MessagesAtom, Object.assign({}, get(MessagesAtom), { [get(CurrentChannelAtom)]: value })),
});

export const PaginationAtom = atom<{ [channel: string]: boolean }>({
  key: "pagination",
  default: {},
});

export const CurrentChannelPaginationAtom = selector<boolean>({
  key: "channelPagination",
  get: ({ get }) => get(PaginationAtom)[get(CurrentChannelAtom)] || false,
  set: ({ get, set }, value) =>
    set(
      PaginationAtom,
      Object.assign({}, get(PaginationAtom), { [get(CurrentChannelAtom)]: value })
    ),
});

export const MembershipsAtom = atom({
  key: "memberships",
  default: [],
});

export const CurrentChannelMembershipsAtom = selector<string[]>({
  key: "channelMemberships",
  get: ({ get }) => get(MembershipsAtom)[get(CurrentChannelAtom)] || [],
  set: ({ get, set }, value) =>
    set(
      MembershipsAtom,
      Object.assign({}, get(MembershipsAtom), { [get(CurrentChannelAtom)]: value })
    ),
});

export const CurrentUserMembershipsAtom = atom<string[]>({
  key: "userMemberships",
  default: [],
});

export const OccupancyAtom = atom({
  key: "occupancy",
  default: {},
});

export const CurrentChannelOccupancyAtom = selector<string[]>({
  key: "channelOccupancy",
  get: ({ get }) => get(OccupancyAtom)[get(CurrentChannelAtom)] || [],
  set: ({ get, set }, value) =>
    set(OccupancyAtom, Object.assign({}, get(OccupancyAtom), { [get(CurrentChannelAtom)]: value })),
});

export const TypingIndicatorAtom = atom({
  key: "typingIndicator",
  default: {},
});

export const CurrentChannelTypingIndicatorAtom = selector<string[]>({
  key: "channelTypingIndicator",
  get: ({ get }) => get(TypingIndicatorAtom)[get(CurrentChannelAtom)] || [],
  set: ({ get, set }, value) =>
    set(
      TypingIndicatorAtom,
      Object.assign({}, get(TypingIndicatorAtom), { [get(CurrentChannelAtom)]: value })
    ),
});

export const EmojiMartOptionsAtom = atom<PickerProps>({
  key: "emojiMartOptions",
  default: {},
});

export const TypingIndicatorTimeoutAtom = atom<number>({
  key: "typingIndicatorTimeout",
  default: 10,
});
