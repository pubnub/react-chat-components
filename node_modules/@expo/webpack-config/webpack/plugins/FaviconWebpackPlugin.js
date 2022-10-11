"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const expo_pwa_1 = require("expo-pwa");
const ModifyHtmlWebpackPlugin_1 = __importDefault(require("./ModifyHtmlWebpackPlugin"));
function logNotice(type, message) {
    console.log(chalk_1.default.magenta(`\u203A ${type}: ${chalk_1.default.gray(message)}`));
}
function logWarning(type, message) {
    console.log(chalk_1.default.yellow(`\u203A ${type}: ${chalk_1.default.gray(message)}`));
}
class FaviconWebpackPlugin extends ModifyHtmlWebpackPlugin_1.default {
    constructor(pwaOptions, favicon) {
        super();
        this.pwaOptions = pwaOptions;
        this.favicon = favicon;
    }
    async modifyAsync(compiler, compilation, data) {
        if (!this.favicon) {
            logWarning('Favicon', 'No template image found, skipping auto generation...');
            return data;
        }
        const assets = await (0, expo_pwa_1.generateFaviconAsync)(this.pwaOptions, this.favicon);
        const links = this.pwaOptions.links.filter(v => { var _a; return (_a = v.rel) === null || _a === void 0 ? void 0 : _a.split(' ').includes('icon'); });
        for (const asset of assets) {
            const { attributes = {} } = asset.tag;
            const faviconExists = links.some(v => { var _a; return v.sizes ? v.sizes === attributes.sizes : (_a = v.rel) === null || _a === void 0 ? void 0 : _a.includes('shortcut'); });
            if (faviconExists) {
                logNotice('Favicon', `Using custom <link rel="${attributes.rel}"${attributes.sizes ? ` sizes="${attributes.sizes}"` : ''} .../>`);
            }
            else {
                compilation.assets[asset.asset.path] = {
                    source: () => asset.asset.source,
                    size: () => asset.asset.source.length,
                };
                data.assetTags.meta.push(asset.tag);
            }
        }
        return data;
    }
}
exports.default = FaviconWebpackPlugin;
//# sourceMappingURL=FaviconWebpackPlugin.js.map