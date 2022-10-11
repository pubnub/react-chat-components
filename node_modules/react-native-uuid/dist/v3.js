"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v3 = void 0;
const v35_1 = require("./v35");
const md5_1 = __importDefault(require("./md5"));
exports.v3 = v35_1.v35('v3', 0x30, md5_1.default);
//# sourceMappingURL=v3.js.map