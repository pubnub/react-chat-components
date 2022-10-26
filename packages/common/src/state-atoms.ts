import { atom } from "jotai";
import { UserEntity, MessageEnvelope, Themes } from "./types";

export const ThemeAtom = atom<Themes | "">("light");
export const CurrentChannelAtom = atom<string>("");
export const SubscribeChannelsAtom = atom<string[]>([]);
export const SubscribeChannelGroupsAtom = atom<string[]>([]);
export const UsersMetaAtom = atom<UserEntity[]>([]);
export const MessagesAtom = atom<{ [channel: string]: MessageEnvelope[] }>({});
export const PaginationAtom = atom<{ [channel: string]: boolean }>({});
export const TypingIndicatorAtom = atom<{ [key: string]: string }>({});
export const TypingIndicatorTimeoutAtom = atom<number>(10);

export const RetryFunctionAtom = atom<{
  function: <T>(fn: () => Promise<T | undefined>) => Promise<T | undefined>;
}>({
  function: () => Promise.resolve(null) as never,
});

export const ErrorFunctionAtom = atom<{ function: (error: Error) => unknown }>({
  function: () => null,
});

export const CurrentChannelMessagesAtom = atom(
  (get) => (get(MessagesAtom) ? get(MessagesAtom)[get(CurrentChannelAtom)] || [] : []),
  (get, set, value) =>
    set(MessagesAtom, Object.assign({}, get(MessagesAtom), { [get(CurrentChannelAtom)]: value }))
);

export const CurrentChannelPaginationAtom = atom(
  (get) => get(PaginationAtom)[get(CurrentChannelAtom)] || false,
  (get, set, value) =>
    set(
      PaginationAtom,
      Object.assign({}, get(PaginationAtom), { [get(CurrentChannelAtom)]: value })
    )
);

export const CurrentChannelTypingIndicatorAtom = atom<{ [key: string]: string }, unknown>(
  (get) => get(TypingIndicatorAtom)[get(CurrentChannelAtom)] || {},
  (get, set, value) =>
    set(
      TypingIndicatorAtom,
      Object.assign({}, get(TypingIndicatorAtom), { [get(CurrentChannelAtom)]: value })
    )
);
