"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.weak-map.js");

require("core-js/modules/es.object.get-own-property-descriptor.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListItem = exports.List = void 0;

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.array.map.js");

var _react = _interopRequireWildcard(require("react"));

var _theming = require("@storybook/theming");

var _components = require("@storybook/components");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ListWrapper = _theming.styled.ul({
  listStyle: 'none',
  fontSize: 14,
  padding: 0,
  margin: 0
});

var Wrapper = _theming.styled.div({
  display: 'flex',
  width: '100%',
  borderBottom: "1px solid ".concat((0, _theming.convert)(_theming.themes.light).appBorderColor),
  '&:hover': {
    background: (0, _theming.convert)(_theming.themes.light).background.hoverable
  }
});

var Icon = (0, _theming.styled)(_components.Icons)({
  height: 10,
  width: 10,
  minWidth: 10,
  color: (0, _theming.convert)(_theming.themes.light).color.mediumdark,
  marginRight: 10,
  transition: 'transform 0.1s ease-in-out',
  alignSelf: 'center',
  display: 'inline-flex'
});

var HeaderBar = _theming.styled.div({
  padding: (0, _theming.convert)(_theming.themes.light).layoutMargin,
  paddingLeft: (0, _theming.convert)(_theming.themes.light).layoutMargin - 3,
  background: 'none',
  color: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  borderLeft: '3px solid transparent',
  width: '100%',
  '&:focus': {
    outline: '0 none',
    borderLeft: "3px solid ".concat((0, _theming.convert)(_theming.themes.light).color.secondary)
  }
});

var Description = _theming.styled.div({
  padding: (0, _theming.convert)(_theming.themes.light).layoutMargin,
  marginBottom: (0, _theming.convert)(_theming.themes.light).layoutMargin,
  fontStyle: 'italic'
});

var ListItem = function ListItem(_ref) {
  var item = _ref.item;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      onToggle = _useState2[1];

  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(Wrapper, null, /*#__PURE__*/_react.default.createElement(HeaderBar, {
    onClick: function onClick() {
      return onToggle(!open);
    },
    role: "button"
  }, /*#__PURE__*/_react.default.createElement(Icon, {
    icon: "chevrondown",
    color: (0, _theming.convert)(_theming.themes.light).appBorderColor,
    style: {
      transform: "rotate(".concat(open ? 0 : -90, "deg)")
    }
  }), item.title)), open ? /*#__PURE__*/_react.default.createElement(Description, null, item.description) : null);
};

exports.ListItem = ListItem;

var List = function List(_ref2) {
  var items = _ref2.items;
  return /*#__PURE__*/_react.default.createElement(ListWrapper, null, items.map(function (item) {
    return /*#__PURE__*/_react.default.createElement(ListItem, {
      key: item.title + item.description,
      item: item
    });
  }));
};

exports.List = List;