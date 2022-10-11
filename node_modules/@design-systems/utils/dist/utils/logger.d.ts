declare type logFunction = (message?: any, ...optionalParams: any[]) => void;
/** Subset of console.log calls that are removed outside of development */
interface LoggerInterface {
    /**
     * The `console.debug()` function is an alias for {@link console.log()}.
     */
    debug: logFunction;
    /**
     * Prints to `stderr` with newline.
     */
    error: logFunction;
    /**
     * The {@link console.info()} function is an alias for {@link console.log()}.
     */
    info: logFunction;
    /**
     * Prints to `stdout` with newline.
     */
    log: logFunction;
    /**
     * The {@link console.warn()} function is an alias for {@link console.error()}.
     */
    warn: logFunction;
}
/**
 * Logger
 * A logging utility which maps to console in development but
 * is a no-op in production.
 */
export declare const logger: LoggerInterface;
export {};
//# sourceMappingURL=logger.d.ts.map