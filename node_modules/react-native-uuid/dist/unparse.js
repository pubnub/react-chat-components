"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unparse = void 0;
const utils_1 = require("./utils");
// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
const unparse = (buf, offset) => {
    let i = offset || 0;
    let bth = utils_1.byteToHex;
    return (bth[buf[i++]] +
        bth[buf[i++]] +
        bth[buf[i++]] +
        bth[buf[i++]] +
        '-' +
        bth[buf[i++]] +
        bth[buf[i++]] +
        '-' +
        bth[buf[i++]] +
        bth[buf[i++]] +
        '-' +
        bth[buf[i++]] +
        bth[buf[i++]] +
        '-' +
        bth[buf[i++]] +
        bth[buf[i++]] +
        bth[buf[i++]] +
        bth[buf[i++]] +
        bth[buf[i++]] +
        bth[buf[i++]]);
};
exports.unparse = unparse;
//# sourceMappingURL=unparse.js.map