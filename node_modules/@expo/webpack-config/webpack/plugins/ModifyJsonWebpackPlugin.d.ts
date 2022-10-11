import { compilation as compilationNS, Compiler } from 'webpack';
import { BeforeEmitOptions } from './JsonWebpackPlugin';
export declare type Options = {
    path: string;
    json: any;
    pretty?: boolean;
};
export default class ModifyJsonWebpackPlugin {
    modifyAsync(compiler: Compiler, compilation: compilationNS.Compilation, data: BeforeEmitOptions): Promise<BeforeEmitOptions>;
    apply(compiler: Compiler): void;
}
