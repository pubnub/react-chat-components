export declare type GenerateUUID = (value: string | Uint8Array, namespace: string | number[], buf?: number[], offset?: number) => string | number[];
export declare const v35: (name: string, version: number, hashfunc: (s: string) => string) => GenerateUUID;
