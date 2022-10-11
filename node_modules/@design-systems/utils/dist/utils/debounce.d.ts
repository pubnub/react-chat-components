declare type Args = any[];
declare type Base = (...args: Args) => void;
export declare const WINDOW_RESIZE_DELAY = 150;
/**
 * Only call a function once every 'wait" seconds.
 *
 * @param func - the callback to debounce
 * @param wait - how long to wait until to run the callback
 * @param immediate - run the callback immediately
 *
 * @example
 * const onClick = debounce(
 *   () => console.log('I was clicked'),
 *   1000
 * );
 */
export declare function debounce(func: Base, wait?: number, immediate?: boolean): Base;
export {};
//# sourceMappingURL=debounce.d.ts.map