"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatusIcon = void 0;

var _react = _interopRequireDefault(require("react"));

var _components = require("@storybook/components");

var _instrumenter = require("@storybook/instrumenter");

var _theming = require("@storybook/theming");

var _polished = require("polished");

var _theme = _interopRequireDefault(require("../../theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var gray = _theme.default.colors.pure.gray;
var StyledStatusIcon = (0, _theming.styled)(_components.Icons)(function (_ref) {
  var _CallStates$DONE$Call;

  var theme = _ref.theme,
      status = _ref.status;
  var color = (_CallStates$DONE$Call = {}, _defineProperty(_CallStates$DONE$Call, _instrumenter.CallStates.DONE, theme.color.positive), _defineProperty(_CallStates$DONE$Call, _instrumenter.CallStates.ERROR, theme.color.negative), _defineProperty(_CallStates$DONE$Call, _instrumenter.CallStates.ACTIVE, theme.color.secondary), _defineProperty(_CallStates$DONE$Call, _instrumenter.CallStates.WAITING, (0, _polished.transparentize)(0.5, gray[500])), _CallStates$DONE$Call)[status];
  return {
    width: status === _instrumenter.CallStates.WAITING ? 6 : 12,
    height: status === _instrumenter.CallStates.WAITING ? 6 : 12,
    color: color,
    justifySelf: 'center'
  };
});

var StatusIcon = function StatusIcon(_ref2) {
  var _CallStates$DONE$Call2;

  var status = _ref2.status,
      className = _ref2.className;
  var icon = (_CallStates$DONE$Call2 = {}, _defineProperty(_CallStates$DONE$Call2, _instrumenter.CallStates.DONE, 'check'), _defineProperty(_CallStates$DONE$Call2, _instrumenter.CallStates.ERROR, 'stopalt'), _defineProperty(_CallStates$DONE$Call2, _instrumenter.CallStates.ACTIVE, 'play'), _defineProperty(_CallStates$DONE$Call2, _instrumenter.CallStates.WAITING, 'circle'), _CallStates$DONE$Call2)[status];
  return /*#__PURE__*/_react.default.createElement(StyledStatusIcon, {
    "data-testid": "icon-".concat(status),
    status: status,
    icon: icon,
    className: className
  });
};

exports.StatusIcon = StatusIcon;