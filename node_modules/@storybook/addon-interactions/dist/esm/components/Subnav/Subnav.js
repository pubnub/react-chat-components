import React from 'react';
import { Button, IconButton, Icons, Separator, P, TooltipNote, WithTooltip, Bar } from '@storybook/components';
import { CallStates } from '@storybook/instrumenter';
import { styled } from '@storybook/theming';
import { StatusBadge } from '../StatusBadge/StatusBadge';
var SubnavWrapper = styled.div(function (_ref) {
  var theme = _ref.theme;
  return {
    background: theme.background.app,
    borderBottom: "1px solid ".concat(theme.appBorderColor),
    position: 'sticky',
    top: 0,
    zIndex: 1
  };
});
var StyledSubnav = styled.nav(function (_ref2) {
  var theme = _ref2.theme;
  return {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15
  };
});
var StyledButton = styled(Button)(function (_ref3) {
  var theme = _ref3.theme;
  return {
    borderRadius: 4,
    padding: 6,
    color: theme.textMutedColor,
    '&:not(:disabled)': {
      '&:hover,&:focus-visible': {
        color: theme.color.secondary
      }
    }
  };
});
var Note = styled(TooltipNote)(function (_ref4) {
  var theme = _ref4.theme;
  return {
    fontFamily: theme.typography.fonts.base
  };
});
export var StyledIconButton = styled(IconButton)(function (_ref5) {
  var theme = _ref5.theme;
  return {
    color: theme.color.mediumdark,
    margin: '0 3px'
  };
});
var StyledSeparator = styled(Separator)({
  marginTop: 0
});
var StyledLocation = styled(P)(function (_ref6) {
  var theme = _ref6.theme;
  return {
    color: theme.textMutedColor,
    justifyContent: 'flex-end',
    textAlign: 'right',
    whiteSpace: 'nowrap',
    marginTop: 'auto',
    marginBottom: 1,
    paddingRight: 15,
    fontSize: 13
  };
});
var Group = styled.div({
  display: 'flex',
  alignItems: 'center'
});
var RewindButton = styled(StyledIconButton)({
  marginLeft: 9
});
var JumpToEndButton = styled(StyledButton)({
  marginLeft: 9,
  marginRight: 9,
  marginBottom: 1,
  lineHeight: '12px'
});
var RerunButton = styled(StyledIconButton)(function (_ref7) {
  var theme = _ref7.theme,
      animating = _ref7.animating,
      disabled = _ref7.disabled;
  return {
    opacity: disabled ? 0.5 : 1,
    svg: {
      animation: animating && "".concat(theme.animation.rotate360, " 200ms ease-out")
    }
  };
});
export var Subnav = function Subnav(_ref8) {
  var controls = _ref8.controls,
      controlStates = _ref8.controlStates,
      status = _ref8.status,
      storyFileName = _ref8.storyFileName,
      onScrollToEnd = _ref8.onScrollToEnd,
      isRerunAnimating = _ref8.isRerunAnimating,
      setIsRerunAnimating = _ref8.setIsRerunAnimating;
  var buttonText = status === CallStates.ERROR ? 'Scroll to error' : 'Scroll to end';
  return /*#__PURE__*/React.createElement(SubnavWrapper, null, /*#__PURE__*/React.createElement(Bar, null, /*#__PURE__*/React.createElement(StyledSubnav, null, /*#__PURE__*/React.createElement(Group, null, /*#__PURE__*/React.createElement(StatusBadge, {
    status: status
  }), /*#__PURE__*/React.createElement(JumpToEndButton, {
    onClick: onScrollToEnd,
    disabled: !onScrollToEnd
  }, buttonText), /*#__PURE__*/React.createElement(StyledSeparator, null), /*#__PURE__*/React.createElement(WithTooltip, {
    hasChrome: false,
    tooltip: /*#__PURE__*/React.createElement(Note, {
      note: "Go to start"
    })
  }, /*#__PURE__*/React.createElement(RewindButton, {
    containsIcon: true,
    onClick: controls.start,
    disabled: !controlStates.start
  }, /*#__PURE__*/React.createElement(Icons, {
    icon: "rewind"
  }))), /*#__PURE__*/React.createElement(WithTooltip, {
    hasChrome: false,
    tooltip: /*#__PURE__*/React.createElement(Note, {
      note: "Go back"
    })
  }, /*#__PURE__*/React.createElement(StyledIconButton, {
    containsIcon: true,
    onClick: controls.back,
    disabled: !controlStates.back
  }, /*#__PURE__*/React.createElement(Icons, {
    icon: "playback"
  }))), /*#__PURE__*/React.createElement(WithTooltip, {
    hasChrome: false,
    tooltip: /*#__PURE__*/React.createElement(Note, {
      note: "Go forward"
    })
  }, /*#__PURE__*/React.createElement(StyledIconButton, {
    containsIcon: true,
    onClick: controls.next,
    disabled: !controlStates.next
  }, /*#__PURE__*/React.createElement(Icons, {
    icon: "playnext"
  }))), /*#__PURE__*/React.createElement(WithTooltip, {
    hasChrome: false,
    tooltip: /*#__PURE__*/React.createElement(Note, {
      note: "Go to end"
    })
  }, /*#__PURE__*/React.createElement(StyledIconButton, {
    containsIcon: true,
    onClick: controls.end,
    disabled: !controlStates.end
  }, /*#__PURE__*/React.createElement(Icons, {
    icon: "fastforward"
  }))), /*#__PURE__*/React.createElement(WithTooltip, {
    hasChrome: false,
    tooltip: /*#__PURE__*/React.createElement(Note, {
      note: "Rerun"
    })
  }, /*#__PURE__*/React.createElement(RerunButton, {
    title: "Rerun interactions",
    containsIcon: true,
    onClick: controls.rerun,
    onAnimationEnd: function onAnimationEnd() {
      return setIsRerunAnimating(false);
    },
    animating: isRerunAnimating,
    disabled: isRerunAnimating
  }, /*#__PURE__*/React.createElement(Icons, {
    icon: "sync"
  })))), storyFileName && /*#__PURE__*/React.createElement(Group, null, /*#__PURE__*/React.createElement(StyledLocation, null, storyFileName)))));
};