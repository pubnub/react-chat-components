/// <reference types="node" />
import path from "path";
/**
 * Ensures that the given path follows posix file names
 */
export declare function ensurePosix(p: string): string;
export declare function urlToFilename(url: string | URL): string;
/**
 * Returns an object from a path string - the opposite of format().
 */
export declare function parse(p: string): path.ParsedPath;
/**
 * Return the extension of the path, from the last '.' to
 * end of string in the last portion of the path. If there is no '.'
 * in the last portion of the path or the first character of it is '.',
 * then it returns an empty string
 */
export declare function extname(p: string): string;
/**
 * Determines whether {path} is an absolute path. An absolute path will always resolve to the same location,
 * regardless of the working directory.
 */
export declare function isAbsolute(p: string): boolean;
/**
 * Join all arguments together and normalize the resulting path.
 * Arguments must be strings. In v0.8, non-string arguments were silently
 * ignored. In v0.10 and up, an exception is thrown.
 */
export declare function join(...paths: string[]): string;
/**
 * Normalize a string path, reducing '..' and '.' parts.
 * When multiple slashes are found, they're replaced by a single one;
 * when the path contains a trailing slash, it is preserved
 */
export declare function normalize(p: string): string;
/**
 * Solve the relative path from {from} to {to}. At times we have two absolute paths,
 * and we need to derive the relative path from one to the other.
 * This is actually the reverse transform of path.resolve
 */
export declare function relative(from: string, to: string): string;
/**
 * The right-most parameter is considered {to}. Other parameters are considered an array of {from}.
 * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
 * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
 * until an absolute path is found. If after using all {from} paths still no absolute path is found,
 * the current working directory is used as well. The resulting path is normalized, and trailing
 * slashes are removed unless the path gets resolved to the root directory
 */
export declare function resolve(...pathSegments: string[]): string;
/**
 * Return the directory name of a path. Similar to the Unix dirname command.
 */
export declare function dirname(p: string): string;
/**
 * Return the last portion of a path. Similar to the Unix basename command.
 * Often used to extract the file name from a fully qualified path.
 */
export declare function basename(p: string, ext?: string): string;
/**
 * Returns a path string from an object - the opposite of parse().
 */
export declare function format(pP: path.FormatInputPathObject): string;
/**
 * The method is non-operational and always returns a POSIX-formatted path with no further modifications,
 * as that is how this function generally works for all POSIX-based systems
 */
export declare function toNamespacedPath(p: string): string;
/**
 * For some tooling, it is important that all absolute paths include the drive letter on Windows,
 * even though the drive letter is technically optional
 */
export declare function includeDriveLetter(p: string): string;
export declare const posix: path.PlatformPath;
export declare const win32: path.PlatformPath;
/**
 * The raw, unaltered path module
 */
export declare const native: path.PlatformPath;
declare const _default: {
    posix: path.PlatformPath;
    win32: path.PlatformPath;
    native: path.PlatformPath;
    includeDriveLetter: typeof includeDriveLetter;
    urlToFilename: typeof urlToFilename;
    normalize(p: string): string;
    join(...paths: string[]): string;
    resolve(...pathSegments: string[]): string;
    isAbsolute(p: string): boolean;
    relative(from: string, to: string): string;
    dirname(p: string): string;
    basename(p: string, ext?: string | undefined): string;
    extname(p: string): string;
    sep: string;
    delimiter: string;
    parse(p: string): path.ParsedPath;
    format(pP: path.FormatInputPathObject): string;
    toNamespacedPath(path: string): string;
};
export default _default;
