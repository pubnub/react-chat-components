import "core-js/modules/es.object.keys.js";
import "core-js/modules/es.symbol.js";
import "core-js/modules/es.symbol.description.js";
import "core-js/modules/es.symbol.iterator.js";
import "core-js/modules/es.function.name.js";
import "core-js/modules/es.array.from.js";
var _excluded = ["calls", "controls", "controlStates", "interactions", "fileName", "hasException", "isPlaying", "onScrollToEnd", "endRef", "isRerunAnimating", "setIsRerunAnimating"],
    _excluded2 = ["status"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import "core-js/modules/es.array.map.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.map.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.object.assign.js";
import "core-js/modules/es.array.slice.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.split.js";
import "core-js/modules/es.regexp.to-string.js";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import global from 'global';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { useChannel, useParameter } from '@storybook/api';
import { STORY_RENDER_PHASE_CHANGED, FORCE_REMOUNT } from '@storybook/core-events';
import { AddonPanel, Link, Placeholder } from '@storybook/components';
import { EVENTS, CallStates } from '@storybook/instrumenter';
import { styled } from '@storybook/theming';
import { StatusIcon } from './components/StatusIcon/StatusIcon';
import { Subnav } from './components/Subnav/Subnav';
import { Interaction } from './components/Interaction/Interaction';
var INITIAL_CONTROL_STATES = {
  debugger: false,
  start: false,
  back: false,
  goto: false,
  next: false,
  end: false
};
var TabIcon = styled(StatusIcon)({
  marginLeft: 5
});

var TabStatus = function TabStatus(_ref) {
  var children = _ref.children;
  var container = global.document.getElementById('tabbutton-interactions');
  return container && /*#__PURE__*/ReactDOM.createPortal(children, container);
};

export var AddonPanelPure = /*#__PURE__*/React.memo(function (_ref2) {
  var calls = _ref2.calls,
      controls = _ref2.controls,
      controlStates = _ref2.controlStates,
      interactions = _ref2.interactions,
      fileName = _ref2.fileName,
      hasException = _ref2.hasException,
      isPlaying = _ref2.isPlaying,
      onScrollToEnd = _ref2.onScrollToEnd,
      endRef = _ref2.endRef,
      isRerunAnimating = _ref2.isRerunAnimating,
      setIsRerunAnimating = _ref2.setIsRerunAnimating,
      panelProps = _objectWithoutProperties(_ref2, _excluded);

  return /*#__PURE__*/React.createElement(AddonPanel, panelProps, controlStates.debugger && interactions.length > 0 && /*#__PURE__*/React.createElement(Subnav, {
    controls: controls,
    controlStates: controlStates,
    status: // eslint-disable-next-line no-nested-ternary
    isPlaying ? CallStates.ACTIVE : hasException ? CallStates.ERROR : CallStates.DONE,
    storyFileName: fileName,
    onScrollToEnd: onScrollToEnd,
    isRerunAnimating: isRerunAnimating,
    setIsRerunAnimating: setIsRerunAnimating
  }), interactions.map(function (call) {
    return /*#__PURE__*/React.createElement(Interaction, {
      key: call.id,
      call: call,
      callsById: calls,
      controls: controls,
      controlStates: controlStates
    });
  }), /*#__PURE__*/React.createElement("div", {
    ref: endRef
  }), !isPlaying && interactions.length === 0 && /*#__PURE__*/React.createElement(Placeholder, null, "No interactions found", /*#__PURE__*/React.createElement(Link, {
    href: "https://github.com/storybookjs/storybook/blob/next/addons/interactions/README.md",
    target: "_blank",
    withArrow: true
  }, "Learn how to add interactions to your story")));
});
export var Panel = function Panel(props) {
  var _useChannel;

  var _React$useState = React.useState(),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      storyId = _React$useState2[0],
      setStoryId = _React$useState2[1];

  var _React$useState3 = React.useState(INITIAL_CONTROL_STATES),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      controlStates = _React$useState4[0],
      setControlStates = _React$useState4[1];

  var _React$useState5 = React.useState(false),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      isPlaying = _React$useState6[0],
      setPlaying = _React$useState6[1];

  var _React$useState7 = React.useState(false),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      isRerunAnimating = _React$useState8[0],
      setIsRerunAnimating = _React$useState8[1];

  var _React$useState9 = React.useState(),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      scrollTarget = _React$useState10[0],
      setScrollTarget = _React$useState10[1]; // Calls are tracked in a ref so we don't needlessly rerender.


  var calls = React.useRef(new Map());

  var setCall = function setCall(_ref3) {
    var status = _ref3.status,
        call = _objectWithoutProperties(_ref3, _excluded2);

    return calls.current.set(call.id, call);
  };

  var _React$useState11 = React.useState([]),
      _React$useState12 = _slicedToArray(_React$useState11, 2),
      log = _React$useState12[0],
      setLog = _React$useState12[1];

  var interactions = log.map(function (_ref4) {
    var callId = _ref4.callId,
        status = _ref4.status;
    return Object.assign({}, calls.current.get(callId), {
      status: status
    });
  });
  var endRef = React.useRef();
  React.useEffect(function () {
    var observer;

    if (global.window.IntersectionObserver) {
      observer = new global.window.IntersectionObserver(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 1),
            end = _ref6[0];

        return setScrollTarget(end.isIntersecting ? undefined : end.target);
      }, {
        root: global.window.document.querySelector('#panel-tab-content')
      });
      if (endRef.current) observer.observe(endRef.current);
    }

    return function () {
      var _observer;

      return (_observer = observer) === null || _observer === void 0 ? void 0 : _observer.disconnect();
    };
  }, []);
  var emit = useChannel((_useChannel = {}, _defineProperty(_useChannel, EVENTS.CALL, setCall), _defineProperty(_useChannel, EVENTS.SYNC, function (payload) {
    setControlStates(payload.controlStates);
    setLog(payload.logItems);
  }), _defineProperty(_useChannel, STORY_RENDER_PHASE_CHANGED, function (event) {
    setStoryId(event.storyId);
    setPlaying(event.newPhase === 'playing');
  }), _useChannel), []);
  var controls = React.useMemo(function () {
    return {
      start: function start() {
        return emit(EVENTS.START, {
          storyId: storyId
        });
      },
      back: function back() {
        return emit(EVENTS.BACK, {
          storyId: storyId
        });
      },
      goto: function goto(callId) {
        return emit(EVENTS.GOTO, {
          storyId: storyId,
          callId: callId
        });
      },
      next: function next() {
        return emit(EVENTS.NEXT, {
          storyId: storyId
        });
      },
      end: function end() {
        return emit(EVENTS.END, {
          storyId: storyId
        });
      },
      rerun: function rerun() {
        setIsRerunAnimating(true);
        emit(FORCE_REMOUNT, {
          storyId: storyId
        });
      }
    };
  }, [storyId]);
  var storyFilePath = useParameter('fileName', '');

  var _storyFilePath$toStri = storyFilePath.toString().split('/').slice(-1),
      _storyFilePath$toStri2 = _slicedToArray(_storyFilePath$toStri, 1),
      fileName = _storyFilePath$toStri2[0];

  var scrollToTarget = function scrollToTarget() {
    return scrollTarget === null || scrollTarget === void 0 ? void 0 : scrollTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  };

  var showStatus = log.length > 0 && !isPlaying;
  var hasException = log.some(function (item) {
    return item.status === CallStates.ERROR;
  });
  return /*#__PURE__*/React.createElement(React.Fragment, {
    key: "interactions"
  }, /*#__PURE__*/React.createElement(TabStatus, null, showStatus && (hasException ? /*#__PURE__*/React.createElement(TabIcon, {
    status: CallStates.ERROR
  }) : " (".concat(interactions.length, ")"))), /*#__PURE__*/React.createElement(AddonPanelPure, _extends({
    calls: calls.current,
    controls: controls,
    controlStates: controlStates,
    interactions: interactions,
    fileName: fileName,
    hasException: hasException,
    isPlaying: isPlaying,
    endRef: endRef,
    onScrollToEnd: scrollTarget && scrollToTarget,
    isRerunAnimating: isRerunAnimating,
    setIsRerunAnimating: setIsRerunAnimating
  }, props)));
};