import React from 'react';
import { Icons } from '@storybook/components';
import { CallStates } from '@storybook/instrumenter';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
import localTheme from '../../theme';
const {
  colors: {
    pure: {
      gray
    }
  }
} = localTheme;
const StyledStatusIcon = styled(Icons)(({
  theme,
  status
}) => {
  const color = {
    [CallStates.DONE]: theme.color.positive,
    [CallStates.ERROR]: theme.color.negative,
    [CallStates.ACTIVE]: theme.color.secondary,
    [CallStates.WAITING]: transparentize(0.5, gray[500])
  }[status];
  return {
    width: status === CallStates.WAITING ? 6 : 12,
    height: status === CallStates.WAITING ? 6 : 12,
    color,
    justifySelf: 'center'
  };
});
export const StatusIcon = ({
  status,
  className
}) => {
  const icon = {
    [CallStates.DONE]: 'check',
    [CallStates.ERROR]: 'stopalt',
    [CallStates.ACTIVE]: 'play',
    [CallStates.WAITING]: 'circle'
  }[status];
  return /*#__PURE__*/React.createElement(StyledStatusIcon, {
    "data-testid": `icon-${status}`,
    status: status,
    icon: icon,
    className: className
  });
};