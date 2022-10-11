"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WithDebuggingDisabled = exports.Playing = exports.Paused = exports.Passing = exports.NoInteractions = exports.Failed = void 0;

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.map.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.object.assign.js");

var _react = _interopRequireDefault(require("react"));

var _addonActions = require("@storybook/addon-actions");

var _instrumenter = require("@storybook/instrumenter");

var _theming = require("@storybook/theming");

var _mocks = require("./mocks");

var _Panel = require("./Panel");

var _Subnav = _interopRequireDefault(require("./components/Subnav/Subnav.stories"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledWrapper = _theming.styled.div(function (_ref) {
  var theme = _ref.theme;
  return {
    backgroundColor: theme.background.content,
    color: theme.color.defaultText,
    display: 'block',
    height: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto'
  };
});

var _default = {
  title: 'Addons/Interactions/Panel',
  component: _Panel.AddonPanelPure,
  decorators: [function (Story) {
    return /*#__PURE__*/_react.default.createElement(StyledWrapper, {
      id: "panel-tab-content"
    }, /*#__PURE__*/_react.default.createElement(Story, null));
  }],
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    calls: new Map(),
    controls: _Subnav.default.args.controls,
    controlStates: _Subnav.default.args.controlStates,
    interactions: [(0, _mocks.getCall)(_instrumenter.CallStates.DONE)],
    fileName: 'addon-interactions.stories.tsx',
    hasException: false,
    isPlaying: false,
    onScrollToEnd: (0, _addonActions.action)('onScrollToEnd'),
    endRef: null,
    // prop for the AddonPanel used as wrapper of Panel
    active: true
  }
};
exports.default = _default;
var Passing = {
  args: {
    interactions: [(0, _mocks.getCall)(_instrumenter.CallStates.DONE)]
  }
};
exports.Passing = Passing;
var Paused = {
  args: {
    isPlaying: true,
    interactions: [(0, _mocks.getCall)(_instrumenter.CallStates.WAITING)],
    controlStates: {
      debugger: true,
      start: false,
      back: false,
      goto: true,
      next: true,
      end: true
    }
  }
};
exports.Paused = Paused;
var Playing = {
  args: {
    isPlaying: true,
    interactions: [(0, _mocks.getCall)(_instrumenter.CallStates.ACTIVE)]
  }
};
exports.Playing = Playing;
var Failed = {
  args: {
    hasException: true,
    interactions: [(0, _mocks.getCall)(_instrumenter.CallStates.ERROR)]
  }
};
exports.Failed = Failed;
var WithDebuggingDisabled = {
  args: {
    controlStates: Object.assign({}, _Subnav.default.args.controlStates, {
      debugger: false
    })
  }
};
exports.WithDebuggingDisabled = WithDebuggingDisabled;
var NoInteractions = {
  args: {
    interactions: []
  }
};
exports.NoInteractions = NoInteractions;