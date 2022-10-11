"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.native = exports.win32 = exports.posix = exports.includeDriveLetter = exports.toNamespacedPath = exports.format = exports.basename = exports.dirname = exports.resolve = exports.relative = exports.normalize = exports.join = exports.isAbsolute = exports.extname = exports.parse = exports.urlToFilename = exports.ensurePosix = void 0;
/* eslint-disable prefer-rest-params,@typescript-eslint/no-unused-vars */
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const LEADING_SLASH_BEFORE_DRIVE_LETTER_REGEXP = /(^\/\w:\/)|(^\/\w:\\)/;
const DRIVE_LETTER_PREFIX = path_1.default.parse(process.cwd()).root;
const DRIVE_LETTER_REGEXP = /^\w:/;
const PLATFORM = os_1.default.platform();
/**
 * Returns true if the given path looks like a Windows path
 */
function looksLikeWindowsPath(p) {
    return /\\/.test(p) || DRIVE_LETTER_REGEXP.test(p);
}
/**
 * Ensures that the given path follows posix file names
 */
function ensurePosix(p) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(p);
    // eslint-disable-next-line no-control-regex
    const hasNonAscii = /[^\u0000-\u0080]+/.test(p);
    if (isExtendedLengthPath || hasNonAscii) {
        return p;
    }
    return p.replace(/\\/g, "/");
}
exports.ensurePosix = ensurePosix;
function urlToFilename(url) {
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
exports.urlToFilename = urlToFilename;
/**
 * Picks the most fitting path implementation based on the given argument
 */
function pickPathImplementation(args) {
    if ([...args].some(argument => typeof argument === "string" && looksLikeWindowsPath(argument))) {
        return path_1.default.win32;
    }
    return path_1.default;
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
    return path_1.default.posix[methodName](...[...args].map(arg => (typeof arg === "string" ? ensurePosix(arg) : arg)));
}
/**
 * Returns an object from a path string - the opposite of format().
 */
function parse(p) {
    return ensurePosixArgument("parse", arguments);
}
exports.parse = parse;
/**
 * Return the extension of the path, from the last '.' to
 * end of string in the last portion of the path. If there is no '.'
 * in the last portion of the path or the first character of it is '.',
 * then it returns an empty string
 */
function extname(p) {
    return ensurePosixArgument("extname", arguments);
}
exports.extname = extname;
/**
 * Determines whether {path} is an absolute path. An absolute path will always resolve to the same location,
 * regardless of the working directory.
 */
function isAbsolute(p) {
    return pickPathImplementation(arguments).isAbsolute(p);
}
exports.isAbsolute = isAbsolute;
/**
 * Join all arguments together and normalize the resulting path.
 * Arguments must be strings. In v0.8, non-string arguments were silently
 * ignored. In v0.10 and up, an exception is thrown.
 */
function join(...paths) {
    return ensurePosixReturnValue("join", arguments);
}
exports.join = join;
/**
 * Normalize a string path, reducing '..' and '.' parts.
 * When multiple slashes are found, they're replaced by a single one;
 * when the path contains a trailing slash, it is preserved
 */
function normalize(p) {
    const result = ensurePosixReturnValue("normalize", arguments);
    if (p.startsWith("./") && !result.startsWith("./")) {
        return "./" + result;
    }
    return result;
}
exports.normalize = normalize;
/**
 * Solve the relative path from {from} to {to}. At times we have two absolute paths,
 * and we need to derive the relative path from one to the other.
 * This is actually the reverse transform of path.resolve
 */
function relative(from, to) {
    return ensurePosixReturnValue("relative", arguments);
}
exports.relative = relative;
/**
 * The right-most parameter is considered {to}. Other parameters are considered an array of {from}.
 * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
 * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
 * until an absolute path is found. If after using all {from} paths still no absolute path is found,
 * the current working directory is used as well. The resulting path is normalized, and trailing
 * slashes are removed unless the path gets resolved to the root directory
 */
function resolve(...pathSegments) {
    return ensurePosixReturnValue("resolve", arguments);
}
exports.resolve = resolve;
/**
 * Return the directory name of a path. Similar to the Unix dirname command.
 */
function dirname(p) {
    return ensurePosixReturnValue("dirname", arguments);
}
exports.dirname = dirname;
/**
 * Return the last portion of a path. Similar to the Unix basename command.
 * Often used to extract the file name from a fully qualified path.
 */
function basename(p, ext) {
    return ensurePosixReturnValue("basename", arguments);
}
exports.basename = basename;
/**
 * Returns a path string from an object - the opposite of parse().
 */
function format(pP) {
    return ensurePosixReturnValue("format", arguments);
}
exports.format = format;
/**
 * The method is non-operational and always returns a POSIX-formatted path with no further modifications,
 * as that is how this function generally works for all POSIX-based systems
 */
function toNamespacedPath(p) {
    return ensurePosixReturnValue("toNamespacedPath", arguments);
}
exports.toNamespacedPath = toNamespacedPath;
/**
 * For some tooling, it is important that all absolute paths include the drive letter on Windows,
 * even though the drive letter is technically optional
 */
function includeDriveLetter(p) {
    if (PLATFORM !== "win32")
        return p;
    if (DRIVE_LETTER_REGEXP.test(p))
        return p;
    if (p.startsWith(DRIVE_LETTER_PREFIX))
        return p;
    if (!path_1.default.win32.isAbsolute(path_1.default.win32.normalize(p)))
        return p;
    return path_1.default.win32.join(DRIVE_LETTER_PREFIX, p);
}
exports.includeDriveLetter = includeDriveLetter;
exports.posix = {
    sep: path_1.default.posix.sep,
    delimiter: path_1.default.posix.delimiter,
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
        return exports.win32;
    }
};
exports.win32 = {
    ...path_1.default.win32,
    get posix() {
        return exports.posix;
    },
    get win32() {
        return this;
    }
};
/**
 * The raw, unaltered path module
 */
exports.native = path_1.default;
exports.default = {
    ...exports.posix,
    posix: exports.posix,
    win32: exports.win32,
    native: exports.native,
    includeDriveLetter,
    urlToFilename
};
//# sourceMappingURL=index.js.map