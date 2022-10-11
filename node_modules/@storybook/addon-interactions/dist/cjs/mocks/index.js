"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCall = void 0;

require("core-js/modules/es.object.assign.js");

var _instrumenter = require("@storybook/instrumenter");

var getCall = function getCall(status) {
  var defaultData = {
    id: 'addons-interactions-accountform--standard-email-filled [3] change',
    cursor: 0,
    path: ['fireEvent'],
    method: 'change',
    storyId: 'addons-interactions-accountform--standard-email-filled',
    args: [{
      __callId__: 'addons-interactions-accountform--standard-email-filled [2] getByTestId',
      retain: false
    }, {
      target: {
        value: 'michael@chromatic.com'
      }
    }],
    interceptable: true,
    retain: false,
    status: status
  };
  var overrides = _instrumenter.CallStates.ERROR ? {
    exception: {
      name: 'Error',
      stack: '',
      message: "Things didn't work!"
    }
  } : {};
  return Object.assign({}, defaultData, overrides);
};

exports.getCall = getCall;