"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeAssetsPlugin = void 0;
const NativeAssetResolver_1 = require("./NativeAssetResolver");
/**
 * Convert any asset type to a JS code block that uses React Native's AssetRegistry module.
 */
class NativeAssetsPlugin {
    constructor(config) {
        this.config = config;
    }
    apply(compiler) {
        const resolver = new NativeAssetResolver_1.NativeAssetResolver(this.config, compiler);
        if (!compiler.options.module) {
            compiler.options.module = {
                rules: [],
            };
        }
        compiler.options.module.rules.push({
            test: resolver.config.test,
            use: [
                {
                    loader: require.resolve('./loader.cjs'),
                    options: {
                        platforms: this.config.platforms,
                        assetExtensions: this.config.assetExtensions,
                        persist: this.config.persist,
                    },
                },
            ],
        });
        if (!compiler.options.resolve) {
            compiler.options.resolve = {};
        }
        compiler.options.resolve.plugins = (compiler.options.resolve.plugins || []).concat(resolver);
    }
}
exports.NativeAssetsPlugin = NativeAssetsPlugin;
//# sourceMappingURL=NativeAssetsPlugin.js.map