import { AsyncSeriesWaterfallHook } from 'tapable';
import { compilation, Compiler } from 'webpack';
export declare type Options = {
    path: string;
    json: any;
    pretty?: boolean;
};
export declare type BeforeEmitOptions = Options & {
    plugin: JsonWebpackPlugin;
};
export default class JsonWebpackPlugin {
    options: Options;
    static getHooks(compilation: compilation.Compilation): Record<string, AsyncSeriesWaterfallHook>;
    constructor(options: Options);
    apply(compiler: Compiler): void;
    private writeObject;
}
