import { Atom } from 'jotai';
export declare function selectAtom<Value, Slice>(anAtom: Atom<Value>, selector: (v: Awaited<Value>) => Slice, equalityFn?: (a: Slice, b: Slice) => boolean): Atom<Slice>;
declare type Awaited<T> = T extends Promise<infer V> ? V : T;