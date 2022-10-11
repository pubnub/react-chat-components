import "regenerator-runtime/runtime.js";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.map.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.object.assign.js";
import "core-js/modules/es.promise.js";
import { expect } from '@storybook/jest';
import { CallStates } from '@storybook/instrumenter';
import { userEvent, within } from '@storybook/testing-library';
import { getCall } from '../../mocks';
import { Interaction } from './Interaction';
import SubnavStories from '../Subnav/Subnav.stories';
export default {
  title: 'Addons/Interactions/Interaction',
  component: Interaction,
  args: {
    callsById: new Map(),
    controls: SubnavStories.args.controls,
    controlStates: SubnavStories.args.controlStates
  }
};
export var Active = {
  args: {
    call: getCall(CallStates.ACTIVE)
  }
};
export var Waiting = {
  args: {
    call: getCall(CallStates.WAITING)
  }
};
export var Failed = {
  args: {
    call: getCall(CallStates.ERROR)
  }
};
export var Done = {
  args: {
    call: getCall(CallStates.DONE)
  }
};
export var Disabled = {
  args: Object.assign({}, Done.args, {
    controlStates: Object.assign({}, SubnavStories.args.controlStates, {
      goto: false
    })
  })
};
export var Hovered = Object.assign({}, Done, {
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
              canvas = within(canvasElement);
              _context.next = 4;
              return userEvent.hover(canvas.getByRole('button'));

            case 4:
              _context.next = 6;
              return expect(canvas.getByTestId('icon-active')).not.toBeNull();

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