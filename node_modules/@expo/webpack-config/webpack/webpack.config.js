"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** @internal */ /** */
/* eslint-env node */
const chalk_1 = __importDefault(require("chalk"));
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const expo_pwa_1 = require("expo-pwa");
const fs_extra_1 = require("fs-extra");
const getenv_1 = require("getenv");
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const node_html_parser_1 = require("node-html-parser");
const path_1 = __importDefault(require("path"));
const pnp_webpack_plugin_1 = __importDefault(require("pnp-webpack-plugin"));
const ModuleNotFoundPlugin_1 = __importDefault(require("react-dev-utils/ModuleNotFoundPlugin"));
const WatchMissingNodeModulesPlugin_1 = __importDefault(require("react-dev-utils/WatchMissingNodeModulesPlugin"));
const resolve_from_1 = __importDefault(require("resolve-from"));
const webpack_1 = __importStar(require("webpack"));
const webpack_manifest_plugin_1 = __importDefault(require("webpack-manifest-plugin"));
const addons_1 = require("./addons");
const env_1 = require("./env");
const loaders_1 = require("./loaders");
const plugins_1 = require("./plugins");
const ExpoAppManifestWebpackPlugin_1 = __importDefault(require("./plugins/ExpoAppManifestWebpackPlugin"));
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = (0, getenv_1.boolish)('GENERATE_SOURCEMAP', true);
const shouldUseNativeCodeLoading = (0, getenv_1.boolish)('EXPO_WEBPACK_USE_NATIVE_CODE_LOADING', false);
const isCI = (0, getenv_1.boolish)('CI', false);
function getDevtool({ production, development }, { devtool }) {
    if (production) {
        // string or false
        if (devtool !== undefined) {
            // When big assets are involved sources maps can become expensive and cause your process to run out of memory.
            return devtool;
        }
        return shouldUseSourceMap ? 'source-map' : false;
    }
    if (development) {
        return 'cheap-module-source-map';
    }
    return false;
}
function getOutput(locations, mode, publicPath, platform) {
    const commonOutput = {
        // We inferred the "public path" (such as / or /my-project) from homepage.
        // We use "/" in development.
        publicPath,
        // Build folder (default `web-build`)
        path: locations.production.folder,
        // this defaults to 'window', but by setting it to 'this' then
        // module chunks which are built will work in web workers as well.
        globalObject: 'this',
    };
    if (mode === 'production') {
        commonOutput.filename = 'static/js/[name].[contenthash:8].js';
        // There are also additional JS chunk files if you use code splitting.
        commonOutput.chunkFilename = 'static/js/[name].[contenthash:8].chunk.js';
        // Point sourcemap entries to original disk location (format as URL on Windows)
        commonOutput.devtoolModuleFilenameTemplate = (info) => path_1.default.relative(locations.root, info.absoluteResourcePath).replace(/\\/g, '/');
    }
    else {
        // Add comments that describe the file import/exports.
        // This will make it easier to debug.
        commonOutput.pathinfo = true;
        // Give the output bundle a constant name to prevent caching.
        // Also there are no actual files generated in dev.
        commonOutput.filename = 'static/js/bundle.js';
        // There are also additional JS chunk files if you use code splitting.
        commonOutput.chunkFilename = 'static/js/[name].chunk.js';
        // Point sourcemap entries to original disk location (format as URL on Windows)
        commonOutput.devtoolModuleFilenameTemplate = (info
        // TODO: Revisit for web
        ) => path_1.default.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
    }
    if (!shouldUseNativeCodeLoading && isPlatformNative(platform)) {
        // Give the output bundle a constant name to prevent caching.
        // Also there are no actual files generated in dev.
        commonOutput.filename = `index.bundle`;
        // This works best for our custom native symbolication middleware
        commonOutput.devtoolModuleFilenameTemplate = (info) => info.resourcePath.replace(/\\/g, '/');
    }
    return commonOutput;
}
function isPlatformNative(platform) {
    return ['ios', 'android'].includes(platform);
}
function getPlatformsExtensions(platform) {
    if (isPlatformNative(platform)) {
        return (0, env_1.getNativeModuleFileExtensions)(platform, 'native');
    }
    return (0, env_1.getModuleFileExtensions)(platform);
}
async function default_1(env, argv = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if ('report' in env) {
        console.warn(chalk_1.default.bgRed.black(`The \`report\` property of \`@expo/webpack-config\` is now deprecated.\nhttps://expo.fyi/webpack-report-property-is-deprecated`));
    }
    const config = (0, env_1.getConfig)(env);
    const mode = (0, env_1.getMode)(env);
    const isDev = mode === 'development';
    const isProd = mode === 'production';
    // Because the native React runtime is different to the browser we need to make
    // some core modifications to webpack.
    const isNative = ['ios', 'android'].includes(env.platform);
    if (isNative) {
        env.pwa = false;
    }
    const locations = env.locations || (await (0, env_1.getPathsAsync)(env.projectRoot));
    const { publicPath, publicUrl } = (0, env_1.getPublicPaths)(env);
    const { build: buildConfig = {} } = config.web || {};
    const devtool = getDevtool({ production: isProd, development: isDev }, buildConfig);
    const appEntry = [];
    // In solutions like Gatsby the main entry point doesn't need to be known.
    if (locations.appMain) {
        appEntry.push(locations.appMain);
    }
    const webpackDevClientEntry = require.resolve('react-dev-utils/webpackHotDevClient');
    if (isNative) {
        const getPolyfillsPath = resolve_from_1.default.silent(env.projectRoot, 'react-native/rn-get-polyfills.js');
        if (getPolyfillsPath) {
            appEntry.unshift(...require(getPolyfillsPath)(), (0, resolve_from_1.default)(env.projectRoot, 'react-native/Libraries/Core/InitializeCore'));
            if (isDev) {
                // TODO: Native HMR
            }
        }
    }
    else {
        // Add a loose requirement on the ResizeObserver polyfill if it's installed...
        // Avoid `withEntry` as we don't need so much complexity with this config.
        const resizeObserverPolyfill = resolve_from_1.default.silent(env.projectRoot, 'resize-observer-polyfill/dist/ResizeObserver.global');
        if (resizeObserverPolyfill) {
            appEntry.unshift(resizeObserverPolyfill);
        }
        if (isDev) {
            // https://github.com/facebook/create-react-app/blob/e59e0920f3bef0c2ac47bbf6b4ff3092c8ff08fb/packages/react-scripts/config/webpack.config.js#L144
            // Include an alternative client for WebpackDevServer. A client's job is to
            // connect to WebpackDevServer by a socket and get notified about changes.
            // When you save a file, the client will either apply hot updates (in case
            // of CSS changes), or refresh the page (in case of JS changes). When you
            // make a syntax error, this client will display a syntax error overlay.
            // Note: instead of the default WebpackDevServer client, we use a custom one
            // to bring better experience for Create React App users. You can replace
            // the line below with these two lines if you prefer the stock client:
            // require.resolve('webpack-dev-server/client') + '?/',
            // require.resolve('webpack/hot/dev-server'),
            appEntry.unshift(webpackDevClientEntry);
        }
    }
    let generatePWAImageAssets = !isNative && !isDev;
    if (!isDev && typeof env.pwa !== 'undefined') {
        generatePWAImageAssets = env.pwa;
    }
    const filesToCopy = [
        {
            from: locations.template.folder,
            to: locations.production.folder,
            toType: 'dir',
            noErrorOnMissing: true,
            globOptions: {
                dot: true,
                // We generate new versions of these based on the templates
                ignore: [
                    // '**/serve.json',
                    // '**/index.html',
                    '**/icon.png',
                ],
            },
        },
        {
            from: locations.template.serveJson,
            to: locations.production.serveJson,
        },
    ];
    const templateIndex = (0, node_html_parser_1.parse)((0, fs_extra_1.readFileSync)(locations.template.indexHtml, { encoding: 'utf8' }));
    // @ts-ignore
    const templateLinks = templateIndex.querySelectorAll('link');
    const links = templateLinks.map((value) => ({
        rel: value.getAttribute('rel'),
        media: value.getAttribute('media'),
        href: value.getAttribute('href'),
        sizes: value.getAttribute('sizes'),
        node: value,
    }));
    // @ts-ignore
    const templateMeta = templateIndex.querySelectorAll('meta');
    const meta = templateMeta.map((value) => ({
        name: value.getAttribute('name'),
        content: value.getAttribute('content'),
        node: value,
    }));
    const [manifestLink] = links.filter(link => typeof link.rel === 'string' && link.rel.split(' ').includes('manifest'));
    let templateManifest = locations.template.manifest;
    // Only inject a manifest tag if the template is missing one.
    // This enables users to disable tag injection.
    const shouldInjectManifestTag = !manifestLink;
    if (manifestLink === null || manifestLink === void 0 ? void 0 : manifestLink.href) {
        // Often the manifest will be referenced as `/manifest.json` (to support public paths).
        // We've detected that the user has manually added a manifest tag to their template index.html which according
        // to our docs means they want to use a custom manifest.json instead of having a new one generated.
        //
        // Normalize the link (removing the beginning slash) so it can be resolved relative to the user's static folder.
        // Ref: https://docs.expo.dev/guides/progressive-web-apps/#manual-setup
        if (manifestLink.href.startsWith('/')) {
            manifestLink.href = manifestLink.href.substring(1);
        }
        templateManifest = locations.template.get(manifestLink.href);
    }
    const ensureSourceAbsolute = (input) => {
        if (!input)
            return input;
        return {
            ...input,
            src: locations.absolute(input.src),
        };
    };
    // TODO(Bacon): Move to expo/config - manifest code from XDL Project
    const publicConfig = {
        ...config,
        developer: {
            tool: 'expo-cli',
            projectRoot: env.projectRoot,
        },
        packagerOpts: {
            dev: !isProd,
            minify: isProd,
            https: env.https,
        },
    };
    let webpackConfig = {
        mode,
        entry: {
            app: appEntry,
        },
        // Disable file info logs.
        stats: 'none',
        // https://webpack.js.org/configuration/other-options/#bail
        // Fail out on the first error instead of tolerating it.
        bail: isProd,
        devtool,
        // This must point to the project root (where the webpack.config.js would normally be located).
        // If this is anywhere else, the source maps and errors won't show correct paths.
        context: (_a = env.projectRoot) !== null && _a !== void 0 ? _a : __dirname,
        // configures where the build ends up
        output: getOutput(locations, mode, publicPath, env.platform),
        plugins: [
            // Delete the build folder
            isProd &&
                new clean_webpack_plugin_1.CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns: [locations.production.folder],
                    dry: false,
                    verbose: false,
                }),
            // Copy the template files over
            isProd && !isNative && new copy_webpack_plugin_1.default({ patterns: filesToCopy }),
            // Generate the `index.html`
            (!isNative || shouldUseNativeCodeLoading) && new plugins_1.ExpoHtmlWebpackPlugin(env, templateIndex),
            (!isNative || shouldUseNativeCodeLoading) &&
                plugins_1.ExpoInterpolateHtmlPlugin.fromEnv(env, plugins_1.ExpoHtmlWebpackPlugin),
            isNative &&
                new plugins_1.NativeAssetsPlugin({
                    platforms: [env.platform, 'native'],
                    persist: isProd,
                    assetExtensions: [
                        // Image formats
                        'bmp',
                        'gif',
                        'jpg',
                        'jpeg',
                        'png',
                        'psd',
                        'svg',
                        'webp',
                        // Video formats
                        'm4v',
                        'mov',
                        'mp4',
                        'mpeg',
                        'mpg',
                        'webm',
                        // Audio formats
                        'aac',
                        'aiff',
                        'caf',
                        'm4a',
                        'mp3',
                        'wav',
                        // Document formats
                        'html',
                        'pdf',
                        'yaml',
                        'yml',
                        // Font formats
                        'otf',
                        'ttf',
                        // Archives (virtual files)
                        'zip',
                    ],
                }),
            isNative &&
                new ExpoAppManifestWebpackPlugin_1.default({
                    template: locations.template.get('app.config.json'),
                    path: 'app.config.json',
                    publicPath,
                }, publicConfig),
            env.pwa &&
                new plugins_1.ExpoPwaManifestWebpackPlugin({
                    template: templateManifest,
                    path: 'manifest.json',
                    publicPath,
                    inject: shouldInjectManifestTag,
                }, config),
            !isNative &&
                new plugins_1.FaviconWebpackPlugin({
                    projectRoot: env.projectRoot,
                    publicPath,
                    links,
                }, ensureSourceAbsolute((0, expo_pwa_1.getFaviconIconConfig)(config))),
            generatePWAImageAssets &&
                new plugins_1.ApplePwaWebpackPlugin({
                    projectRoot: env.projectRoot,
                    publicPath,
                    links,
                    meta,
                }, {
                    name: (_b = env.config.web) === null || _b === void 0 ? void 0 : _b.shortName,
                    isFullScreen: (_e = (_d = (_c = env.config.web) === null || _c === void 0 ? void 0 : _c.meta) === null || _d === void 0 ? void 0 : _d.apple) === null || _e === void 0 ? void 0 : _e.touchFullscreen,
                    isWebAppCapable: !!((_h = (_g = (_f = env.config.web) === null || _f === void 0 ? void 0 : _f.meta) === null || _g === void 0 ? void 0 : _g.apple) === null || _h === void 0 ? void 0 : _h.mobileWebAppCapable),
                    barStyle: (_l = (_k = (_j = env.config.web) === null || _j === void 0 ? void 0 : _j.meta) === null || _k === void 0 ? void 0 : _k.apple) === null || _l === void 0 ? void 0 : _l.barStyle,
                }, ensureSourceAbsolute((0, expo_pwa_1.getSafariIconConfig)(env.config)), ensureSourceAbsolute((0, expo_pwa_1.getSafariStartupImageConfig)(env.config))),
            generatePWAImageAssets &&
                new plugins_1.ChromeIconsWebpackPlugin({
                    projectRoot: env.projectRoot,
                    publicPath,
                }, ensureSourceAbsolute((0, expo_pwa_1.getChromeIconConfig)(config))),
            // This gives some necessary context to module not found errors, such as
            // the requesting resource.
            new ModuleNotFoundPlugin_1.default(locations.root),
            new plugins_1.ExpoDefinePlugin({
                mode,
                publicUrl,
                config,
            }),
            // Disable chunking on native
            // https://gist.github.com/glennreyes/f538a369db0c449b681e86ef7f86a254#file-razzle-config-js
            isNative &&
                new webpack_1.default.optimize.LimitChunkCountPlugin({
                    maxChunks: 1,
                }),
            // This is necessary to emit hot updates (currently CSS only):
            !isNative && isDev && new webpack_1.HotModuleReplacementPlugin(),
            // Replace the Metro specific HMR code in `react-native` with
            // a shim.
            isNative &&
                new webpack_1.default.NormalModuleReplacementPlugin(/react-native\/Libraries\/Utilities\/HMRClient\.js$/, require.resolve('./runtime/metro-runtime-shim')),
            // If you require a missing module and then `npm install` it, you still have
            // to restart the development server for Webpack to discover it. This plugin
            // makes the discovery automatic so you don't have to restart.
            // See https://github.com/facebook/create-react-app/issues/186
            isDev && new WatchMissingNodeModulesPlugin_1.default(locations.modules),
            !isNative &&
                isProd &&
                new mini_css_extract_plugin_1.default({
                    // Options similar to the same options in webpackOptions.output
                    // both options are optional
                    filename: 'static/css/[name].[contenthash:8].css',
                    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
                }),
            // Generate an asset manifest file with the following content:
            // - "files" key: Mapping of all asset filenames to their corresponding
            //   output file so that tools can pick it up without having to parse
            //   `index.html`
            // - "entrypoints" key: Array of files which are included in `index.html`,
            //   can be used to reconstruct the HTML if necessary
            !isNative &&
                new webpack_manifest_plugin_1.default({
                    fileName: 'asset-manifest.json',
                    publicPath,
                    filter: ({ path }) => {
                        if (path.match(/(apple-touch-startup-image|apple-touch-icon|chrome-icon|precache-manifest)/)) {
                            return false;
                        }
                        // Remove compressed versions and service workers
                        return !(path.endsWith('.gz') || path.endsWith('worker.js'));
                    },
                    generate: (seed, files, entrypoints) => {
                        const manifestFiles = files.reduce((manifest, file) => {
                            if (file.name) {
                                manifest[file.name] = file.path;
                            }
                            return manifest;
                        }, seed);
                        const entrypointFiles = entrypoints.app.filter(fileName => !fileName.endsWith('.map'));
                        return {
                            files: manifestFiles,
                            entrypoints: entrypointFiles,
                        };
                    },
                }),
            new plugins_1.ExpectedErrorsPlugin(),
            // Skip using a progress bar in CI
            env.logger &&
                new plugins_1.ExpoProgressBarPlugin({
                    logger: env.logger,
                    nonInteractive: isCI,
                    bundleDetails: {
                        bundleType: 'bundle',
                        platform: env.platform,
                        entryFile: locations.appMain,
                        dev: isDev !== null && isDev !== void 0 ? isDev : false,
                        minify: isProd !== null && isProd !== void 0 ? isProd : false,
                    },
                }),
        ].filter(Boolean),
        module: {
            strictExportPresence: false,
            rules: [
                // Disable require.ensure because it breaks tree shaking.
                { parser: { requireEnsure: false } },
                {
                    oneOf: (0, loaders_1.createAllLoaders)(env),
                },
            ].filter(Boolean),
        },
        resolveLoader: {
            plugins: [
                // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
                // from the current package.
                pnp_webpack_plugin_1.default.moduleLoader(module),
            ],
        },
        resolve: {
            mainFields: isNative ? ['react-native', 'browser', 'main'] : undefined,
            aliasFields: isNative ? ['react-native', 'browser', 'main'] : undefined,
            extensions: getPlatformsExtensions(env.platform),
            plugins: [
                // Adds support for installing with Plug'n'Play, leading to faster installs and adding
                // guards against forgotten dependencies and such.
                pnp_webpack_plugin_1.default,
            ],
            symlinks: false,
        },
        // Turn off performance processing because we utilize
        // our own (CRA) hints via the FileSizeReporter
        // TODO: Bacon: Remove this higher value
        performance: isCI ? false : { maxAssetSize: 600000, maxEntrypointSize: 600000 },
    };
    if (!shouldUseNativeCodeLoading) {
        webpackConfig = (0, addons_1.withPlatformSourceMaps)(webpackConfig, env);
    }
    if (isNative) {
        // https://github.com/webpack/webpack/blob/f06086c53b2277e421604c5cea6f32f5c5b6d117/declarations/WebpackOptions.d.ts#L504-L518
        webpackConfig.target = 'webworker';
    }
    webpackConfig = (0, addons_1.withOptimizations)(webpackConfig);
    if (!isProd) {
        webpackConfig = (0, addons_1.withDevServer)(webpackConfig, env, {
            allowedHost: argv.allowedHost,
            proxy: argv.proxy,
        });
    }
    if (!isNative) {
        webpackConfig = (0, addons_1.withNodeMocks)((0, addons_1.withAlias)(webpackConfig, (0, env_1.getAliases)(env.projectRoot)));
    }
    return webpackConfig;
}
exports.default = default_1;
//# sourceMappingURL=webpack.config.js.map