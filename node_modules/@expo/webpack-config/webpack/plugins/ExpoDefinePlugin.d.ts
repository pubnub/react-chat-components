import { ExpoConfig } from '@expo/config';
import { DefinePlugin as OriginalDefinePlugin } from 'webpack';
import { Environment, Mode } from '../types';
/**
 * @internal
 */
export interface ClientEnv {
    [key: string]: OriginalDefinePlugin.CodeValueObject;
}
/**
 * Create the global environment variables to surface in the project. Also creates the `__DEV__` boolean to provide better parity with Metro bundler.
 *
 * @param mode defines the Metro bundler `global.__DEV__` value.
 * @param publicPath passed as `process.env.PUBLIC_URL` to the app.
 * @param nativeAppManifest public values to be used in `expo-constants`.
 * @internal
 */
export declare function createClientEnvironment(mode: Mode, publicPath: string, nativeAppManifest: ExpoConfig): ClientEnv;
/**
 * Required for `expo-constants` https://docs.expo.dev/versions/latest/sdk/constants/.
 * This surfaces the `app.json` (config) as an environment variable which is then parsed by `expo-constants`.
 * @category plugins
 */
export default class DefinePlugin extends OriginalDefinePlugin {
    static createClientEnvironment: typeof createClientEnvironment;
    static fromEnv: (env: Pick<Environment, 'projectRoot' | 'mode' | 'config' | 'locations'>) => DefinePlugin;
    constructor({ mode, publicUrl, config }: {
        mode: Mode;
        publicUrl: string;
        config: ExpoConfig;
    });
}
