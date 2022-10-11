declare type V1Options = {
    node: number[];
    clockseq: number;
    msecs: number;
    nsecs: number;
    random: number[];
    rng: () => number[];
};
export declare const v1: (options?: V1Options | undefined, buf?: Uint8Array | undefined, offset?: number) => string | Uint8Array;
export {};
