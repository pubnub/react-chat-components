/**
 * Copyright © 2021 650 Industries.
 * Copyright © 2021 Callstack, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Based on https://github.com/callstack/repack/blob/3c1e059/packages/repack/src/webpack/plugins/AssetsPlugin/AssetResolver.ts
 */
/// <reference types="node" />
/// <reference types="graceful-fs" />
import fs from 'fs';
import webpack from 'webpack';
export interface NativeAssetResolverConfig {
    /**
     * Override default test RegExp. If the asset matches the `test` RegExp, it will be process
     * by the custom React Native asset resolver. Otherwise, the resolution will process normally and
     * the asset will be handled by Webpack.
     */
    test?: RegExp;
    /** Target application platform. */
    platforms: string[];
    /** Extensions to collect */
    assetExtensions: string[];
}
export interface CollectedScales {
    [key: string]: {
        platform: string;
        name: string;
    };
}
interface CollectOptions {
    name: string;
    /**
     * `['ios', 'native']`
     */
    platforms: string[];
    type: string;
    assetExtensions: string[];
}
declare type Resolver = {
    fileSystem: typeof fs;
    getHook: (type: string) => {
        tapAsync: (type: string, callback: (request: any, context: any, callback: any) => void) => void;
    };
};
export declare class NativeAssetResolver {
    readonly config: NativeAssetResolverConfig;
    private compiler;
    static collectScales(files: string[], { name, type, platforms, assetExtensions }: CollectOptions): CollectedScales;
    constructor(config: NativeAssetResolverConfig, compiler: webpack.Compiler);
    private isValidPath;
    apply(resolver: Resolver): void;
}
export {};
