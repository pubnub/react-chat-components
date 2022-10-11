export { queryClientAtom } from './query/queryClientAtom';
export { atomWithQuery } from './query/atomWithQuery';
export { atomWithInfiniteQuery } from './query/atomWithInfiniteQuery';
export { AtomWithQueryOptions } from './query/atomWithQuery';
export { AtomWithInfiniteQueryOptions } from './query/atomWithInfiniteQuery';
declare type Awaited<T> = T extends Promise<infer V> ? V : T;