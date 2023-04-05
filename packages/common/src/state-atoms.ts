import { atom } from "jotai";
import { UserEntity, MessageEnvelope, Themes } from "./types";

export const ThemeAtom = atom<Themes | "">("light");
export const CurrentChannelAtom = atom<string>("");
export const SubscribeChannelsAtom = atom<string[]>([]);
export const SubscribeChannelGroupsAtom = atom<string[]>([]);
export const UsersMetaAtom = atom<UserEntity[]>([]);
export const MessagesAtom = atom<{ [channel: string]: MessageEnvelope[] }>({});
export const PaginationAtom = atom<{ [channel: string]: boolean }>({});
export const TypingIndicatorAtom = atom({});
export const TypingIndicatorTimeoutAtom = atom<number>(10);

export const RetryFunctionAtom = atom<{ function: <T>(fn: () => Promise<T>) => Promise<T> }>({
  function: () => null,
});

export const ErrorFunctionAtom = atom<{ function: (error: Error) => unknown }>({
  function: () => null,
});

export const MissingUserCallbackAtom = atom<{
  function?: (userId: string) => UserEntity | Promise<UserEntity>;
}>({
  function: undefined,
});

export const RequestMissingUserAtom = atom(null, async (get, set, userId: string) => {
  const missingUserCallback = get(MissingUserCallbackAtom).function;
  if (!missingUserCallback) return;
  const missingUser = await missingUserCallback(userId);
  set(UsersMetaAtom, [...get(UsersMetaAtom), missingUser]);
});

export const CurrentChannelMessagesAtom = atom(
  (get) => (get(MessagesAtom) ? get(MessagesAtom)[get(CurrentChannelAtom)] || [] : []),
  (get, set, value) =>
    set(MessagesAtom, Object.assign({}, get(MessagesAtom), { [get(CurrentChannelAtom)]: value }))
);

export const CurrentChannelPaginationAtom = atom(
  (get) => {
    return get(PaginationAtom)[get(CurrentChannelAtom)] || false;
  },
  (get, set, value) => {
    return set(
      PaginationAtom,
      Object.assign({}, get(PaginationAtom), { [get(CurrentChannelAtom)]: value })
    );
  }
);

export const CurrentChannelTypingIndicatorAtom = atom(
  (get) => get(TypingIndicatorAtom)[get(CurrentChannelAtom)] || {},
  (get, set, value) =>
    set(
      TypingIndicatorAtom,
      Object.assign({}, get(TypingIndicatorAtom), { [get(CurrentChannelAtom)]: value })
    )
);
