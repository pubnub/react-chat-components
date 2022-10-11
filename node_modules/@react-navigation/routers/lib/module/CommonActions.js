export function goBack() {
  return {
    type: 'GO_BACK'
  };
}
// eslint-disable-next-line no-redeclare
export function navigate() {
  if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string') {
    return {
      type: 'NAVIGATE',
      payload: {
        name: arguments.length <= 0 ? undefined : arguments[0],
        params: arguments.length <= 1 ? undefined : arguments[1]
      }
    };
  } else {
    const payload = (arguments.length <= 0 ? undefined : arguments[0]) || {};

    if (!payload.hasOwnProperty('key') && !payload.hasOwnProperty('name')) {
      throw new Error('You need to specify name or key when calling navigate with an object as the argument. See https://reactnavigation.org/docs/navigation-actions#navigate for usage.');
    }

    return {
      type: 'NAVIGATE',
      payload
    };
  }
}
export function reset(state) {
  return {
    type: 'RESET',
    payload: state
  };
}
export function setParams(params) {
  return {
    type: 'SET_PARAMS',
    payload: {
      params
    }
  };
}
//# sourceMappingURL=CommonActions.js.map