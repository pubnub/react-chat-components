"use strict";

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.object.freeze.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ExpectedReceived = exports.ExpectedNumberOfCalls = exports.Expected = exports.Diff = void 0;

var _react = _interopRequireDefault(require("react"));

var _tsDedent = _interopRequireDefault(require("ts-dedent"));

var _theming = require("@storybook/theming");

var _MatcherResult = require("./MatcherResult");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var StyledWrapper = _theming.styled.div(function (_ref) {
  var theme = _ref.theme;
  return {
    backgroundColor: theme.background.content,
    padding: '12px 0',
    boxShadow: "0 0 0 1px ".concat(theme.appBorderColor),
    color: theme.color.defaultText,
    fontSize: 13
  };
});

var _default = {
  title: 'Addons/Interactions/MatcherResult',
  component: _MatcherResult.MatcherResult,
  decorators: [function (Story) {
    return /*#__PURE__*/_react.default.createElement(StyledWrapper, null, /*#__PURE__*/_react.default.createElement(Story, null));
  }],
  parameters: {
    layout: 'fullscreen'
  }
};
exports.default = _default;
var Expected = {
  args: {
    message: (0, _tsDedent.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      expect(jest.fn()).lastCalledWith(...expected)\n\n      Expected: {\"email\": \"michael@chromatic.com\", \"password\": \"testpasswordthatwontfail\"}\n\n      Number of calls: 0\n    "])))
  }
};
exports.Expected = Expected;
var ExpectedReceived = {
  args: {
    message: (0, _tsDedent.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n      expect(jest.fn()).toHaveBeenCalledWith(...expected)\n\n      Expected: called with 0 arguments\n      Received: {\"email\": \"michael@chromatic.com\", \"password\": \"testpasswordthatwontfail\"}\n\n      Number of calls: 1\n    "])))
  }
};
exports.ExpectedReceived = ExpectedReceived;
var ExpectedNumberOfCalls = {
  args: {
    message: (0, _tsDedent.default)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n      expect(jest.fn()).toHaveBeenCalledTimes(expected)\n\n      Expected number of calls: 1\n      Received number of calls: 0\n    "])))
  }
};
exports.ExpectedNumberOfCalls = ExpectedNumberOfCalls;
var Diff = {
  args: {
    message: (0, _tsDedent.default)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n      expect(jest.fn()).toHaveBeenCalledWith(...expected)\n\n      - Expected\n      + Received\n\n        Object {\n      -   \"email\": \"michael@chromatic.com\",\n      +   \"email\": \"michael@chromaui.com\",\n          \"password\": \"testpasswordthatwontfail\",\n        },\n\n      Number of calls: 1\n    "])))
  }
};
exports.Diff = Diff;