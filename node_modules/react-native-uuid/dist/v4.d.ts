declare type V4Options = {
    random: number[];
    rng?: () => number[];
};
export declare const v4: (options?: string | V4Options | undefined, buf?: number[] | undefined, offset?: number | undefined) => string | number[];
export {};
