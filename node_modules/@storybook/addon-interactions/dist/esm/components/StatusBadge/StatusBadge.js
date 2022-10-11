import "core-js/modules/es.string.bold.js";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import { CallStates } from '@storybook/instrumenter';
import { styled, typography } from '@storybook/theming';
var StyledBadge = styled.div(function (_ref) {
  var _CallStates$DONE$Call;

  var theme = _ref.theme,
      status = _ref.status;
  var backgroundColor = (_CallStates$DONE$Call = {}, _defineProperty(_CallStates$DONE$Call, CallStates.DONE, theme.color.positive), _defineProperty(_CallStates$DONE$Call, CallStates.ERROR, theme.color.negative), _defineProperty(_CallStates$DONE$Call, CallStates.ACTIVE, theme.color.warning), _defineProperty(_CallStates$DONE$Call, CallStates.WAITING, theme.color.warning), _CallStates$DONE$Call)[status];
  return {
    padding: '4px 6px 4px 8px;',
    borderRadius: '4px',
    backgroundColor: backgroundColor,
    color: 'white',
    fontFamily: typography.fonts.base,
    textTransform: 'uppercase',
    fontSize: typography.size.s1,
    letterSpacing: 3,
    fontWeight: typography.weight.bold,
    width: 65,
    textAlign: 'center'
  };
});
export var StatusBadge = function StatusBadge(_ref2) {
  var _CallStates$DONE$Call2;

  var status = _ref2.status;
  var badgeText = (_CallStates$DONE$Call2 = {}, _defineProperty(_CallStates$DONE$Call2, CallStates.DONE, 'Pass'), _defineProperty(_CallStates$DONE$Call2, CallStates.ERROR, 'Fail'), _defineProperty(_CallStates$DONE$Call2, CallStates.ACTIVE, 'Runs'), _defineProperty(_CallStates$DONE$Call2, CallStates.WAITING, 'Runs'), _CallStates$DONE$Call2)[status];
  return /*#__PURE__*/React.createElement(StyledBadge, {
    status: status
  }, badgeText);
};