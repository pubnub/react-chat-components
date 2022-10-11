"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tapable_1 = require("tapable");
const hooksMap = new WeakMap();
function createWebpackPluginHooks() {
    return {
        beforeEmit: new tapable_1.AsyncSeriesWaterfallHook(['pluginArgs']),
        afterEmit: new tapable_1.AsyncSeriesWaterfallHook(['pluginArgs']),
    };
}
class JsonWebpackPlugin {
    constructor(options) {
        this.options = options;
        this.writeObject = async (compilation, callback) => {
            let result = {
                json: this.options.json,
                path: this.options.path,
                plugin: this,
            };
            try {
                result = await JsonWebpackPlugin.getHooks(compilation).beforeEmit.promise(result);
            }
            catch (error) {
                compilation.errors.push(error);
            }
            const json = JSON.stringify(result.json, undefined, this.options.pretty ? 2 : undefined);
            // Once all files are added to the webpack compilation
            // let the webpack compiler continue
            compilation.assets[result.path] = {
                source: () => json,
                size: () => json.length,
            };
            await JsonWebpackPlugin.getHooks(compilation).afterEmit.promise({
                json,
                outputName: result.path,
                plugin: this,
            });
            callback();
        };
        if (!this.options.path || !this.options.json) {
            throw new Error('Failed to write json because either `path` or `json` were not defined.');
        }
    }
    static getHooks(compilation) {
        let hooks = hooksMap.get(compilation);
        // Setup the hooks only once
        if (hooks === undefined) {
            hooks = createWebpackPluginHooks();
            hooksMap.set(compilation, hooks);
        }
        return hooks;
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync(this.constructor.name, this.writeObject);
    }
}
exports.default = JsonWebpackPlugin;
//# sourceMappingURL=JsonWebpackPlugin.js.map