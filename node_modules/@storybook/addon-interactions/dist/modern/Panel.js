const _excluded = ["calls", "controls", "controlStates", "interactions", "fileName", "hasException", "isPlaying", "onScrollToEnd", "endRef", "isRerunAnimating", "setIsRerunAnimating"],
      _excluded2 = ["status"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
const INITIAL_CONTROL_STATES = {
  debugger: false,
  start: false,
  back: false,
  goto: false,
  next: false,
  end: false
};
const TabIcon = styled(StatusIcon)({
  marginLeft: 5
});

const TabStatus = ({
  children
}) => {
  const container = global.document.getElementById('tabbutton-interactions');
  return container && /*#__PURE__*/ReactDOM.createPortal(children, container);
};

export const AddonPanelPure = /*#__PURE__*/React.memo(_ref => {
  let {
    calls,
    controls,
    controlStates,
    interactions,
    fileName,
    hasException,
    isPlaying,
    onScrollToEnd,
    endRef,
    isRerunAnimating,
    setIsRerunAnimating
  } = _ref,
      panelProps = _objectWithoutPropertiesLoose(_ref, _excluded);

  return /*#__PURE__*/React.createElement(AddonPanel, panelProps, controlStates.debugger && interactions.length > 0 && /*#__PURE__*/React.createElement(Subnav, {
    controls: controls,
    controlStates: controlStates,
    status: // eslint-disable-next-line no-nested-ternary
    isPlaying ? CallStates.ACTIVE : hasException ? CallStates.ERROR : CallStates.DONE,
    storyFileName: fileName,
    onScrollToEnd: onScrollToEnd,
    isRerunAnimating: isRerunAnimating,
    setIsRerunAnimating: setIsRerunAnimating
  }), interactions.map(call => /*#__PURE__*/React.createElement(Interaction, {
    key: call.id,
    call: call,
    callsById: calls,
    controls: controls,
    controlStates: controlStates
  })), /*#__PURE__*/React.createElement("div", {
    ref: endRef
  }), !isPlaying && interactions.length === 0 && /*#__PURE__*/React.createElement(Placeholder, null, "No interactions found", /*#__PURE__*/React.createElement(Link, {
    href: "https://github.com/storybookjs/storybook/blob/next/addons/interactions/README.md",
    target: "_blank",
    withArrow: true
  }, "Learn how to add interactions to your story")));
});
export const Panel = props => {
  const [storyId, setStoryId] = React.useState();
  const [controlStates, setControlStates] = React.useState(INITIAL_CONTROL_STATES);
  const [isPlaying, setPlaying] = React.useState(false);
  const [isRerunAnimating, setIsRerunAnimating] = React.useState(false);
  const [scrollTarget, setScrollTarget] = React.useState(); // Calls are tracked in a ref so we don't needlessly rerender.

  const calls = React.useRef(new Map());

  const setCall = _ref2 => {
    let call = _objectWithoutPropertiesLoose(_ref2, _excluded2);

    return calls.current.set(call.id, call);
  };

  const [log, setLog] = React.useState([]);
  const interactions = log.map(({
    callId,
    status
  }) => Object.assign({}, calls.current.get(callId), {
    status
  }));
  const endRef = React.useRef();
  React.useEffect(() => {
    let observer;

    if (global.window.IntersectionObserver) {
      observer = new global.window.IntersectionObserver(([end]) => setScrollTarget(end.isIntersecting ? undefined : end.target), {
        root: global.window.document.querySelector('#panel-tab-content')
      });
      if (endRef.current) observer.observe(endRef.current);
    }

    return () => {
      var _observer;

      return (_observer = observer) === null || _observer === void 0 ? void 0 : _observer.disconnect();
    };
  }, []);
  const emit = useChannel({
    [EVENTS.CALL]: setCall,
    [EVENTS.SYNC]: payload => {
      setControlStates(payload.controlStates);
      setLog(payload.logItems);
    },
    [STORY_RENDER_PHASE_CHANGED]: event => {
      setStoryId(event.storyId);
      setPlaying(event.newPhase === 'playing');
    }
  }, []);
  const controls = React.useMemo(() => ({
    start: () => emit(EVENTS.START, {
      storyId
    }),
    back: () => emit(EVENTS.BACK, {
      storyId
    }),
    goto: callId => emit(EVENTS.GOTO, {
      storyId,
      callId
    }),
    next: () => emit(EVENTS.NEXT, {
      storyId
    }),
    end: () => emit(EVENTS.END, {
      storyId
    }),
    rerun: () => {
      setIsRerunAnimating(true);
      emit(FORCE_REMOUNT, {
        storyId
      });
    }
  }), [storyId]);
  const storyFilePath = useParameter('fileName', '');
  const [fileName] = storyFilePath.toString().split('/').slice(-1);

  const scrollToTarget = () => scrollTarget === null || scrollTarget === void 0 ? void 0 : scrollTarget.scrollIntoView({
    behavior: 'smooth',
    block: 'end'
  });

  const showStatus = log.length > 0 && !isPlaying;
  const hasException = log.some(item => item.status === CallStates.ERROR);
  return /*#__PURE__*/React.createElement(React.Fragment, {
    key: "interactions"
  }, /*#__PURE__*/React.createElement(TabStatus, null, showStatus && (hasException ? /*#__PURE__*/React.createElement(TabIcon, {
    status: CallStates.ERROR
  }) : ` (${interactions.length})`)), /*#__PURE__*/React.createElement(AddonPanelPure, _extends({
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