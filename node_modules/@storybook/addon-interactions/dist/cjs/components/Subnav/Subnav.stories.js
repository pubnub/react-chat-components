"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Runs = exports.Pass = exports.Midway = exports.Locked = exports.Fail = exports.AtStart = void 0;

var _addonActions = require("@storybook/addon-actions");

var _instrumenter = require("@storybook/instrumenter");

var _Subnav = require("./Subnav");

var _default = {
  title: 'Addons/Interactions/Subnav',
  component: _Subnav.Subnav,
  args: {
    controls: {
      start: (0, _addonActions.action)('start'),
      back: (0, _addonActions.action)('back'),
      goto: (0, _addonActions.action)('goto'),
      next: (0, _addonActions.action)('next'),
      end: (0, _addonActions.action)('end')
    },
    controlStates: {
      debugger: true,
      start: true,
      back: true,
      goto: true,
      next: false,
      end: false
    },
    storyFileName: 'Subnav.stories.tsx',
    hasNext: true,
    hasPrevious: true
  }
};
exports.default = _default;
var Pass = {
  args: {
    status: _instrumenter.CallStates.DONE
  }
};
exports.Pass = Pass;
var Fail = {
  args: {
    status: _instrumenter.CallStates.ERROR
  }
};
exports.Fail = Fail;
var Runs = {
  args: {
    status: _instrumenter.CallStates.WAITING
  }
};
exports.Runs = Runs;
var AtStart = {
  args: {
    status: _instrumenter.CallStates.WAITING,
    controlStates: {
      debugger: true,
      start: false,
      back: false,
      goto: true,
      next: true,
      end: true
    }
  }
};
exports.AtStart = AtStart;
var Midway = {
  args: {
    status: _instrumenter.CallStates.WAITING,
    controlStates: {
      debugger: true,
      start: true,
      back: true,
      goto: true,
      next: true,
      end: true
    }
  }
};
exports.Midway = Midway;
var Locked = {
  args: {
    status: _instrumenter.CallStates.ACTIVE,
    controlStates: {
      debugger: true,
      start: false,
      back: false,
      goto: false,
      next: false,
      end: false
    }
  }
};
exports.Locked = Locked;