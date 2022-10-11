import type { Atom } from 'jotai';
export declare const createMemoizeAtom: () => <AtomType extends Atom<unknown>, Deps extends readonly object[]>(createAtom: () => AtomType, deps: Deps) => AtomType;
