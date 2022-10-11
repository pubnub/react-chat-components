"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isImportSpecifierArray = exports.isProgram = exports.isImportDeclaration = void 0;
function isImportDeclaration(node) {
    return node.type === "ImportDeclaration";
}
exports.isImportDeclaration = isImportDeclaration;
function isProgram(node) {
    return node.type === "Program";
}
exports.isProgram = isProgram;
function isImportSpecifierArray(items) {
    return items.every((item) => item.type === "ImportSpecifier");
}
exports.isImportSpecifierArray = isImportSpecifierArray;
//# sourceMappingURL=guards.js.map