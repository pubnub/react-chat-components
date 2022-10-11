function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import "core-js/modules/es.array.includes.js";
import "core-js/modules/es.object.assign.js";
import "core-js/modules/es.string.starts-with.js";
import "core-js/modules/es.symbol.js";
import "core-js/modules/es.symbol.description.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.symbol.iterator.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.array.slice.js";
import "core-js/modules/es.function.name.js";
import "core-js/modules/es.array.from.js";
import "core-js/modules/es.regexp.exec.js";
import * as React from 'react';
import { CallStates } from '@storybook/instrumenter';
import { styled, typography } from '@storybook/theming';
import { transparentize } from 'polished';
import { MatcherResult } from '../MatcherResult';
import { MethodCall } from '../MethodCall';
import { StatusIcon } from '../StatusIcon/StatusIcon';
var MethodCallWrapper = styled.div(function () {
  return {
    fontFamily: typography.fonts.mono,
    fontSize: typography.size.s1,
    overflowWrap: 'break-word',
    inlineSize: 'calc( 100% - 40px )'
  };
});
var RowContainer = styled('div', {
  shouldForwardProp: function shouldForwardProp(prop) {
    return !['call'].includes(prop);
  }
})(function (_ref) {
  var theme = _ref.theme,
      call = _ref.call;
  return Object.assign({
    display: 'flex',
    flexDirection: 'column',
    borderBottom: "1px solid ".concat(theme.appBorderColor),
    fontFamily: typography.fonts.base,
    fontSize: 13
  }, call.status === CallStates.ERROR && {
    backgroundColor: theme.base === 'dark' ? transparentize(0.93, theme.color.negative) : theme.background.warning
  });
});
var RowLabel = styled('button', {
  shouldForwardProp: function shouldForwardProp(prop) {
    return !['call'].includes(prop);
  }
})(function (_ref2) {
  var theme = _ref2.theme,
      disabled = _ref2.disabled,
      call = _ref2.call;
  return {
    display: 'grid',
    background: 'none',
    border: 0,
    gridTemplateColumns: '15px 1fr',
    alignItems: 'center',
    minHeight: 40,
    margin: 0,
    padding: '8px 15px',
    textAlign: 'start',
    cursor: disabled || call.status === CallStates.ERROR ? 'default' : 'pointer',
    '&:hover': disabled ? {} : {
      background: theme.background.hoverable
    },
    '&:focus-visible': {
      outline: 0,
      boxShadow: "inset 3px 0 0 0 ".concat(call.status === CallStates.ERROR ? theme.color.warning : theme.color.secondary),
      background: call.status === CallStates.ERROR ? 'transparent' : theme.background.hoverable
    },
    '& > div': {
      opacity: call.status === CallStates.WAITING ? 0.5 : 1
    }
  };
});
var RowMessage = styled('pre')({
  margin: 0,
  padding: '8px 10px 8px 30px',
  fontSize: typography.size.s1
});
export var Interaction = function Interaction(_ref3) {
  var call = _ref3.call,
      callsById = _ref3.callsById,
      controls = _ref3.controls,
      controlStates = _ref3.controlStates;

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isHovered = _React$useState2[0],
      setIsHovered = _React$useState2[1];

  return /*#__PURE__*/React.createElement(RowContainer, {
    call: call
  }, /*#__PURE__*/React.createElement(RowLabel, {
    call: call,
    onClick: function onClick() {
      return controls.goto(call.id);
    },
    disabled: !controlStates.goto,
    onMouseEnter: function onMouseEnter() {
      return controlStates.goto && setIsHovered(true);
    },
    onMouseLeave: function onMouseLeave() {
      return controlStates.goto && setIsHovered(false);
    }
  }, /*#__PURE__*/React.createElement(StatusIcon, {
    status: isHovered ? CallStates.ACTIVE : call.status
  }), /*#__PURE__*/React.createElement(MethodCallWrapper, {
    style: {
      marginLeft: 6,
      marginBottom: 1
    }
  }, /*#__PURE__*/React.createElement(MethodCall, {
    call: call,
    callsById: callsById
  }))), call.status === CallStates.ERROR && call.exception && (call.exception.message.startsWith('expect(') ? /*#__PURE__*/React.createElement(MatcherResult, call.exception) : /*#__PURE__*/React.createElement(RowMessage, null, call.exception.message)));
};