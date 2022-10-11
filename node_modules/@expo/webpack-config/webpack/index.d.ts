/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
import { Arguments, DevConfiguration, InputEnvironment } from './types';
/**
 * Create the official Webpack config for loading Expo web apps.
 *
 * @param env Environment props used to configure features.
 * @param argv
 * @category default
 */
export default function createWebpackConfigAsync(env?: InputEnvironment, argv?: Arguments): Promise<Configuration | DevConfiguration>;
