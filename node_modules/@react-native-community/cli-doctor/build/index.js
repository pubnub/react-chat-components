"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "installPods", {
  enumerable: true,
  get: function () {
    return _installPods.default;
  }
});
exports.commands = void 0;

var _doctor = _interopRequireDefault(require("./commands/doctor"));

var _info = _interopRequireDefault(require("./commands/info"));

var _installPods = _interopRequireDefault(require("./tools/installPods"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const commands = {
  info: _info.default,
  doctor: _doctor.default
};
/**
 * @todo
 * We should not rely on this file from other packages, e.g. CLI. We probably need to
 * refactor the init in order to remove that connection.
 */

exports.commands = commands;

//# sourceMappingURL=index.js.map