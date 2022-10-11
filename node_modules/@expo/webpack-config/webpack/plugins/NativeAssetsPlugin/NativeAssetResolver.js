"use strict";
/**
 * Copyright © 2021 650 Industries.
 * Copyright © 2021 Callstack, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Based on https://github.com/callstack/repack/blob/3c1e059/packages/repack/src/webpack/plugins/AssetsPlugin/AssetResolver.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeAssetResolver = void 0;
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const escapeStringRegexp_1 = require("../../utils/escapeStringRegexp");
class NativeAssetResolver {
    constructor(config, compiler) {
        this.config = config;
        this.compiler = compiler;
        if (!this.config.test) {
            // Like: `/.(ios|native)$/`
            this.config.test = new RegExp(`.(${this.config.assetExtensions.join('|')})$`);
        }
    }
    static collectScales(files, { name, type, platforms, assetExtensions }) {
        const platformRegexp = platforms.join('|');
        const regex = new RegExp(`^(${assetExtensions.join('|')})$`).test(type)
            ? new RegExp(`^${(0, escapeStringRegexp_1.escapeStringRegexp)(name)}(@\\d+(\\.\\d+)?x)?(\\.(${platformRegexp}))?\\.${type}$`)
            : new RegExp(`^${(0, escapeStringRegexp_1.escapeStringRegexp)(name)}(\\.(${platformRegexp}))?\\.${type}$`);
        const priority = (queryPlatform) => platforms.reverse().indexOf(queryPlatform);
        // Build a map of files according to the scale
        const output = {};
        for (const file of files) {
            const match = regex.exec(file);
            if (match) {
                let [, scale, , , platform] = match;
                scale = scale || '@1x';
                if (!output[scale] || priority(platform) > priority(output[scale].platform)) {
                    output[scale] = { platform, name: file };
                }
            }
        }
        return output;
    }
    isValidPath(requestPath) {
        return typeof requestPath === 'string' && this.config.test.test(requestPath);
    }
    apply(resolver) {
        const { platforms, assetExtensions } = this.config;
        const logger = this.compiler.getInfrastructureLogger('NativeAssetResolver');
        const readdirAsync = (0, util_1.promisify)(resolver.fileSystem.readdir.bind(resolver.fileSystem));
        resolver
            .getHook('file')
            .tapAsync('NativeAssetResolver', async (request, _context, callback) => {
            var _a;
            const requestPath = request.path;
            if (!this.isValidPath(requestPath)) {
                return callback();
            }
            logger.debug('Processing asset:', requestPath);
            let files;
            const dir = path_1.default.dirname(requestPath);
            try {
                files = (await readdirAsync(dir)).filter(result => typeof result === 'string');
            }
            catch (error) {
                logger.error(`Failed to read Webpack fs directory: ${dir}`, error);
                return callback();
            }
            const basename = path_1.default.basename(requestPath);
            const name = basename.replace(/\.[^.]+$/, '');
            const type = path_1.default.extname(requestPath).substring(1);
            let resolved = files.includes(basename) ? requestPath : undefined;
            if (!resolved) {
                const map = NativeAssetResolver.collectScales(files, {
                    name,
                    type,
                    platforms,
                    assetExtensions,
                });
                const key = map['@1x']
                    ? '@1x'
                    : Object.keys(map).sort((a, b) => Number(a.replace(/[^\d.]/g, '')) - Number(b.replace(/[^\d.]/g, '')))[0];
                resolved = ((_a = map[key]) === null || _a === void 0 ? void 0 : _a.name)
                    ? path_1.default.resolve(path_1.default.dirname(requestPath), map[key].name)
                    : undefined;
                if (!resolved) {
                    logger.error('Cannot resolve:', requestPath, {
                        files,
                        scales: map,
                    });
                    callback();
                    return;
                }
            }
            const resolvedFile = {
                ...request,
                path: resolved,
                // @ts-ignore
                relativePath: request.relativePath && resolver.join(request.relativePath, resolved),
                file: true,
            };
            logger.debug('Asset resolved:', requestPath, '->', resolved);
            callback(null, resolvedFile);
        });
    }
}
exports.NativeAssetResolver = NativeAssetResolver;
//# sourceMappingURL=NativeAssetResolver.js.map