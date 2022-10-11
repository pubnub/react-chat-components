import { WritableAtom } from 'jotai';
export declare function atomWithReducer<Value, Action>(initialValue: Value, reducer: (value: Value, action?: Action) => Value): WritableAtom<Value, Action | undefined>;
export declare function atomWithReducer<Value, Action>(initialValue: Value, reducer: (value: Value, action: Action) => Value): WritableAtom<Value, Action>;
declare type Awaited<T> = T extends Promise<infer V> ? V : T;