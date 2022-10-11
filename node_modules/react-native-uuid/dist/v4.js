"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v4 = void 0;
/* eslint-disable no-bitwise */
const unparse_1 = require("./unparse");
const rng_1 = require("./rng");
// **`v4()` - Generate random UUID**
// See https://github.com/broofa/node-uuid for API details
const v4 = (options, buf, offset) => {
    // Deprecated - 'format' argument, as supported in v1.2
    let i = (buf && offset) || 0;
    // buf = new Array<number>(16);
    let rnds = rng_1.rng();
    if (options && !(options instanceof String)) {
        if (options.random) {
            rnds = options.random;
        }
        if (options.rng) {
            rnds = options.rng();
        }
    }
    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    // Copy bytes to buffer, if provided
    if (buf) {
        for (var ii = 0; ii < 16; ii++) {
            buf[i + ii] = rnds[ii];
        }
    }
    return buf || unparse_1.unparse(rnds);
};
exports.v4 = v4;
//# sourceMappingURL=v4.js.map