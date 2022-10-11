import React from 'react';
import dedent from 'ts-dedent';
import { styled } from '@storybook/theming';
import { MatcherResult } from './MatcherResult';
const StyledWrapper = styled.div(({
  theme
}) => ({
  backgroundColor: theme.background.content,
  padding: '12px 0',
  boxShadow: `0 0 0 1px ${theme.appBorderColor}`,
  color: theme.color.defaultText,
  fontSize: 13
}));
export default {
  title: 'Addons/Interactions/MatcherResult',
  component: MatcherResult,
  decorators: [Story => /*#__PURE__*/React.createElement(StyledWrapper, null, /*#__PURE__*/React.createElement(Story, null))],
  parameters: {
    layout: 'fullscreen'
  }
};
export const Expected = {
  args: {
    message: dedent`
      expect(jest.fn()).lastCalledWith(...expected)

      Expected: {"email": "michael@chromatic.com", "password": "testpasswordthatwontfail"}

      Number of calls: 0
    `
  }
};
export const ExpectedReceived = {
  args: {
    message: dedent`
      expect(jest.fn()).toHaveBeenCalledWith(...expected)

      Expected: called with 0 arguments
      Received: {"email": "michael@chromatic.com", "password": "testpasswordthatwontfail"}

      Number of calls: 1
    `
  }
};
export const ExpectedNumberOfCalls = {
  args: {
    message: dedent`
      expect(jest.fn()).toHaveBeenCalledTimes(expected)

      Expected number of calls: 1
      Received number of calls: 0
    `
  }
};
export const Diff = {
  args: {
    message: dedent`
      expect(jest.fn()).toHaveBeenCalledWith(...expected)

      - Expected
      + Received

        Object {
      -   "email": "michael@chromatic.com",
      +   "email": "michael@chromaui.com",
          "password": "testpasswordthatwontfail",
        },

      Number of calls: 1
    `
  }
};