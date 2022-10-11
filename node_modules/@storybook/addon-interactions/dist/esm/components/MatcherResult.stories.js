import "core-js/modules/es.array.slice.js";
import "core-js/modules/es.object.freeze.js";

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import dedent from 'ts-dedent';
import { styled } from '@storybook/theming';
import { MatcherResult } from './MatcherResult';
var StyledWrapper = styled.div(function (_ref) {
  var theme = _ref.theme;
  return {
    backgroundColor: theme.background.content,
    padding: '12px 0',
    boxShadow: "0 0 0 1px ".concat(theme.appBorderColor),
    color: theme.color.defaultText,
    fontSize: 13
  };
});
export default {
  title: 'Addons/Interactions/MatcherResult',
  component: MatcherResult,
  decorators: [function (Story) {
    return /*#__PURE__*/React.createElement(StyledWrapper, null, /*#__PURE__*/React.createElement(Story, null));
  }],
  parameters: {
    layout: 'fullscreen'
  }
};
export var Expected = {
  args: {
    message: dedent(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      expect(jest.fn()).lastCalledWith(...expected)\n\n      Expected: {\"email\": \"michael@chromatic.com\", \"password\": \"testpasswordthatwontfail\"}\n\n      Number of calls: 0\n    "])))
  }
};
export var ExpectedReceived = {
  args: {
    message: dedent(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n      expect(jest.fn()).toHaveBeenCalledWith(...expected)\n\n      Expected: called with 0 arguments\n      Received: {\"email\": \"michael@chromatic.com\", \"password\": \"testpasswordthatwontfail\"}\n\n      Number of calls: 1\n    "])))
  }
};
export var ExpectedNumberOfCalls = {
  args: {
    message: dedent(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n      expect(jest.fn()).toHaveBeenCalledTimes(expected)\n\n      Expected number of calls: 1\n      Received number of calls: 0\n    "])))
  }
};
export var Diff = {
  args: {
    message: dedent(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n      expect(jest.fn()).toHaveBeenCalledWith(...expected)\n\n      - Expected\n      + Received\n\n        Object {\n      -   \"email\": \"michael@chromatic.com\",\n      +   \"email\": \"michael@chromaui.com\",\n          \"password\": \"testpasswordthatwontfail\",\n        },\n\n      Number of calls: 1\n    "])))
  }
};