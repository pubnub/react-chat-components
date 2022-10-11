"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesToString = exports.stringToBytes = exports.NIL = exports.X500 = exports.OID = exports.URL = exports.DNS = exports.hexToByte = exports.byteToHex = void 0;
let _byteToHex = [];
let _hexToByte = {};
for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
}
exports.byteToHex = _byteToHex;
exports.hexToByte = _hexToByte;
exports.DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';
exports.X500 = '6ba7b814-9dad-11d1-80b4-00c04fd430c8';
exports.NIL = '00000000-0000-0000-0000-000000000000';
const stringToBytes = (str) => {
    str = unescape(encodeURIComponent(str)); // UTF8 escape
    const bytes = new Uint8Array(str.length);
    for (let j = 0; j < str.length; ++j) {
        bytes[j] = str.charCodeAt(j);
    }
    return bytes;
};
exports.stringToBytes = stringToBytes;
const bytesToString = (buf) => {
    const bufferView = new Uint8Array(buf, 0, buf.byteLength);
    return String.fromCharCode.apply(null, Array.from(bufferView));
};
exports.bytesToString = bytesToString;
//# sourceMappingURL=utils.js.map