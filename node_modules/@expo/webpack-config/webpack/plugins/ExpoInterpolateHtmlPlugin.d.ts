import HtmlWebpackPlugin from 'html-webpack-plugin';
import OriginalInterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import { Environment } from '../types';
/**
 * Add variables to the `index.html`.
 *
 * @category plugins
 */
export default class InterpolateHtmlPlugin extends OriginalInterpolateHtmlPlugin {
    static fromEnv: (env: Pick<Environment, 'mode' | 'config' | 'locations' | 'projectRoot'>, htmlWebpackPlugin: HtmlWebpackPlugin) => InterpolateHtmlPlugin;
}
