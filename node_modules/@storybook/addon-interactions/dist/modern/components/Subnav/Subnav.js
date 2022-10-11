import React from 'react';
import { Button, IconButton, Icons, Separator, P, TooltipNote, WithTooltip, Bar } from '@storybook/components';
import { CallStates } from '@storybook/instrumenter';
import { styled } from '@storybook/theming';
import { StatusBadge } from '../StatusBadge/StatusBadge';
const SubnavWrapper = styled.div(({
  theme
}) => ({
  background: theme.background.app,
  borderBottom: `1px solid ${theme.appBorderColor}`,
  position: 'sticky',
  top: 0,
  zIndex: 1
}));
const StyledSubnav = styled.nav(({
  theme
}) => ({
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: 15
}));
const StyledButton = styled(Button)(({
  theme
}) => ({
  borderRadius: 4,
  padding: 6,
  color: theme.textMutedColor,
  '&:not(:disabled)': {
    '&:hover,&:focus-visible': {
      color: theme.color.secondary
    }
  }
}));
const Note = styled(TooltipNote)(({
  theme
}) => ({
  fontFamily: theme.typography.fonts.base
}));
export const StyledIconButton = styled(IconButton)(({
  theme
}) => ({
  color: theme.color.mediumdark,
  margin: '0 3px'
}));
const StyledSeparator = styled(Separator)({
  marginTop: 0
});
const StyledLocation = styled(P)(({
  theme
}) => ({
  color: theme.textMutedColor,
  justifyContent: 'flex-end',
  textAlign: 'right',
  whiteSpace: 'nowrap',
  marginTop: 'auto',
  marginBottom: 1,
  paddingRight: 15,
  fontSize: 13
}));
const Group = styled.div({
  display: 'flex',
  alignItems: 'center'
});
const RewindButton = styled(StyledIconButton)({
  marginLeft: 9
});
const JumpToEndButton = styled(StyledButton)({
  marginLeft: 9,
  marginRight: 9,
  marginBottom: 1,
  lineHeight: '12px'
});
const RerunButton = styled(StyledIconButton)(({
  theme,
  animating,
  disabled
}) => ({
  opacity: disabled ? 0.5 : 1,
  svg: {
    animation: animating && `${theme.animation.rotate360} 200ms ease-out`
  }
}));
export const Subnav = ({
  controls,
  controlStates,
  status,
  storyFileName,
  onScrollToEnd,
  isRerunAnimating,
  setIsRerunAnimating
}) => {
  const buttonText = status === CallStates.ERROR ? 'Scroll to error' : 'Scroll to end';
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
    onAnimationEnd: () => setIsRerunAnimating(false),
    animating: isRerunAnimating,
    disabled: isRerunAnimating
  }, /*#__PURE__*/React.createElement(Icons, {
    icon: "sync"
  })))), storyFileName && /*#__PURE__*/React.createElement(Group, null, /*#__PURE__*/React.createElement(StyledLocation, null, storyFileName)))));
};