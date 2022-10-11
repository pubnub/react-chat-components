/* eslint-disable prefer-rest-params,@typescript-eslint/no-unused-vars */
import path from "path";
import os from "os";
const LEADING_SLASH_BEFORE_DRIVE_LETTER_REGEXP = /(^\/\w:\/)|(^\/\w:\\)/;
const DRIVE_LETTER_PREFIX = path.parse(process.cwd()).root;
const DRIVE_LETTER_REGEXP = /^\w:/;
const PLATFORM = os.platform();
/**
 * Returns true if the given path looks like a Windows path
 */
function looksLikeWindowsPath(p) {
    return /\\/.test(p) || DRIVE_LETTER_REGEXP.test(p);
}
/**
 * Ensures that the given path follows posix file names
 */
export function ensurePosix(p) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(p);
    // eslint-disable-next-line no-control-regex
    const hasNonAscii = /[^\u0000-\u0080]+/.test(p);
    if (isExtendedLengthPath || hasNonAscii) {
        return p;
    }
    return p.replace(/\\/g, "/");
}
export function urlToFilename(url) {
    let urlString = typeof url === "string" ? url : url.pathname;
    // If the URL doesn't start with the file protocol, return it as-is
    if (!urlString.startsWith("file:")) {
        return normalize(urlString);
    }
    if (urlString.startsWith(`file://`)) {
        urlString = urlString.slice(`file://`.length);
    }
    // On Windows, it might be malformated and look like /C:\Users\...
    if (LEADING_SLASH_BEFORE_DRIVE_LETTER_REGEXP.test(urlString)) {
        urlString = urlString.slice(1);
    }
    return normalize(urlString);
}
/**
 * Picks the most fitting path implementation based on the given argument
 */
function pickPathImplementation(args) {
    if ([...args].some(argument => typeof argument === "string" && looksLikeWindowsPath(argument))) {
        return path.win32;
    }
    return path;
}
/**
 * Wraps the return value in ensurePosix
 */
function ensurePosixReturnValue(methodName, args) {
    return ensurePosix(pickPathImplementation(args)[methodName](...args));
}
/**
 * Wraps all string arguments in ensurePosix
 */
function ensurePosixArgument(methodName, args) {
    return path.posix[methodName](...[...args].map(arg => (typeof arg === "string" ? ensurePosix(arg) : arg)));
}
/**
 * Returns an object from a path string - the opposite of format().
 */
export function parse(p) {
    return ensurePosixArgument("parse", arguments);
}
/**
 * Return the extension of the path, from the last '.' to
 * end of string in the last portion of the path. If there is no '.'
 * in the last portion of the path or the first character of it is '.',
 * then it returns an empty string
 */
export function extname(p) {
    return ensurePosixArgument("extname", arguments);
}
/**
 * Determines whether {path} is an absolute path. An absolute path will always resolve to the same location,
 * regardless of the working directory.
 */
export function isAbsolute(p) {
    return pickPathImplementation(arguments).isAbsolute(p);
}
/**
 * Join all arguments together and normalize the resulting path.
 * Arguments must be strings. In v0.8, non-string arguments were silently
 * ignored. In v0.10 and up, an exception is thrown.
 */
export function join(...paths) {
    return ensurePosixReturnValue("join", arguments);
}
/**
 * Normalize a string path, reducing '..' and '.' parts.
 * When multiple slashes are found, they're replaced by a single one;
 * when the path contains a trailing slash, it is preserved
 */
export function normalize(p) {
    const result = ensurePosixReturnValue("normalize", arguments);
    if (p.startsWith("./") && !result.startsWith("./")) {
        return "./" + result;
    }
    return result;
}
/**
 * Solve the relative path from {from} to {to}. At times we have two absolute paths,
 * and we need to derive the relative path from one to the other.
 * This is actually the reverse transform of path.resolve
 */
export function relative(from, to) {
    return ensurePosixReturnValue("relative", arguments);
}
/**
 * The right-most parameter is considered {to}. Other parameters are considered an array of {from}.
 * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
 * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
 * until an absolute path is found. If after using all {from} paths still no absolute path is found,
 * the current working directory is used as well. The resulting path is normalized, and trailing
 * slashes are removed unless the path gets resolved to the root directory
 */
export function resolve(...pathSegments) {
    return ensurePosixReturnValue("resolve", arguments);
}
/**
 * Return the directory name of a path. Similar to the Unix dirname command.
 */
export function dirname(p) {
    return ensurePosixReturnValue("dirname", arguments);
}
/**
 * Return the last portion of a path. Similar to the Unix basename command.
 * Often used to extract the file name from a fully qualified path.
 */
export function basename(p, ext) {
    return ensurePosixReturnValue("basename", arguments);
}
/**
 * Returns a path string from an object - the opposite of parse().
 */
export function format(pP) {
    return ensurePosixReturnValue("format", arguments);
}
/**
 * The method is non-operational and always returns a POSIX-formatted path with no further modifications,
 * as that is how this function generally works for all POSIX-based systems
 */
export function toNamespacedPath(p) {
    return ensurePosixReturnValue("toNamespacedPath", arguments);
}
/**
 * For some tooling, it is important that all absolute paths include the drive letter on Windows,
 * even though the drive letter is technically optional
 */
export function includeDriveLetter(p) {
    if (PLATFORM !== "win32")
        return p;
    if (DRIVE_LETTER_REGEXP.test(p))
        return p;
    if (p.startsWith(DRIVE_LETTER_PREFIX))
        return p;
    if (!path.win32.isAbsolute(path.win32.normalize(p)))
        return p;
    return path.win32.join(DRIVE_LETTER_PREFIX, p);
}
export const posix = {
    sep: path.posix.sep,
    delimiter: path.posix.delimiter,
    parse,
    isAbsolute,
    join,
    extname,
    normalize,
    relative,
    resolve,
    dirname,
    basename,
    format,
    toNamespacedPath,
    get posix() {
        return this;
    },
    get win32() {
        return win32;
    }
};
export const win32 = {
    ...path.win32,
    get posix() {
        return posix;
    },
    get win32() {
        return this;
    }
};
/**
 * The raw, unaltered path module
 */
export const native = path;
export default {
    ...posix,
    posix,
    win32,
    native,
    includeDriveLetter,
    urlToFilename
};
//# sourceMappingURL=index.js.map