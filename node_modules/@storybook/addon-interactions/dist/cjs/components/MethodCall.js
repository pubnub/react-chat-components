"use strict";

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.weak-map.js");

require("core-js/modules/es.object.get-own-property-descriptor.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UndefinedNode = exports.SymbolNode = exports.StringNode = exports.RegExpNode = exports.OtherNode = exports.ObjectNode = exports.NumberNode = exports.NullNode = exports.Node = exports.MethodCall = exports.FunctionNode = exports.ErrorNode = exports.ElementNode = exports.DateNode = exports.ClassNode = exports.BooleanNode = exports.ArrayNode = void 0;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.array.flat-map.js");

require("core-js/modules/es.array.unscopables.flat-map.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.object.entries.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.regexp.flags.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

var _objectInspector = require("@devtools-ds/object-inspector");

var _theming = require("@storybook/theming");

var _react = _interopRequireWildcard(require("react"));

var _excluded = ["value", "nested", "showObjectInspector", "callsById"],
    _excluded2 = ["value"],
    _excluded3 = ["value"],
    _excluded4 = ["value"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var colorsLight = {
  base: '#444',
  nullish: '#7D99AA',
  string: '#16B242',
  number: '#5D40D0',
  boolean: '#f41840',
  objectkey: '#698394',
  instance: '#A15C20',
  function: '#EA7509',
  muted: '#7D99AA',
  tag: {
    name: '#6F2CAC',
    suffix: '#1F99E5'
  },
  date: '#459D9C',
  error: {
    name: '#D43900',
    message: '#444'
  },
  regex: {
    source: '#A15C20',
    flags: '#EA7509'
  },
  meta: '#EA7509',
  method: '#0271B6'
};
var colorsDark = {
  base: '#eee',
  nullish: '#aaa',
  string: '#5FE584',
  number: '#6ba5ff',
  boolean: '#ff4191',
  objectkey: '#accfe6',
  instance: '#E3B551',
  function: '#E3B551',
  muted: '#aaa',
  tag: {
    name: '#f57bff',
    suffix: '#8EB5FF'
  },
  date: '#70D4D3',
  error: {
    name: '#f40',
    message: '#eee'
  },
  regex: {
    source: '#FAD483',
    flags: '#E3B551'
  },
  meta: '#FAD483',
  method: '#5EC1FF'
};

var useThemeColors = function useThemeColors() {
  var _useTheme = (0, _theming.useTheme)(),
      base = _useTheme.base;

  return base === 'dark' ? colorsDark : colorsLight;
};

var special = /[^A-Z0-9]/i;
var trimEnd = /[\s.,…]+$/gm;

var ellipsize = function ellipsize(string, maxlength) {
  if (string.length <= maxlength) return string;

  for (var i = maxlength - 1; i >= 0; i -= 1) {
    if (special.test(string[i]) && i > 10) {
      return "".concat(string.slice(0, i).replace(trimEnd, ''), "\u2026");
    }
  }

  return "".concat(string.slice(0, maxlength).replace(trimEnd, ''), "\u2026");
};

var stringify = function stringify(value) {
  try {
    return JSON.stringify(value, null, 1);
  } catch (e) {
    return String(value);
  }
};

var interleave = function interleave(nodes, separator) {
  return nodes.flatMap(function (node, index) {
    return index === nodes.length - 1 ? [node] : [node, /*#__PURE__*/_react.default.cloneElement(separator, {
      key: "sep".concat(index)
    })];
  });
};

var Node = function Node(_ref) {
  var _value$constructor, _value$constructor2;

  var value = _ref.value,
      nested = _ref.nested,
      showObjectInspector = _ref.showObjectInspector,
      callsById = _ref.callsById,
      props = _objectWithoutProperties(_ref, _excluded);

  switch (true) {
    case value === null:
      return /*#__PURE__*/_react.default.createElement(NullNode, props);

    case value === undefined:
      return /*#__PURE__*/_react.default.createElement(UndefinedNode, props);

    case typeof value === 'string':
      return /*#__PURE__*/_react.default.createElement(StringNode, _extends({
        value: value
      }, props));

    case typeof value === 'number':
      return /*#__PURE__*/_react.default.createElement(NumberNode, _extends({
        value: value
      }, props));

    case typeof value === 'boolean':
      return /*#__PURE__*/_react.default.createElement(BooleanNode, _extends({
        value: value
      }, props));

    case typeof value === 'function':
      return /*#__PURE__*/_react.default.createElement(FunctionNode, _extends({
        value: value
      }, props));

    case value instanceof Array:
      return /*#__PURE__*/_react.default.createElement(ArrayNode, _extends({
        value: value
      }, props));

    case value instanceof Date:
      return /*#__PURE__*/_react.default.createElement(DateNode, _extends({
        value: value
      }, props));

    case value instanceof Error:
      return /*#__PURE__*/_react.default.createElement(ErrorNode, _extends({
        value: value
      }, props));

    case value instanceof RegExp:
      return /*#__PURE__*/_react.default.createElement(RegExpNode, _extends({
        value: value
      }, props));

    case Object.prototype.hasOwnProperty.call(value, '__element__'):
      // eslint-disable-next-line no-underscore-dangle
      return /*#__PURE__*/_react.default.createElement(ElementNode, _extends({
        value: value.__element__
      }, props));

    case Object.prototype.hasOwnProperty.call(value, '__callId__'):
      // eslint-disable-next-line no-underscore-dangle
      return /*#__PURE__*/_react.default.createElement(MethodCall, {
        call: callsById.get(value.__callId__),
        callsById: callsById
      });

    case _typeof(value) === 'object' && ((_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name) && ((_value$constructor2 = value.constructor) === null || _value$constructor2 === void 0 ? void 0 : _value$constructor2.name) !== 'Object':
      return /*#__PURE__*/_react.default.createElement(ClassNode, _extends({
        value: value
      }, props));

    case Object.prototype.toString.call(value) === '[object Object]':
      return /*#__PURE__*/_react.default.createElement(ObjectNode, _extends({
        value: value,
        showInspector: showObjectInspector
      }, props));

    default:
      return /*#__PURE__*/_react.default.createElement(OtherNode, _extends({
        value: value
      }, props));
  }
};

exports.Node = Node;

var NullNode = function NullNode(props) {
  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", _extends({
    style: {
      color: colors.nullish
    }
  }, props), "null");
};

