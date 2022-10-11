"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Waiting = exports.Pass = exports.Fail = exports.Active = void 0;

var _instrumenter = require("@storybook/instrumenter");

var _StatusBadge = require("./StatusBadge");

var _default = {
  title: 'Addons/Interactions/StatusBadge',
  component: _StatusBadge.StatusBadge,
  parameters: {
    layout: 'padded'
  }
};
exports.default = _default;
var Pass = {
  args: {
    status: _instrumenter.CallStates.DONE
  }
};
exports.Pass = Pass;
var Active = {
  args: {
    status: _instrumenter.CallStates.ACTIVE
  }
};
exports.Active = Active;
var Waiting = {
  args: {
    status: _instrumenter.CallStates.WAITING
  }
};
exports.Waiting = Waiting;
var Fail = {
  args: {
    status: _instrumenter.CallStates.ERROR
  }
};
exports.Fail = Fail;