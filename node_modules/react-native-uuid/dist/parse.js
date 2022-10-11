"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const utils_1 = require("./utils");
// **`parse()` - Parse a UUID into it's component bytes**
const parse = (s, buf, offset) => {
    let i = (buf && offset) || 0;
    let ii = 0;
    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, (oct) => {
        // Don't overflow!
        if (ii < 16 && buf) {
            buf[i + ii++] = utils_1.hexToByte[oct];
        }
        return '';
    });
    // Zero out remaining bytes if string was short
    while (ii < 16) {
        buf[i + ii++] = 0;
    }
    return buf;
};
exports.parse = parse;
//# sourceMappingURL=parse.js.map