exports.NullNode = NullNode;

var UndefinedNode = function UndefinedNode(props) {
  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", _extends({
    style: {
      color: colors.nullish
    }
  }, props), "undefined");
};

exports.UndefinedNode = UndefinedNode;

var StringNode = function StringNode(_ref2) {
  var value = _ref2.value,
      props = _objectWithoutProperties(_ref2, _excluded2);

  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", _extends({
    style: {
      color: colors.string
    }
  }, props), JSON.stringify(ellipsize(value, 50)));
};

exports.StringNode = StringNode;

var NumberNode = function NumberNode(_ref3) {
  var value = _ref3.value,
      props = _objectWithoutProperties(_ref3, _excluded3);

  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", _extends({
    style: {
      color: colors.number
    }
  }, props), value);
};

exports.NumberNode = NumberNode;

var BooleanNode = function BooleanNode(_ref4) {
  var value = _ref4.value,
      props = _objectWithoutProperties(_ref4, _excluded4);

  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", _extends({
    style: {
      color: colors.boolean
    }
  }, props), String(value));
};

exports.BooleanNode = BooleanNode;

var ArrayNode = function ArrayNode(_ref5) {
  var value = _ref5.value,
      _ref5$nested = _ref5.nested,
      nested = _ref5$nested === void 0 ? false : _ref5$nested;
  var colors = useThemeColors();

  if (nested) {
    return /*#__PURE__*/_react.default.createElement("span", {
      style: {
        color: colors.base
      }
    }, "[\u2026]");
  }

  var nodes = value.slice(0, 3).map(function (v) {
    return /*#__PURE__*/_react.default.createElement(Node, {
      key: v,
      value: v,
      nested: true
    });
  });
  var nodelist = interleave(nodes, /*#__PURE__*/_react.default.createElement("span", null, ", "));

  if (value.length <= 3) {
    return /*#__PURE__*/_react.default.createElement("span", {
      style: {
        color: colors.base
      }
    }, "[", nodelist, "]");
  }

  return /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.base
    }
  }, "(", value.length, ") [", nodelist, ", \u2026]");
};

