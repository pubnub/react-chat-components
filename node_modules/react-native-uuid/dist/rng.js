"use strict";
/* eslint-disable no-bitwise */
// const randombytes = require('randombytes');
// export const rng = () => randombytes(16);
Object.defineProperty(exports, "__esModule", { value: true });
exports.rng = void 0;
const min = 0;
const max = 256;
const RANDOM_LENGTH = 16;
// returns pseudo random 16 bytes
const rng = () => {
    let result = new Array(RANDOM_LENGTH);
    for (let j = 0; j < RANDOM_LENGTH; j++) {
        result[j] = 0xff & (Math.random() * (max - min) + min);
    }
    return result;
};
exports.rng = rng;
//# sourceMappingURL=rng.js.map