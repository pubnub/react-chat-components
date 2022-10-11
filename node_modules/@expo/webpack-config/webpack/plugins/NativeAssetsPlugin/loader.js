"use strict";
/**
 * Copyright © 2021 650 Industries.
 * Copyright © 2021 Callstack, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Based on https://github.com/callstack/repack/blob/3c1e059/packages/repack/src/webpack/plugins/AssetsPlugin/assetsLoader.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.raw = void 0;
const crypto_1 = __importDefault(require("crypto"));
const image_size_1 = require("image-size");
const loader_utils_1 = __importDefault(require("loader-utils"));
const path_1 = __importDefault(require("path"));
const schema_utils_1 = require("schema-utils");
const util_1 = require("util");
const escapeStringRegexp_1 = require("../../utils/escapeStringRegexp");
const NativeAssetResolver_1 = require("./NativeAssetResolver");
function getOptions(loaderContext) {
    const options = loader_utils_1.default.getOptions(loaderContext) || {};
    (0, schema_utils_1.validate)({
        type: 'object',
        required: ['platforms', 'assetExtensions'],
        properties: {
            platforms: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            assetExtensions: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            persist: { type: 'boolean' },
            publicPath: { type: 'string' },
        },
    }, options, { name: 'nativeAssetsLoader' });
    return options;
}
exports.raw = true;
function getAndroidResourceFolder({ name, contents, scale, scaleFilePath, }) {
    const testXml = /\.(xml)$/;
    const testImages = /\.(png|jpg|gif|webp)$/;
    const testFonts = /\.(ttf|otf|ttc)$/;
    if (
    // found font family
    (testXml.test(name) && (contents === null || contents === void 0 ? void 0 : contents.includes('font-family'))) ||
        // font extensions
        testFonts.test(name)) {
        return 'font';
    }
    else if (testImages.test(name) || testXml.test(name)) {
        // images extensions
        switch (scale) {
            case '@0.75x':
                return 'drawable-ldpi';
            case '@1x':
                return 'drawable-mdpi';
            case '@1.5x':
                return 'drawable-hdpi';
            case '@2x':
                return 'drawable-xhdpi';
            case '@3x':
                return 'drawable-xxhdpi';
            case '@4x':
                return 'drawable-xxxhdpi';
            default:
                throw new Error(`Unknown scale ${scale} for ${scaleFilePath}`);
        }
    }
    // everything else is going to RAW
    return 'raw';
}
async function nativeAssetsLoader() {
    this.cacheable();
    const callback = this.async();
    const logger = this.getLogger('nativeAssetsLoader');
    const rootContext = this.rootContext;
    logger.debug('Processing:', this.resourcePath);
    try {
        const options = getOptions(this);
        const pathSeparatorPattern = new RegExp(`\\${path_1.default.sep}`, 'g');
        const resourcePath = this.resourcePath;
        const dirname = path_1.default.dirname(resourcePath);
        // Relative path to rootContext without any ../ due to https://github.com/callstack/haul/issues/474
        // Assets from from outside of rootContext, should still be placed inside bundle output directory.
        // Example:
        //   resourcePath    = monorepo/node_modules/my-module/image.png
        //   dirname         = monorepo/node_modules/my-module
        //   rootContext     = monorepo/packages/my-app/
        //   relativeDirname = ../../node_modules/my-module (original)
        // So when we calculate destination for the asset for iOS ('assets' + relativeDirname + filename),
        // it will end up outside of `assets` directory, so we have to make sure it's:
        //   relativeDirname = node_modules/my-module (tweaked)
        const relativeDirname = path_1.default
            .relative(rootContext, dirname)
            .replace(new RegExp(`^[\\.\\${path_1.default.sep}]+`), '');
        const type = path_1.default.extname(resourcePath).replace(/^\./, '');
        const assetsPath = 'assets';
        const suffix = `(@\\d+(\\.\\d+)?x)?(\\.(${options.platforms.join('|')}))?\\.${type}$`;
        const filename = path_1.default.basename(resourcePath).replace(new RegExp(suffix), '');
        // Name with embedded relative dirname eg `node_modules_reactnative_libraries_newappscreen_components_logo.png`
        const normalizedName = `${(relativeDirname.length === 0
            ? filename
            : `${relativeDirname.replace(pathSeparatorPattern, '_')}_${filename}`)
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '')}.${type}`;
        const files = await new Promise((resolve, reject) => this.fs.readdir(dirname, (error, results) => {
            var _a;
            if (error) {
                reject(error);
            }
            else {
                resolve((_a = results === null || results === void 0 ? void 0 : results.filter(result => typeof result === 'string')) !== null && _a !== void 0 ? _a : []);
            }
        }));
        const scales = NativeAssetResolver_1.NativeAssetResolver.collectScales(files, {
            name: filename,
            type,
            assetExtensions: options.assetExtensions,
            platforms: options.platforms,
        });
        const scaleKeys = Object.keys(scales).sort((a, b) => parseInt(a.replace(/[^\d.]/g, ''), 10) - parseInt(b.replace(/[^\d.]/g, ''), 10));
        const readFileAsync = (0, util_1.promisify)(this.fs.readFile.bind(this.fs));
        const resolveAssetOutput = (results, scale, scaleFilePath) => {
            if (options.persist && options.platforms.includes('android')) {
                const destination = getAndroidResourceFolder({
                    name: normalizedName,
                    scale,
                    scaleFilePath,
                    contents: results,
                });
                return path_1.default.join(destination, normalizedName);
            }
            const name = `${filename}${scale === '@1x' ? '' : scale}.${type}`;
            return path_1.default.join(assetsPath, relativeDirname, name);
        };
        const resolveScaleAsync = async (scale) => {
            const scaleFilePath = path_1.default.join(dirname, scales[scale].name);
            this.addDependency(scaleFilePath);
            const results = await readFileAsync(scaleFilePath);
            return {
                content: results,
                destination: resolveAssetOutput(results, scale, scaleFilePath),
            };
        };
        const assets = await Promise.all(scaleKeys.map(resolveScaleAsync));
        assets.forEach(asset => {
            const { destination, content } = asset;
            logger.debug('Asset emitted:', destination);
            // Assets are emitted relatively to `output.path`.
            this.emitFile(destination, content !== null && content !== void 0 ? content : '');
        });
        let publicPath = path_1.default.join(assetsPath, relativeDirname).replace(pathSeparatorPattern, '/');
        if (options.publicPath) {
            publicPath = path_1.default.join(options.publicPath, publicPath);
        }
        // Emulate how metro creates a hash of all assets together
        const hasher = crypto_1.default.createHash('md5');
        assets.map(asset => { var _a; return hasher.update((_a = asset.content) !== null && _a !== void 0 ? _a : ''); });
        const hash = hasher.digest('hex');
        // Then emulate the individual hashes that Expo adds for sand boxing.
        const hashes = assets.map(asset => {
            var _a;
            return crypto_1.default
                .createHash('md5')
                .update((_a = asset.content) !== null && _a !== void 0 ? _a : '')
                .digest('hex');
        });
        // Redefine scales as an array of scale numbers.
        const processedScales = Object.keys(scales)
            // Strip `@` and `x` from string and parse as number.
            .map(scaleString => Number(scaleString.substring(1, scaleString.length - 1)))
            .filter(Boolean);
        let info;
        try {
            info = (0, image_size_1.imageSize)(this.resourcePath);
            const match = path_1.default
                .basename(this.resourcePath)
                .match(new RegExp(`^${(0, escapeStringRegexp_1.escapeStringRegexp)(filename)}${suffix}`));
            if (match === null || match === void 0 ? void 0 : match[1]) {
                const scale = Number(match[1].replace(/[^\d.]/g, ''));
                if (typeof scale === 'number' && Number.isFinite(scale)) {
                    info.width && (info.width /= scale);
                    info.height && (info.height /= scale);
                }
            }
        }
        catch {
            // Asset is not an image
        }
        logger.debug('Asset processed:', {
            resourcePath,
            platforms: options.platforms,
            rootContext,
            relativeDirname,
            type,
            assetsPath,
            filename,
            hash,
            hashes,
            normalizedName,
            scales: processedScales,
            assets: assets.map(asset => asset.destination),
            publicPath,
            width: info === null || info === void 0 ? void 0 : info.width,
            height: info === null || info === void 0 ? void 0 : info.height,
        });
        callback === null || callback === void 0 ? void 0 : callback(null, createAssetCodeBlock({
            persist: !!options.persist,
            scales: processedScales,
            filename,
            type,
            hash,
            hashes,
            httpServerLocation: publicPath,
            fileSystemLocation: dirname,
            ...(info || {}),
        }));
    }
    catch (error) {
        callback === null || callback === void 0 ? void 0 : callback(error);
    }
}
exports.default = nativeAssetsLoader;
function createAssetCodeBlock({ persist, scales, filename, type, hash, hashes, httpServerLocation, height, width, fileSystemLocation, }) {
    return [
        `module.exports = require('react-native/Libraries/Image/AssetRegistry').registerAsset({`,
        `  __packager_asset: true,`,
        // MUST be array of numbers otherwise the client will request the asset incorrectly.
        `  scales: ${JSON.stringify(scales)},`,
        `  name: ${JSON.stringify(filename)},`,
        `  type: ${JSON.stringify(type)},`,
        `  hash: ${JSON.stringify(hash)},`,
        // Added by `expo/tools/hashAssetFiles.js`
        `  fileHashes: ${JSON.stringify(hashes)},`,
        `  httpServerLocation: ${JSON.stringify(httpServerLocation)},`,
        // Only add in production apps
        `  ${persist ? `fileSystemLocation: ${JSON.stringify(fileSystemLocation)},` : ''}`,
        `  ${height != null ? `height: ${height},` : ''}`,
        `  ${width != null ? `width: ${width},` : ''}`,
        `});`,
    ].join('\n');
}
//# sourceMappingURL=loader.js.map