"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.importMetroFromProject = importMetroFromProject;
exports.importExpoMetroConfigFromProject = importExpoMetroConfigFromProject;
exports.importMetroResolverFromProject = importMetroResolverFromProject;
exports.importCliSaveAssetsFromProject = importCliSaveAssetsFromProject;
var _resolveFrom = _interopRequireDefault(require("resolve-from"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// These resolvers enable us to test the CLI in older projects.
// We may be able to get rid of this in the future.
// TODO: Maybe combine with AsyncResolver?
class MetroImportError extends Error {
    constructor(projectRoot, moduleId){
        super(`Missing package "${moduleId}" in the project at: ${projectRoot}\n` + 'This usually means "react-native" is not installed. ' + 'Please verify that dependencies in package.json include "react-native" ' + "and run `yarn` or `npm install`.");
    }
}
function resolveFromProject(projectRoot, moduleId) {
    const resolvedPath = _resolveFrom.default.silent(projectRoot, moduleId);
    if (!resolvedPath) {
        throw new MetroImportError(projectRoot, moduleId);
    }
    return resolvedPath;
}
function importFromProject(projectRoot, moduleId) {
    return require(resolveFromProject(projectRoot, moduleId));
}
function importMetroFromProject(projectRoot) {
    return importFromProject(projectRoot, "metro");
}
function importExpoMetroConfigFromProject(projectRoot) {
    return importFromProject(projectRoot, "@expo/metro-config");
}
function importMetroResolverFromProject(projectRoot) {
    return importFromProject(projectRoot, "metro-resolver");
}
function importCliSaveAssetsFromProject(projectRoot) {
    return importFromProject(projectRoot, "@react-native-community/cli-plugin-metro/build/commands/bundle/saveAssets").default;
}

//# sourceMappingURL=resolveFromProject.js.map