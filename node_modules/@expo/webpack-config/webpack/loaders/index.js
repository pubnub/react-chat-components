"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFontLoader = exports.createBabelLoader = exports.createAllLoaders = exports.getHtmlLoaderRule = exports.getBabelLoaderRule = exports.styleLoaderRule = exports.fallbackLoaderRule = exports.imageLoaderRule = void 0;
var createAllLoaders_1 = require("./createAllLoaders");
Object.defineProperty(exports, "imageLoaderRule", { enumerable: true, get: function () { return createAllLoaders_1.imageLoaderRule; } });
Object.defineProperty(exports, "fallbackLoaderRule", { enumerable: true, get: function () { return createAllLoaders_1.fallbackLoaderRule; } });
Object.defineProperty(exports, "styleLoaderRule", { enumerable: true, get: function () { return createAllLoaders_1.styleLoaderRule; } });
Object.defineProperty(exports, "getBabelLoaderRule", { enumerable: true, get: function () { return createAllLoaders_1.getBabelLoaderRule; } });
Object.defineProperty(exports, "getHtmlLoaderRule", { enumerable: true, get: function () { return createAllLoaders_1.getHtmlLoaderRule; } });
Object.defineProperty(exports, "createAllLoaders", { enumerable: true, get: function () { return __importDefault(createAllLoaders_1).default; } });
var createBabelLoader_1 = require("./createBabelLoader");
Object.defineProperty(exports, "createBabelLoader", { enumerable: true, get: function () { return __importDefault(createBabelLoader_1).default; } });
__exportStar(require("./createBabelLoader"), exports);
var createFontLoader_1 = require("./createFontLoader");
Object.defineProperty(exports, "createFontLoader", { enumerable: true, get: function () { return __importDefault(createFontLoader_1).default; } });
//# sourceMappingURL=index.js.map