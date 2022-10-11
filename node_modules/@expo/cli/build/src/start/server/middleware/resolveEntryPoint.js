"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resolveEntryPoint = resolveEntryPoint;
var _paths = require("@expo/config/paths");
var _chalk = _interopRequireDefault(require("chalk"));
var _path = _interopRequireDefault(require("path"));
var _errors = require("../../../utils/errors");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const supportedPlatforms = [
    "ios",
    "android",
    "web"
];
function resolveEntryPoint(projectRoot, platform, projectConfig) {
    if (platform && !supportedPlatforms.includes(platform)) {
        throw new _errors.CommandError(`Failed to resolve the project's entry file: The platform "${platform}" is not supported.`);
    }
    // TODO(Bacon): support platform extension resolution like .ios, .native
    // const platforms = [platform, 'native'].filter(Boolean) as string[];
    const platforms = [];
    const entry = (0, _paths).getEntryPoint(projectRoot, [
        "./index"
    ], platforms, projectConfig);
    if (!entry) {
        // NOTE(Bacon): I purposefully don't mention all possible resolutions here since the package.json is the most standard and users should opt towards that.
        throw new _errors.CommandError(_chalk.default`The project entry file could not be resolved. Please define it in the {bold package.json} "main" field.`);
    }
    return _path.default.relative(projectRoot, entry);
}

//# sourceMappingURL=resolveEntryPoint.js.map