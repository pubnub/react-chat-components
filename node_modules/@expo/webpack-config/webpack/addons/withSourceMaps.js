"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
function isNative(env) {
    return !!env.platform && ['ios', 'android'].includes(env.platform);
}
function createSourceMapPlugin(webpackConfig, env = {}) {
    var _a, _b, _c, _d;
    const mode = (_a = env.mode) !== null && _a !== void 0 ? _a : webpackConfig.mode;
    const isDev = mode !== 'production';
    return (
    // This is a hack that we use in place of devtool because the index.bundle is not index.js on native.
    // The default devtool won't test for .bundle and there's no way to set it there.
    // This doesn't support inline source maps.
    new webpack_1.SourceMapDevToolPlugin({
        test: /\.(js|tsx?|(js)?bundle)($|\?)/i,
        exclude: /\.chunk\.(js)?bundle$/,
        filename: (_c = (_b = webpackConfig.output) === null || _b === void 0 ? void 0 : _b.sourceMapFilename) !== null && _c !== void 0 ? _c : '[file].map',
        append: `//# sourceMappingURL=[url]?platform=${env.platform}`,
        // @ts-ignore: this is how webpack works internally
        moduleFilenameTemplate: (_d = webpackConfig.output) === null || _d === void 0 ? void 0 : _d.devtoolModuleFilenameTemplate,
        // Emulate the `devtool` settings based on CRA defaults
        ...(isDev
            ? {
                // `module: false` = cheap-module-source-map -- less accurate but faster
                // `module: true` = more accurate but some paths are non existent
                module: true,
                columns: false,
            }
            : {
            // source-map
            }),
    }));
}
/**
 * Because webpack doesn't support `.bundle` extensions (why should they).
 * We need to extract the default settings for source maps and create a native source map plugin.
 * This does nothing if the env.platform is not ios or android.
 *
 * @param webpackConfig
 * @param env
 */
function withPlatformSourceMaps(webpackConfig, env = {}) {
    if (!isNative(env)) {
        return webpackConfig;
    }
    if (!webpackConfig.plugins)
        webpackConfig.plugins = [];
    webpackConfig.plugins.push(createSourceMapPlugin(webpackConfig, env));
    webpackConfig.devtool = false;
    return webpackConfig;
}
exports.default = withPlatformSourceMaps;
//# sourceMappingURL=withSourceMaps.js.map