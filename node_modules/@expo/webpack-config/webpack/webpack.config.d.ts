/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
import { Arguments, DevConfiguration, Environment } from './types';
export default function (env: Environment, argv?: Arguments): Promise<Configuration | DevConfiguration>;
