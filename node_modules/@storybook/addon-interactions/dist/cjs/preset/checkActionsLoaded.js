"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkActionsLoaded = void 0;

require("core-js/modules/es.array.join.js");

var _coreCommon = require("@storybook/core-common");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkActionsLoaded = function checkActionsLoaded(configDir) {
  (0, _coreCommon.checkAddonOrder)({
    before: {
      name: '@storybook/addon-actions',
      inEssentials: true
    },
    after: {
      name: '@storybook/addon-interactions',
      inEssentials: false
    },
    configFile: _path.default.isAbsolute(configDir) ? _path.default.join(configDir, 'main') : _path.default.join(process.cwd(), configDir, 'main'),
    getConfig: function getConfig(configFile) {
      return (0, _coreCommon.serverRequire)(configFile);
    }
  });
};

exports.checkActionsLoaded = checkActionsLoaded;