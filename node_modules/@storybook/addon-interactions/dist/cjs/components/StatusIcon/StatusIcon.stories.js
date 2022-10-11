"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Pending = exports.Error = exports.Done = void 0;

var _instrumenter = require("@storybook/instrumenter");

var _StatusIcon = require("./StatusIcon");

var _default = {
  title: 'Addons/Interactions/StatusIcon',
  component: _StatusIcon.StatusIcon
};
exports.default = _default;
var Pending = {
  args: {
    status: _instrumenter.CallStates.WAITING
  }
};
exports.Pending = Pending;
var Error = {
  args: {
    status: _instrumenter.CallStates.ERROR
  }
};
exports.Error = Error;
var Done = {
  args: {
    status: _instrumenter.CallStates.DONE
  }
};
exports.Done = Done;