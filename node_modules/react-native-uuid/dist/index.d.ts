export type { GenerateUUID } from './v35';
declare const _default: {
    parse: (s: string, buf?: number[] | undefined, offset?: number | undefined) => number[];
    unparse: (buf: number[], offset?: number | undefined) => string;
    validate: (uuid: string) => boolean;
    version: (uuid: string) => number;
    v1: (options?: {
        node: number[];
        clockseq: number;
        msecs: number;
        nsecs: number;
        random: number[];
        rng: () => number[];
    } | undefined, buf?: Uint8Array | undefined, offset?: number) => string | Uint8Array;
    v4: (options?: string | {
        random: number[];
        rng?: (() => number[]) | undefined;
    } | undefined, buf?: number[] | undefined, offset?: number | undefined) => string | number[];
    v5: import("./v35").GenerateUUID;
    NIL: string;
    DNS: string;
    URL: string;
    OID: string;
    X500: string;
};
export default _default;
