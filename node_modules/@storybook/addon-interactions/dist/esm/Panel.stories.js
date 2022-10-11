import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.map.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.object.assign.js";
import React from 'react';
import { action } from '@storybook/addon-actions';
import { CallStates } from '@storybook/instrumenter';
import { styled } from '@storybook/theming';
import { getCall } from './mocks';
import { AddonPanelPure } from './Panel';
import SubnavStories from './components/Subnav/Subnav.stories';
var StyledWrapper = styled.div(function (_ref) {
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
export default {
  title: 'Addons/Interactions/Panel',
  component: AddonPanelPure,
  decorators: [function (Story) {
    return /*#__PURE__*/React.createElement(StyledWrapper, {
      id: "panel-tab-content"
    }, /*#__PURE__*/React.createElement(Story, null));
  }],
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    calls: new Map(),
    controls: SubnavStories.args.controls,
    controlStates: SubnavStories.args.controlStates,
    interactions: [getCall(CallStates.DONE)],
    fileName: 'addon-interactions.stories.tsx',
    hasException: false,
    isPlaying: false,
    onScrollToEnd: action('onScrollToEnd'),
    endRef: null,
    // prop for the AddonPanel used as wrapper of Panel
    active: true
  }
};
export var Passing = {
  args: {
    interactions: [getCall(CallStates.DONE)]
  }
};
export var Paused = {
  args: {
    isPlaying: true,
    interactions: [getCall(CallStates.WAITING)],
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
export var Playing = {
  args: {
    isPlaying: true,
    interactions: [getCall(CallStates.ACTIVE)]
  }
};
export var Failed = {
  args: {
    hasException: true,
    interactions: [getCall(CallStates.ERROR)]
  }
};
export var WithDebuggingDisabled = {
  args: {
    controlStates: Object.assign({}, SubnavStories.args.controlStates, {
      debugger: false
    })
  }
};
export var NoInteractions = {
  args: {
    interactions: []
  }
};