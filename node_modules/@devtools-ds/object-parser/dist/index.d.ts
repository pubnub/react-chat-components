export interface AST {
    /** Current object key */
    key: string;
    /** Current depth */
    depth: number;
    /** The parent node of the current one */
    parent: AST | undefined;
}
interface ASTChildren {
    /** Children */
    children: DeferredNode[];
    /** Whether it's an Object prototype */
    isPrototype?: true;
}
/** A type to describe objects with all deferred children loaded */
interface ASTResolvedChildren {
    /** Children */
    children: ASTNode[];
    /** Whether it's an Object prototype */
    isPrototype?: true;
}
export declare type DeferredNode = () => Promise<ASTNode>;
export interface ASTObject extends AST, ASTChildren {
    /** Type */
    type: "object";
    /** Value */
    value: object;
}
export interface ResolvedASTObject extends AST, ASTResolvedChildren {
    /** Type */
    type: "object";
    /** Value */
    value: object;
}
export interface ASTArray extends AST, ASTChildren {
    /** Type */
    type: "array";
    /** Value */
    value: any[];
}
export interface ResolvedASTArray extends AST, ASTResolvedChildren {
    /** Type */
    type: "array";
    /** Value */
    value: any[];
}
export interface ASTFunction extends AST, ASTChildren {
    /** Type */
    type: "function";
    /** Value */
    value: Function;
}
export interface ResolvedASTFunction extends AST, ASTResolvedChildren {
    /** Type */
    type: "function";
    /** Value */
    value: Function;
}
export declare type PromiseState = "pending" | "fulfilled" | "rejected";
export interface ASTPromise extends AST, ASTChildren {
    /** Type */
    type: "promise";
    /** Value */
    value: Promise<any>;
}
export interface ResolvedASTPromise extends AST, ASTResolvedChildren {
    /** Type */
    type: "promise";
    /** Value */
    value: Promise<any>;
}
export interface ASTMap extends AST, ASTChildren {
    /** Type */
    type: "map";
    /** Value */
    value: Map<any, any>;
}
export interface ResolvedASTMap extends AST, ASTResolvedChildren {
    /** Type */
    type: "map";
    /** Value */
    value: Map<any, any>;
}
export interface ASTSet extends AST, ASTChildren {
    /** Type */
    type: "set";
    /** Value */
    value: Set<any>;
}
export interface ResolvedASTSet extends AST, ASTResolvedChildren {
    /** Type */
    type: "set";
    /** Value */
    value: Set<any>;
}
export interface ASTValue extends AST {
    /** Type */
    type: "value";
    /** Value */
    value: boolean | null | number | BigInt | string | symbol | undefined | Date | RegExp | Error | WeakMap<any, any> | WeakSet<any> | Promise<any>;
    /** It's not a prototype */
    isPrototype?: false;
}
export declare type SupportedTypes = boolean | null | number | string | Error | symbol | undefined | Date | RegExp | object | Map<any, any> | WeakMap<any, any> | Set<any> | WeakSet<any> | Promise<any> | any[] | Function;
export declare type ObjectTypes = "object" | "function" | "array" | "promise" | "map" | "set";
export declare type ASTNode = ASTObject | ASTArray | ASTFunction | ASTPromise | ASTMap | ASTSet | ASTValue;
export declare type ResolvedASTNode = ResolvedASTObject | ResolvedASTArray | ResolvedASTFunction | ResolvedASTPromise | ResolvedASTMap | ResolvedASTSet;
/**
 * Determine if a given value is a true javascript object.
 * Ignore Objects that we know how to display as values.
 *
 * @param val - The current object
 */
export declare const isObject: (val: object) => boolean;
/** Check for objects we know how to enumerate */
export declare const isKnownObject: (val: object) => boolean;
/**
 * Get the current state of a promise, and return a result if fulfilled
 *
 * @param promise - A promise to inspect
 */
export declare const getPromiseState: (promise: Promise<any>) => Promise<["pending"] | ["rejected", any] | ["fulfilled", any]>;
/**
 * Parse an object in to an AST.
 *
 * @param data - Object to parse.
 */
export declare const parse: (data: SupportedTypes, sortKeys?: boolean | undefined, includePrototypes?: boolean | undefined) => Promise<ASTNode>;
export default parse;
//# sourceMappingURL=index.d.ts.map