import { CallStates } from '@storybook/instrumenter';
export const getCall = status => {
  const defaultData = {
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
    status
  };
  const overrides = CallStates.ERROR ? {
    exception: {
      name: 'Error',
      stack: '',
      message: "Things didn't work!"
    }
  } : {};
  return Object.assign({}, defaultData, overrides);
};