exports.ArrayNode = ArrayNode;

var ObjectNode = function ObjectNode(_ref6) {
  var showInspector = _ref6.showInspector,
      value = _ref6.value,
      _ref6$nested = _ref6.nested,
      nested = _ref6$nested === void 0 ? false : _ref6$nested;
  var isDarkMode = (0, _theming.useTheme)().base === 'dark';
  var colors = useThemeColors();

  if (showInspector) {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_objectInspector.ObjectInspector, {
      id: "interactions-object-inspector",
      data: value,
      includePrototypes: false,
      colorScheme: isDarkMode ? 'dark' : 'light'
    }));
  }

  if (nested) {
    return /*#__PURE__*/_react.default.createElement("span", {
      style: {
        color: colors.base
      }
    }, '{…}');
  }

  var nodelist = interleave(Object.entries(value).slice(0, 2).map(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        k = _ref8[0],
        v = _ref8[1];

    return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
      key: k
    }, /*#__PURE__*/_react.default.createElement("span", {
      style: {
        color: colors.objectkey
      }
    }, k, ": "), /*#__PURE__*/_react.default.createElement(Node, {
      value: v,
      nested: true
    }));
  }), /*#__PURE__*/_react.default.createElement("span", null, ", "));

  if (Object.keys(value).length <= 2) {
    return /*#__PURE__*/_react.default.createElement("span", {
      style: {
        color: colors.base
      }
    }, '{ ', nodelist, ' }');
  }

  return /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.base
    }
  }, "(", Object.keys(value).length, ") ", '{ ', nodelist, ', … }');
};

exports.ObjectNode = ObjectNode;

var ClassNode = function ClassNode(_ref9) {
  var value = _ref9.value;
  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.instance
    }
  }, value.constructor.name);
};

exports.ClassNode = ClassNode;

var FunctionNode = function FunctionNode(_ref10) {
  var value = _ref10.value;
  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.function
    }
  }, value.name || 'anonymous');
};

exports.FunctionNode = FunctionNode;

var ElementNode = function ElementNode(_ref11) {
  var value = _ref11.value;
  var prefix = value.prefix,
      localName = value.localName,
      id = value.id,
      _value$classNames = value.classNames,
      classNames = _value$classNames === void 0 ? [] : _value$classNames,
      innerText = value.innerText;
  var name = prefix ? "".concat(prefix, ":").concat(localName) : localName;
  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", {
    style: {
      wordBreak: 'keep-all'
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    key: "".concat(name, "_lt"),
    style: {
      color: colors.muted
    }
  }, "<"), /*#__PURE__*/_react.default.createElement("span", {
    key: "".concat(name, "_tag"),
    style: {
      color: colors.tag.name
    }
  }, name), /*#__PURE__*/_react.default.createElement("span", {
    key: "".concat(name, "_suffix"),
    style: {
      color: colors.tag.suffix
    }
  }, id ? "#".concat(id) : classNames.reduce(function (acc, className) {
    return "".concat(acc, ".").concat(className);
  }, '')), /*#__PURE__*/_react.default.createElement("span", {
    key: "".concat(name, "_gt"),
    style: {
      color: colors.muted
    }
  }, ">"), !id && classNames.length === 0 && innerText && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", {
    key: "".concat(name, "_text")
  }, innerText), /*#__PURE__*/_react.default.createElement("span", {
    key: "".concat(name, "_close_lt"),
    style: {
      color: colors.muted
    }
  }, "<"), /*#__PURE__*/_react.default.createElement("span", {
    key: "".concat(name, "_close_tag"),
    style: {
      color: colors.tag.name
    }
  }, "/", name), /*#__PURE__*/_react.default.createElement("span", {
    key: "".concat(name, "_close_gt"),
    style: {
      color: colors.muted
    }
  }, ">")));
};

