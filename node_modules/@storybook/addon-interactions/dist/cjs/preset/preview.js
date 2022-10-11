"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.regexp.exec.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.argsEnhancers = void 0;

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.object.entries.js");

require("core-js/modules/es.function.name.js");

var _addons = require("@storybook/addons");

var _coreEvents = require("@storybook/core-events");

var _instrumenter = require("@storybook/instrumenter");

var _jestMock = require("jest-mock");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var JestMock = new _jestMock.ModuleMocker(global);
var fn = JestMock.fn.bind(JestMock); // Aliasing `fn` to `action` here, so we get a more descriptive label in the UI.

var _instrument = (0, _instrumenter.instrument)({
  action: fn
}, {
  retain: true
}),
    action = _instrument.action;

var channel = _addons.addons.getChannel();

var spies = [];
channel.on(_coreEvents.FORCE_REMOUNT, function () {
  return spies.forEach(function (mock) {
    var _mock$mockClear;

    return mock === null || mock === void 0 ? void 0 : (_mock$mockClear = mock.mockClear) === null || _mock$mockClear === void 0 ? void 0 : _mock$mockClear.call(mock);
  });
});
channel.on(_coreEvents.STORY_RENDER_PHASE_CHANGED, function (_ref) {
  var newPhase = _ref.newPhase;
  if (newPhase === 'loading') spies.forEach(function (mock) {
    var _mock$mockClear2;

    return mock === null || mock === void 0 ? void 0 : (_mock$mockClear2 = mock.mockClear) === null || _mock$mockClear2 === void 0 ? void 0 : _mock$mockClear2.call(mock);
  });
});

var addActionsFromArgTypes = function addActionsFromArgTypes(_ref2) {
  var id = _ref2.id,
      initialArgs = _ref2.initialArgs;
  return Object.entries(initialArgs).reduce(function (acc, _ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        val = _ref4[1];

    if (typeof val === 'function' && val.name === 'actionHandler') {
      Object.defineProperty(val, 'name', {
        value: key,
        writable: false
      });
      Object.defineProperty(val, '__storyId__', {
        value: id,
        writable: false
      });
      acc[key] = action(val);
      spies.push(acc[key]);
      return acc;
    }

    acc[key] = val;
    return acc;
  }, {});
};

var argsEnhancers = [addActionsFromArgTypes];
exports.argsEnhancers = argsEnhancers;