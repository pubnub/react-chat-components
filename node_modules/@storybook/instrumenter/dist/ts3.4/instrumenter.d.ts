import { Channel } from '@storybook/addons';
import { StoryId } from '@storybook/addons';
import { Call, State, Options, LogItem } from './types';
export declare const EVENTS: {
    CALL: string;
    SYNC: string;
    START: string;
    BACK: string;
    GOTO: string;
    NEXT: string;
    END: string;
};
declare type PatchedObj<TObj> = {
    [Property in keyof TObj]: TObj[Property] & {
        __originalFn__: PatchedObj<TObj>;
    };
};
/**
 * This class is not supposed to be used directly. Use the `instrument` function below instead.
 */
export declare class Instrumenter {
    channel: Channel;
    initialized: boolean;
    state: Record<StoryId, State>;
    constructor();
    getState(storyId: StoryId): State;
    setState(storyId: StoryId, update: Partial<State> | ((state: State) => Partial<State>)): void;
    cleanup(): void;
    getLog(storyId: string): LogItem[];
    instrument<TObj extends {
        [x: string]: any;
    }>(obj: TObj, options: Options): PatchedObj<TObj>;
    track(method: string, fn: Function, args: any[], options: Options): PatchedObj<any>;
    intercept(fn: Function, call: Call, options: Options): any;
    invoke(fn: Function, call: Call, options: Options): any;
    update(call: Call): void;
    sync(storyId: StoryId): void;
}
/**
 * Instruments an object or module by traversing its properties, patching any functions (methods)
 * to enable debugging. Patched functions will emit a `call` event when invoked.
 * When intercept = true, patched functions will return a Promise when the debugger stops before
 * this function. As such, "interceptable" functions will have to be `await`-ed.
 */
export declare function instrument<TObj extends Record<string, any>>(obj: TObj, options?: Options): TObj;
export {};
