import "core-js/modules/es.object.assign.js";
import { CallStates } from '@storybook/instrumenter';
export var getCall = function getCall(status) {
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
  var overrides = CallStates.ERROR ? {
    exception: {
      name: 'Error',
      stack: '',
      message: "Things didn't work!"
    }
  } : {};
  return Object.assign({}, defaultData, overrides);
};