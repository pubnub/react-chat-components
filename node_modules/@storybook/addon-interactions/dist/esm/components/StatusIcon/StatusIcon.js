function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import { Icons } from '@storybook/components';
import { CallStates } from '@storybook/instrumenter';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
import localTheme from '../../theme';
var gray = localTheme.colors.pure.gray;
var StyledStatusIcon = styled(Icons)(function (_ref) {
  var _CallStates$DONE$Call;

  var theme = _ref.theme,
      status = _ref.status;
  var color = (_CallStates$DONE$Call = {}, _defineProperty(_CallStates$DONE$Call, CallStates.DONE, theme.color.positive), _defineProperty(_CallStates$DONE$Call, CallStates.ERROR, theme.color.negative), _defineProperty(_CallStates$DONE$Call, CallStates.ACTIVE, theme.color.secondary), _defineProperty(_CallStates$DONE$Call, CallStates.WAITING, transparentize(0.5, gray[500])), _CallStates$DONE$Call)[status];
  return {
    width: status === CallStates.WAITING ? 6 : 12,
    height: status === CallStates.WAITING ? 6 : 12,
    color: color,
    justifySelf: 'center'
  };
});
export var StatusIcon = function StatusIcon(_ref2) {
  var _CallStates$DONE$Call2;

  var status = _ref2.status,
      className = _ref2.className;
  var icon = (_CallStates$DONE$Call2 = {}, _defineProperty(_CallStates$DONE$Call2, CallStates.DONE, 'check'), _defineProperty(_CallStates$DONE$Call2, CallStates.ERROR, 'stopalt'), _defineProperty(_CallStates$DONE$Call2, CallStates.ACTIVE, 'play'), _defineProperty(_CallStates$DONE$Call2, CallStates.WAITING, 'circle'), _CallStates$DONE$Call2)[status];
  return /*#__PURE__*/React.createElement(StyledStatusIcon, {
    "data-testid": "icon-".concat(status),
    status: status,
    icon: icon,
    className: className
  });
};