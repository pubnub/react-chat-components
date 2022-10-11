"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const nodeWorkspaces_1 = require("./nodeWorkspaces");
function shouldUseYarn() {
    var _a;
    if ((_a = process.env.npm_config_user_agent) === null || _a === void 0 ? void 0 : _a.startsWith('yarn')) {
        return true;
    }
    if ((0, nodeWorkspaces_1.isUsingNpm)(process.cwd())) {
        return false;
    }
    try {
        (0, child_process_1.execSync)('yarnpkg --version', { stdio: 'ignore' });
        return true;
    }
    catch {
        return false;
    }
}
exports.default = shouldUseYarn;
//# sourceMappingURL=shouldUseYarn.js.map