import "core-js/modules/es.symbol.js";
import "core-js/modules/es.symbol.description.js";
import "core-js/modules/es.array.map.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.symbol.iterator.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.array.slice.js";
import "core-js/modules/es.function.name.js";
import "core-js/modules/es.array.from.js";
import "core-js/modules/es.regexp.exec.js";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { Fragment, useState } from 'react';
import { styled, themes, convert } from '@storybook/theming';
import { Icons } from '@storybook/components';
var ListWrapper = styled.ul({
  listStyle: 'none',
  fontSize: 14,
  padding: 0,
  margin: 0
});
var Wrapper = styled.div({
  display: 'flex',
  width: '100%',
  borderBottom: "1px solid ".concat(convert(themes.light).appBorderColor),
  '&:hover': {
    background: convert(themes.light).background.hoverable
  }
});
var Icon = styled(Icons)({
  height: 10,
  width: 10,
  minWidth: 10,
  color: convert(themes.light).color.mediumdark,
  marginRight: 10,
  transition: 'transform 0.1s ease-in-out',
  alignSelf: 'center',
  display: 'inline-flex'
});
var HeaderBar = styled.div({
  padding: convert(themes.light).layoutMargin,
  paddingLeft: convert(themes.light).layoutMargin - 3,
  background: 'none',
  color: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  borderLeft: '3px solid transparent',
  width: '100%',
  '&:focus': {
    outline: '0 none',
    borderLeft: "3px solid ".concat(convert(themes.light).color.secondary)
  }
});
var Description = styled.div({
  padding: convert(themes.light).layoutMargin,
  marginBottom: convert(themes.light).layoutMargin,
  fontStyle: 'italic'
});
export var ListItem = function ListItem(_ref) {
  var item = _ref.item;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      onToggle = _useState2[1];

  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(HeaderBar, {
    onClick: function onClick() {
      return onToggle(!open);
    },
    role: "button"
  }, /*#__PURE__*/React.createElement(Icon, {
    icon: "chevrondown",
    color: convert(themes.light).appBorderColor,
    style: {
      transform: "rotate(".concat(open ? 0 : -90, "deg)")
    }
  }), item.title)), open ? /*#__PURE__*/React.createElement(Description, null, item.description) : null);
};
export var List = function List(_ref2) {
  var items = _ref2.items;
  return /*#__PURE__*/React.createElement(ListWrapper, null, items.map(function (item) {
    return /*#__PURE__*/React.createElement(ListItem, {
      key: item.title + item.description,
      item: item
    });
  }));
};