import OriginalHtmlWebpackPlugin from 'html-webpack-plugin';
import { Environment } from '../types';
/**
 * Generates an `index.html` file with the <script> injected.
 *
 * @category plugins
 */
export default class HtmlWebpackPlugin extends OriginalHtmlWebpackPlugin {
    private platform;
    constructor(env: Environment, templateHtmlData?: any);
    generatedScriptTags(jsAssets: any): any;
}
