import { Rule } from 'webpack';
import { Environment } from '../types';
/**
 * This is needed for webpack to import static images in JavaScript files.
 * "url" loader works like "file" loader except that it embeds assets
 * smaller than specified limit in bytes as data URLs to avoid requests.
 * A missing `test` is equivalent to a match.
 *
 * @category loaders
 */
export declare const imageLoaderRule: Rule;
/**
 * "file" loader makes sure those assets get served by WebpackDevServer.
 * When you `import` an asset, you get its (virtual) filename.
 * In production, they would get copied to the `build` folder.
 * This loader doesn't use a "test" so it will catch all modules
 * that fall through the other loaders.
 *
 * @category loaders
 */
export declare const fallbackLoaderRule: Rule;
/**
 * Default CSS loader.
 *
 * @category loaders
 */
export declare const styleLoaderRule: Rule;
/**
 * Create the fallback loader for parsing any unhandled file type.
 *
 * @param env
 * @category loaders
 */
export default function createAllLoaders(env: Pick<Environment, 'projectRoot' | 'locations' | 'mode' | 'config' | 'platform' | 'babel'>): Rule[];
/**
 * Creates a Rule for loading application code and packages that work with the Expo ecosystem.
 * This method attempts to emulate how Metro loads ES modules in the `node_modules` folder.
 *
 * @param env partial Environment object.
 * @category loaders
 */
export declare function getBabelLoaderRule(env: Pick<Environment, 'projectRoot' | 'config' | 'locations' | 'mode' | 'platform' | 'babel'>): Rule;
/**
 *
 * @param exclude
 * @category loaders
 */
export declare function getHtmlLoaderRule(exclude: string): Rule;
