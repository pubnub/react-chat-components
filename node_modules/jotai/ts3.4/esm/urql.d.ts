export { clientAtom } from './urql/clientAtom';
export { atomWithQuery } from './urql/atomWithQuery';
export { atomWithMutation } from './urql/atomWithMutation';
export { atomWithSubscription } from './urql/atomWithSubscription';
declare type Awaited<T> = T extends Promise<infer V> ? V : T;