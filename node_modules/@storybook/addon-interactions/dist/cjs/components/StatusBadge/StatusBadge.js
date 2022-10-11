"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatusBadge = void 0;

require("core-js/modules/es.string.bold.js");

var _react = _interopRequireDefault(require("react"));

var _instrumenter = require("@storybook/instrumenter");

var _theming = require("@storybook/theming");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var StyledBadge = _theming.styled.div(function (_ref) {
  var _CallStates$DONE$Call;

  var theme = _ref.theme,
      status = _ref.status;
  var backgroundColor = (_CallStates$DONE$Call = {}, _defineProperty(_CallStates$DONE$Call, _instrumenter.CallStates.DONE, theme.color.positive), _defineProperty(_CallStates$DONE$Call, _instrumenter.CallStates.ERROR, theme.color.negative), _defineProperty(_CallStates$DONE$Call, _instrumenter.CallStates.ACTIVE, theme.color.warning), _defineProperty(_CallStates$DONE$Call, _instrumenter.CallStates.WAITING, theme.color.warning), _CallStates$DONE$Call)[status];
  return {
    padding: '4px 6px 4px 8px;',
    borderRadius: '4px',
    backgroundColor: backgroundColor,
    color: 'white',
    fontFamily: _theming.typography.fonts.base,
    textTransform: 'uppercase',
    fontSize: _theming.typography.size.s1,
    letterSpacing: 3,
    fontWeight: _theming.typography.weight.bold,
    width: 65,
    textAlign: 'center'
  };
});

var StatusBadge = function StatusBadge(_ref2) {
  var _CallStates$DONE$Call2;

  var status = _ref2.status;
  var badgeText = (_CallStates$DONE$Call2 = {}, _defineProperty(_CallStates$DONE$Call2, _instrumenter.CallStates.DONE, 'Pass'), _defineProperty(_CallStates$DONE$Call2, _instrumenter.CallStates.ERROR, 'Fail'), _defineProperty(_CallStates$DONE$Call2, _instrumenter.CallStates.ACTIVE, 'Runs'), _defineProperty(_CallStates$DONE$Call2, _instrumenter.CallStates.WAITING, 'Runs'), _CallStates$DONE$Call2)[status];
  return /*#__PURE__*/_react.default.createElement(StyledBadge, {
    status: status
  }, badgeText);
};

exports.StatusBadge = StatusBadge;