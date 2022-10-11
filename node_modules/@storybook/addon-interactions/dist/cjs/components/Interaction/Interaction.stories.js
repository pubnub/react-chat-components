"use strict";

require("core-js/modules/es.promise.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Waiting = exports.Hovered = exports.Failed = exports.Done = exports.Disabled = exports.Active = void 0;

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.map.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.object.assign.js");

var _jest = require("@storybook/jest");

var _instrumenter = require("@storybook/instrumenter");

var _testingLibrary = require("@storybook/testing-library");

var _mocks = require("../../mocks");

var _Interaction = require("./Interaction");

var _Subnav = _interopRequireDefault(require("../Subnav/Subnav.stories"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  title: 'Addons/Interactions/Interaction',
  component: _Interaction.Interaction,
  args: {
    callsById: new Map(),
    controls: _Subnav.default.args.controls,
    controlStates: _Subnav.default.args.controlStates
  }
};
exports.default = _default;
var Active = {
  args: {
    call: (0, _mocks.getCall)(_instrumenter.CallStates.ACTIVE)
  }
};
exports.Active = Active;
var Waiting = {
  args: {
    call: (0, _mocks.getCall)(_instrumenter.CallStates.WAITING)
  }
};
exports.Waiting = Waiting;
var Failed = {
  args: {
    call: (0, _mocks.getCall)(_instrumenter.CallStates.ERROR)
  }
};
exports.Failed = Failed;
var Done = {
  args: {
    call: (0, _mocks.getCall)(_instrumenter.CallStates.DONE)
  }
};
exports.Done = Done;
var Disabled = {
  args: Object.assign({}, Done.args, {
    controlStates: Object.assign({}, _Subnav.default.args.controlStates, {
      goto: false
    })
  })
};
exports.Disabled = Disabled;
var Hovered = Object.assign({}, Done, {
  parameters: {
    // Set light theme to avoid stacked theme in chromatic
    theme: 'light'
  },
  play: function () {
    var _play = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
      var canvasElement, canvas;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              canvasElement = _ref.canvasElement;
              canvas = (0, _testingLibrary.within)(canvasElement);
              _context.next = 4;
              return _testingLibrary.userEvent.hover(canvas.getByRole('button'));

            case 4:
              _context.next = 6;
              return (0, _jest.expect)(canvas.getByTestId('icon-active')).not.toBeNull();

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function play(_x) {
      return _play.apply(this, arguments);
    }

    return play;
  }()
});
exports.Hovered = Hovered;