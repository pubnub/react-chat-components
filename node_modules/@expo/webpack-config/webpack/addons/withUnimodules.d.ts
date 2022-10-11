import { AnyConfiguration, Arguments, InputEnvironment } from '../types';
/**
 * Wrap your existing webpack config with support for Unimodules.
 * ex: Storybook `({ config }) => withUnimodules(config)`
 *
 * @param webpackConfig Optional existing Webpack config to modify.
 * @param env Optional Environment options for configuring what features the Webpack config supports.
 * @param argv
 * @category addons
 */
export default function withUnimodules(webpackConfig?: AnyConfiguration, env?: InputEnvironment, argv?: Arguments): AnyConfiguration;
/**
 * We have to transpile these modules and make them not external too.
 * We have to do this because next.js by default externals all `node_modules`'s js files.
 *
 * Reference:
 * - https://github.com/martpie/next-transpile-modules/blob/77450a0c0307e4b650d7acfbc18641ef9465f0da/index.js#L48-L62
 * - https://github.com/zeit/next.js/blob/0b496a45e85f3c9aa3cf2e77eef10888be5884fc/packages/next/build/webpack-config.ts#L185-L258
 * - `include` function is from https://github.com/expo/expo-cli/blob/3933f3d6ba65bffec2738ece71b62f2c284bd6e4/packages/webpack-config/webpack/loaders/createBabelLoaderAsync.js#L76-L96
 *
 * @param webpackConfig Config to be modified
 * @param shouldIncludeModule A method that returns a boolean when the input module should be transpiled and externed.
 */
export declare function ignoreExternalModules(webpackConfig: AnyConfiguration, shouldIncludeModule: (path: string) => boolean, isWebpack5: boolean): AnyConfiguration;
