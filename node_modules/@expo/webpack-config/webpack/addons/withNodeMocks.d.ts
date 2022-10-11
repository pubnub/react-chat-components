import { AnyConfiguration } from '../types';
/**
 * Some libraries import Node modules but don't use them in the browser.
 * Tell Webpack to provide empty mocks for them so importing them works.
 *
 * @param webpackConfig Existing Webpack config to modify.
 * @category addons
 */
export default function withNodeMocks(webpackConfig: AnyConfiguration): AnyConfiguration;