exports.ElementNode = ElementNode;

var DateNode = function DateNode(_ref12) {
  var value = _ref12.value;

  var _value$toISOString$sp = value.toISOString().split(/[T.Z]/),
      _value$toISOString$sp2 = _slicedToArray(_value$toISOString$sp, 3),
      date = _value$toISOString$sp2[0],
      time = _value$toISOString$sp2[1],
      ms = _value$toISOString$sp2[2];

  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", {
    style: {
      whiteSpace: 'nowrap',
      color: colors.date
    }
  }, date, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, "T"), time === '00:00:00' ? /*#__PURE__*/_react.default.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, time) : time, ms === '000' ? /*#__PURE__*/_react.default.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, ".", ms) : ".".concat(ms), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, "Z"));
};

exports.DateNode = DateNode;

var ErrorNode = function ErrorNode(_ref13) {
  var value = _ref13.value;
  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.error.name
    }
  }, value.name, value.message && ': ', value.message && /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.error.message
    },
    title: value.message.length > 50 ? value.message : ''
  }, ellipsize(value.message, 50)));
};

exports.ErrorNode = ErrorNode;

var RegExpNode = function RegExpNode(_ref14) {
  var value = _ref14.value;
  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", {
    style: {
      whiteSpace: 'nowrap',
      color: colors.regex.flags
    }
  }, "/", /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.regex.source
    }
  }, value.source), "/", value.flags);
};

exports.RegExpNode = RegExpNode;

var SymbolNode = function SymbolNode(_ref15) {
  var value = _ref15.value;
  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", {
    style: {
      whiteSpace: 'nowrap',
      color: colors.instance
    }
  }, "Symbol(", value.description && /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.meta
    }
  }, JSON.stringify(value.description)), ")");
};

exports.SymbolNode = SymbolNode;

var OtherNode = function OtherNode(_ref16) {
  var value = _ref16.value;
  var colors = useThemeColors();
  return /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.meta
    }
  }, stringify(value));
};

exports.OtherNode = OtherNode;

var MethodCall = function MethodCall(_ref17) {
  var call = _ref17.call,
      callsById = _ref17.callsById;
  // Call might be undefined during initial render, can be safely ignored.
  if (!call) return null;
  var colors = useThemeColors();
  var path = call.path.flatMap(function (elem, index) {
    // eslint-disable-next-line no-underscore-dangle
    var callId = elem.__callId__;
    return [callId ? /*#__PURE__*/_react.default.createElement(MethodCall, {
      key: "elem".concat(index),
      call: callsById.get(callId),
      callsById: callsById
    }) : /*#__PURE__*/_react.default.createElement("span", {
      key: "elem".concat(index)
    }, elem), /*#__PURE__*/_react.default.createElement("wbr", {
      key: "wbr".concat(index)
    }), /*#__PURE__*/_react.default.createElement("span", {
      key: "dot".concat(index)
    }, ".")];
  });
  var args = call.args.flatMap(function (arg, index, array) {
    var node = /*#__PURE__*/_react.default.createElement(Node, {
      key: "node".concat(index),
      value: arg,
      callsById: callsById
    });

    return index < array.length - 1 ? [node, /*#__PURE__*/_react.default.createElement("span", {
      key: "comma".concat(index)
    }, ",\xA0"), /*#__PURE__*/_react.default.createElement("wbr", {
      key: "wbr".concat(index)
    })] : [node];
  });
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.base
    }
  }, path), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.method
    }
  }, call.method), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: colors.base
    }
  }, "(", /*#__PURE__*/_react.default.createElement("wbr", null), args, /*#__PURE__*/_react.default.createElement("wbr", null), ")"));
};

exports.MethodCall = MethodCall;