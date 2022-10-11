import React, { useCallback } from 'react';
import { useGlobals } from '@storybook/api';
import { WithTooltip, TooltipLinkList } from '@storybook/components';
import { ToolbarMenuButton } from './ToolbarMenuButton';
import { withKeyboardCycle } from '../hoc/withKeyboardCycle';
import { getSelectedIcon, getSelectedTitle } from '../utils/get-selected';
import { ToolbarMenuListItem } from './ToolbarMenuListItem';
export const ToolbarMenuList = withKeyboardCycle(({
  id,
  name,
  description,
  toolbar: {
    icon: _icon,
    items,
    title: _title,
    showName,
    preventDynamicIcon,
    dynamicTitle
  }
}) => {
  const [globals, updateGlobals] = useGlobals();
  const currentValue = globals[id];
  const hasGlobalValue = !!currentValue;
  let icon = _icon;
  let title = _title;

  if (!preventDynamicIcon) {
    icon = getSelectedIcon({
      currentValue,
      items
    }) || icon;
  } // Deprecation support for old "name of global arg used as title"


  if (showName && !title) {
    title = name;
    console.warn('`showName` is deprecated as `name` will stop having dual purposes in the future. Please specify a `title` in `globalTypes` instead.');
  } else if (!showName && !icon && !title) {
    title = name;
    console.warn(`Using the \`name\` "${name}" as toolbar title for backward compatibility. \`name\` will stop having dual purposes in the future. Please specify either a \`title\` or an \`icon\` in \`globalTypes\` instead.`);
  }

  if (dynamicTitle) {
    title = getSelectedTitle({
      currentValue,
      items
    }) || title;
  }

  const handleItemClick = useCallback(value => {
    updateGlobals({
      [id]: value
    });
  }, [currentValue, updateGlobals]);
  return /*#__PURE__*/React.createElement(WithTooltip, {
    placement: "top",
    trigger: "click",
    tooltip: ({
      onHide
    }) => {
      const links = items // Special case handling for various "type" variants
      .filter(({
        type
      }) => {
        let shouldReturn = true;

        if (type === 'reset' && !currentValue) {
          shouldReturn = false;
        }

        return shouldReturn;
      }).map(item => {
        const listItem = ToolbarMenuListItem(Object.assign({}, item, {
          currentValue,
          onClick: () => {
            handleItemClick(item.value);
            onHide();
          }
        }));
        return listItem;
      });
      return /*#__PURE__*/React.createElement(TooltipLinkList, {
        links: links
      });
    },
    closeOnClick: true
  }, /*#__PURE__*/React.createElement(ToolbarMenuButton, {
    active: hasGlobalValue,
    description: description,
    icon: icon,
    title: title
  }));
});