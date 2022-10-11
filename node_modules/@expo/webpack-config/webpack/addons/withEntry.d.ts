import { AnyConfiguration, InputEnvironment } from '../types';
/**
 * Inject a new entry path into an existing Webpack config.
 *
 * @param webpackConfig Existing Webpack config to modify.
 * @param env Environment props used to get the Expo config.
 * @param options new entry path to inject.
 * @category addons
 */
export default function withEntry(webpackConfig: AnyConfiguration, env: Pick<InputEnvironment, "projectRoot" | "config" | "locations"> | undefined, options: {
    entryPath: string;
    strict?: boolean;
}): AnyConfiguration;
