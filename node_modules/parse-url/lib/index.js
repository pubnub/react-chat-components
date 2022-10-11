"use strict";

// Dependencies

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var parsePath = require("parse-path"),
    normalizeUrl = require("normalize-url");

/**
 * parseUrl
 * Parses the input url.
 *
 * **Note**: This *throws* if invalid urls are provided.
 *
 * @name parseUrl
 * @function
 * @param {String} url The input url.
 * @param {Boolean|Object} normalize Whether to normalize the url or not.
 *                         Default is `false`. If `true`, the url will
 *                         be normalized. If an object, it will be the
 *                         options object sent to [`normalize-url`](https://github.com/sindresorhus/normalize-url).
 *
 *                         For SSH urls, normalize won't work.
 *
 * @return {Object} An object containing the following fields:
 *
 *    - `protocols` (Array): An array with the url protocols (usually it has one element).
 *    - `protocol` (String): The first protocol, `"ssh"` (if the url is a ssh url) or `"file"`.
 *    - `port` (null|Number): The domain port.
 *    - `resource` (String): The url domain (including subdomains).
 *    - `user` (String): The authentication user (usually for ssh urls).
 *    - `pathname` (String): The url pathname.
 *    - `hash` (String): The url hash.
 *    - `search` (String): The url querystring value.
 *    - `href` (String): The input url.
 *    - `query` (Object): The url querystring, parsed as object.
 */
var parseUrl = function parseUrl(url) {
    var normalize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


    // Constants
    var GIT_RE = /((git@|http(s)?:\/\/)([\w\.@]+)(\/|:))(([\~,\w,\-,\_,\/]+)(.git){0,1}((\/){0,1}))/;

    if (typeof url !== "string" || !url.trim()) {
        var err = new Error("Invalid url.");
        err.subject_url = url;
        throw err;
    }

    if (normalize) {
        if ((typeof normalize === "undefined" ? "undefined" : _typeof(normalize)) !== "object") {
            normalize = {
                stripHash: false
            };
        }
        url = normalizeUrl(url, normalize);
    }

    var parsed = parsePath(url);

    // Potential git-ssh urls
    if (parsed.protocol === "file") {
        var matched = parsed.href.match(GIT_RE);
        if (matched) {
            parsed.protocols = ["ssh"];
            parsed.protocol = "ssh";
            parsed.resource = matched[4];
            parsed.user = "git";
            parsed.pathname = "/" + matched[6];
        }
    }

    return parsed;
};

module.exports = parseUrl;