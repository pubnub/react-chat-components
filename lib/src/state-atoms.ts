import { atom, selector } from "recoil";
import { UUIDMetadataObject, ObjectCustom } from "pubnub";
import { PickerProps } from "emoji-mart";
import { Message, Themes } from "./types";

export const ThemeAtom = atom<Themes | "">({
  key: "theme",
  default: "",
});

export const RetryFunctionAtom = atom<{ function: <T>(fn: () => Promise<T>) => Promise<T> }>({
  key: "retry",
  default: { function: () => null },
});

export const ErrorFunctionAtom = atom<{ function: (error: Error) => unknown }>({
  key: "error",
  default: { function: () => null },
});

export const CurrentChannelAtom = atom<string>({
  key: "currentChannel",
  default: "",
});

export const SubscribeChannelsAtom = atom<string[]>({
  key: "subscribeChannels",
  default: [],
});

export const SubscribeChannelGroupsAtom = atom<string[]>({
  key: "subscribeChannelGroups",
  default: [],
});

export const UsersMetaAtom = atom<UUIDMetadataObject<ObjectCustom>[]>({
  key: "usersMeta",
  default: [],
});

export const MessagesAtom = atom<{ [channel: string]: Message[] }>({
  key: "messages",
  default: {},
});

export const CurrentChannelMessagesAtom = selector<Message[]>({
  key: "channelMessages",
  get: ({ get }) => (get(MessagesAtom) ? get(MessagesAtom)[get(CurrentChannelAtom)] || [] : []),
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

export const TypingIndicatorAtom = atom({
  key: "typingIndicator",
  default: {},
});

export const CurrentChannelTypingIndicatorAtom = selector<{ [key: string]: string }>({
  key: "channelTypingIndicator",
  get: ({ get }) => get(TypingIndicatorAtom)[get(CurrentChannelAtom)] || {},
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
