"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("@expo/config/paths");
const resolve_from_1 = __importDefault(require("resolve-from"));
const utils_1 = require("../utils");
/**
 * Inject a new entry path into an existing Webpack config.
 *
 * @param webpackConfig Existing Webpack config to modify.
 * @param env Environment props used to get the Expo config.
 * @param options new entry path to inject.
 * @category addons
 */
function withEntry(webpackConfig, env = {}, options) {
    env.projectRoot = env.projectRoot || (0, paths_1.getPossibleProjectRoot)();
    const extraAppEntry = resolve_from_1.default.silent(env.projectRoot, options.entryPath);
    if (!extraAppEntry) {
        if (options.strict) {
            throw new Error(`[WEBPACK]: The required app entry module: "${options.entryPath}" couldn't be found.`);
        }
        // Couldn't resolve the app entry so return the config without modifying it.
        return webpackConfig;
    }
    const expoEntry = webpackConfig.entry;
    webpackConfig.entry = async () => {
        const entries = await (0, utils_1.resolveEntryAsync)(expoEntry);
        if (entries.app) {
            if (!entries.app.includes(extraAppEntry)) {
                if (!Array.isArray(entries.app)) {
                    entries.app = [entries.app];
                }
                entries.app.unshift(extraAppEntry);
            }
        }
        else if (options.strict) {
            // Better to be safe...
            throw new Error(`[WEBPACK]: Failed to include required app entry module: "${options.entryPath}" because the webpack entry object doesn't contain an \`app\` field.`);
        }
        return entries;
    };
    return webpackConfig;
}
exports.default = withEntry;
//# sourceMappingURL=withEntry.js.map