import { Rule } from 'webpack';
/**
 * Create a `Webpack.Rule` for loading fonts and including Expo vector icons.
 * Fonts will be loaded to `./fonts/[name].[ext]`.
 *
 * @param projectRoot root project folder.
 * @param includeModule method for resolving a node module given its package name.
 * @category loaders
 */
export default function createFontLoader(projectRoot: string, includeModule: (...props: string[]) => string): Rule;
