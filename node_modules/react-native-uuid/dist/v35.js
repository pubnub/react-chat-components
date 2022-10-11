"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v35 = void 0;
/* eslint-disable no-bitwise */
const stringify_1 = require("./stringify");
const parse_1 = require("./parse");
const utils_1 = require("./utils");
const v35 = (name, version, hashfunc) => {
    const generateUUID = (value, namespace, buf, offset = 0) => {
        if (typeof value === 'string') {
            value = utils_1.stringToBytes(value);
        }
        if (typeof namespace === 'string') {
            namespace = parse_1.parse(namespace);
        }
        if (namespace && namespace.length !== 16) {
            throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
        }
        // Compute hash of namespace and value, Per 4.3
        // Future: Use spread syntax when supported on all platforms, e.g.
        // `bytes = hashfunc([...namespace, ... value])`
        let bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = utils_1.stringToBytes(hashfunc(utils_1.bytesToString(bytes)));
        bytes[6] = (bytes[6] & 0x0f) | version;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        if (buf) {
            for (let i = 0; i < 16; ++i) {
                buf[offset + i] = bytes[i];
            }
        }
        return buf ? buf : stringify_1.stringify(bytes);
    };
    return generateUUID;
};
exports.v35 = v35;
//# sourceMappingURL=v35.js.map