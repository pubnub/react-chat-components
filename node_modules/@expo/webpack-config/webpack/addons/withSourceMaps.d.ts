import { AnyConfiguration, InputEnvironment } from '../types';
/**
 * Because webpack doesn't support `.bundle` extensions (why should they).
 * We need to extract the default settings for source maps and create a native source map plugin.
 * This does nothing if the env.platform is not ios or android.
 *
 * @param webpackConfig
 * @param env
 */
export default function withPlatformSourceMaps(webpackConfig: AnyConfiguration, env?: Pick<InputEnvironment, 'platform' | 'mode'>): AnyConfiguration;
