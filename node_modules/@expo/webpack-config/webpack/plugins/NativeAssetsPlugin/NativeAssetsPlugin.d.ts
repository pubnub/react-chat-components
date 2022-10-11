import { Compiler, Plugin } from 'webpack';
import { NativeAssetResolverConfig } from './NativeAssetResolver';
/**
 * Convert any asset type to a JS code block that uses React Native's AssetRegistry module.
 */
export declare class NativeAssetsPlugin implements Plugin {
    private config;
    constructor(config: NativeAssetResolverConfig & {
        persist?: boolean;
    });
    apply(compiler: Compiler): void;
}
