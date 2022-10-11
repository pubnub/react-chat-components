"use strict";
/* eslint-disable no-bitwise */
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.any_hmac_sha1 = exports.b64_hmac_sha1 = exports.hex_hmac_sha1 = exports.any_sha1 = exports.b64_sha1 = exports.hex_sha1 = void 0;
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
/* hex output format. 0 - lowercase; 1 - uppercase */
let hexcase = 0;
/* base-64 pad character. "=" for strict RFC compliance */
let b64pad = '';
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
const hex_sha1 = (s) => rstr2hex(rstr_sha1(str2rstr_utf8(s)));
exports.hex_sha1 = hex_sha1;
exports.default = exports.hex_sha1;
const b64_sha1 = (s) => rstr2b64(rstr_sha1(str2rstr_utf8(s)));
exports.b64_sha1 = b64_sha1;
const any_sha1 = (s, e) => rstr2any(rstr_sha1(str2rstr_utf8(s)), e);
exports.any_sha1 = any_sha1;
const hex_hmac_sha1 = (k, d) => rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
exports.hex_hmac_sha1 = hex_hmac_sha1;
const b64_hmac_sha1 = (k, d) => rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
exports.b64_hmac_sha1 = b64_hmac_sha1;
const any_hmac_sha1 = (k, d, e) => rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e);
exports.any_hmac_sha1 = any_hmac_sha1;
/*
 * Perform a simple self-test to see if the VM is working
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sha1_vm_test = () => exports.hex_sha1('abc').toLowerCase() === 'a9993e364706816aba3e25717850c26c9cd0d89d';
/*
 * Calculate the SHA1 of a raw string
 */
const rstr_sha1 = (s) => binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */
const rstr_hmac_sha1 = (key, data) => {
    let bkey = rstr2binb(key);
    if (bkey.length > 16) {
        bkey = binb_sha1(bkey, key.length * 8);
    }
    let ipad = Array(16);
    let opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5c5c5c5c;
    }
    var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
    return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
};
/*
 * Convert a raw string to a hex string
 */
const rstr2hex = (input) => {
    try {
        hexcase;
    }
    catch (e) {
        hexcase = 0;
    }
    var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
    var output = '';
    var x;
    for (var i = 0; i < input.length; i++) {
        x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0f) + hex_tab.charAt(x & 0x0f);
    }
    return output;
};
/*
 * Convert a raw string to a base-64 string
 */
const rstr2b64 = (input) => {
    try {
        b64pad;
    }
    catch (e) {
        b64pad = '';
    }
    var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var output = '';
    var len = input.length;
    for (var i = 0; i < len; i += 3) {
        var triplet = (input.charCodeAt(i) << 16) |
            (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) |
            (i + 2 < len ? input.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > input.length * 8) {
                output += b64pad;
            }
            else {
                output += tab.charAt((triplet >>> (6 * (3 - j))) & 0x3f);
            }
        }
    }
    return output;
};
/*
 * Convert a raw string to an arbitrary string encoding
 */
const rstr2any = (input, encoding) => {
    var divisor = encoding.length;
    var remainders = [];
    var i, q, x, quotient;
    /* Convert to an array of 16-bit big-endian values, forming the dividend */
    var dividend = Array(Math.ceil(input.length / 2));
    for (i = 0; i < dividend.length; i++) {
        dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
    }
    /*
     * Repeatedly perform a long division. The binary array forms the dividend,
     * the length of the encoding is the divisor. Once computed, the quotient
     * forms the dividend for the next step. We stop when the dividend is zero.
     * All remainders are stored for later use.
     */
    while (dividend.length > 0) {
        quotient = [];
        x = 0;
        for (i = 0; i < dividend.length; i++) {
            x = (x << 16) + dividend[i];
            q = Math.floor(x / divisor);
            x -= q * divisor;
            if (quotient.length > 0 || q > 0) {
                quotient[quotient.length] = q;
            }
        }
        remainders[remainders.length] = x;
        dividend = quotient;
    }
    /* Convert the remainders to the output string */
    var output = '';
    for (i = remainders.length - 1; i >= 0; i--) {
        output += encoding.charAt(remainders[i]);
    }
    /* Append leading zero equivalents */
    var full_length = Math.ceil((input.length * 8) / (Math.log(encoding.length) / Math.log(2)));
    for (i = output.length; i < full_length; i++) {
        output = encoding[0] + output;
    }
    return output;
};
/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
const str2rstr_utf8 = (input) => {
    var output = '';
    var i = -1;
    var x, y;
    while (++i < input.length) {
        /* Decode utf-16 surrogate pairs */
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (x >= 0xd800 && x <= 0xdbff && y >= 0xdc00 && y <= 0xdfff) {
            x = 0x10000 + ((x & 0x03ff) << 10) + (y & 0x03ff);
            i++;
        }
        /* Encode output as utf-8 */
        if (x <= 0x7f) {
            output += String.fromCharCode(x);
        }
        else if (x <= 0x7ff) {
            output += String.fromCharCode(0xc0 | ((x >>> 6) & 0x1f), 0x80 | (x & 0x3f));
        }
        else if (x <= 0xffff) {
            output += String.fromCharCode(0xe0 | ((x >>> 12) & 0x0f), 0x80 | ((x >>> 6) & 0x3f), 0x80 | (x & 0x3f));
        }
        else if (x <= 0x1fffff) {
            output += String.fromCharCode(0xf0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3f), 0x80 | ((x >>> 6) & 0x3f), 0x80 | (x & 0x3f));
        }
    }
    return output;
};
/*
 * Encode a string as utf-16
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const str2rstr_utf16le = (input) => {
    var output = '';
    for (var i = 0; i < input.length; i++) {
        output += String.fromCharCode(input.charCodeAt(i) & 0xff, (input.charCodeAt(i) >>> 8) & 0xff);
    }
    return output;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const str2rstr_utf16be = (input) => {
    var output = '';
    for (var i = 0; i < input.length; i++) {
        output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xff, input.charCodeAt(i) & 0xff);
    }
    return output;
};
/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
const rstr2binb = (input) => {
    var output = Array(input.length >> 2);
    for (var i = 0; i < output.length; i++) {
        output[i] = 0;
    }
    for (var i = 0; i < input.length * 8; i += 8) {
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (24 - (i % 32));
    }
    return output;
};
/*
 * Convert an array of big-endian words to a string
 */
const binb2rstr = (input) => {
    var output = '';
    for (var i = 0; i < input.length * 32; i += 8) {
        output += String.fromCharCode((input[i >> 5] >>> (24 - (i % 32))) & 0xff);
    }
    return output;
};
/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
const binb_sha1 = (x, len) => {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - (len % 32));
    x[(((len + 64) >> 9) << 4) + 15] = len;
    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for (var j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = x[i + j];
            }
            else {
                w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            let t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = bit_rol(b, 30);
            b = a;
            a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return [a, b, c, d, e];
};
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
const sha1_ft = (t, b, c, d) => {
    if (t < 20) {
        return (b & c) | (~b & d);
    }
    if (t < 40) {
        return b ^ c ^ d;
    }
    if (t < 60) {
        return (b & c) | (b & d) | (c & d);
    }
    return b ^ c ^ d;
};
/*
 * Determine the appropriate additive constant for the current iteration
 */
const sha1_kt = (t) => t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
const safe_add = (x, y) => {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
};
/*
 * Bitwise rotate a 32-bit number to the left.
 */
const bit_rol = (num, cnt) => {
    return (num << cnt) | (num >>> (32 - cnt));
};
//# sourceMappingURL=sha1.js.map