"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Some libraries import Node modules but don't use them in the browser.
 * Tell Webpack to provide empty mocks for them so importing them works.
 *
 * @param webpackConfig Existing Webpack config to modify.
 * @category addons
 */
function withNodeMocks(webpackConfig) {
    if (typeof webpackConfig.target === 'string' &&
        ['electron', 'electron-main', 'node'].includes(webpackConfig.target)) {
        return webpackConfig;
    }
    webpackConfig.node = {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
        ...(webpackConfig.node || {}),
    };
    return webpackConfig;
}
exports.default = withNodeMocks;
//# sourceMappingURL=withNodeMocks.js.map