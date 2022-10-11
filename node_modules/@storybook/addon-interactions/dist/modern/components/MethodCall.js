const _excluded = ["value", "nested", "showObjectInspector", "callsById"],
      _excluded2 = ["value"],
      _excluded3 = ["value"],
      _excluded4 = ["value"];
import "core-js/modules/es.array.reduce.js";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import { ObjectInspector } from '@devtools-ds/object-inspector';
import { useTheme } from '@storybook/theming';
import React, { Fragment } from 'react';
const colorsLight = {
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
const colorsDark = {
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

const useThemeColors = () => {
  const {
    base
  } = useTheme();
  return base === 'dark' ? colorsDark : colorsLight;
};

const special = /[^A-Z0-9]/i;
const trimEnd = /[\s.,…]+$/gm;

const ellipsize = (string, maxlength) => {
  if (string.length <= maxlength) return string;

  for (let i = maxlength - 1; i >= 0; i -= 1) {
    if (special.test(string[i]) && i > 10) {
      return `${string.slice(0, i).replace(trimEnd, '')}…`;
    }
  }

  return `${string.slice(0, maxlength).replace(trimEnd, '')}…`;
};

const stringify = value => {
  try {
    return JSON.stringify(value, null, 1);
  } catch (e) {
    return String(value);
  }
};

const interleave = (nodes, separator) => nodes.flatMap((node, index) => index === nodes.length - 1 ? [node] : [node, /*#__PURE__*/React.cloneElement(separator, {
  key: `sep${index}`
})]);

export const Node = _ref => {
  var _value$constructor, _value$constructor2;

  let {
    value,
    showObjectInspector,
    callsById
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  switch (true) {
    case value === null:
      return /*#__PURE__*/React.createElement(NullNode, props);

    case value === undefined:
      return /*#__PURE__*/React.createElement(UndefinedNode, props);

    case typeof value === 'string':
      return /*#__PURE__*/React.createElement(StringNode, _extends({
        value: value
      }, props));

    case typeof value === 'number':
      return /*#__PURE__*/React.createElement(NumberNode, _extends({
        value: value
      }, props));

    case typeof value === 'boolean':
      return /*#__PURE__*/React.createElement(BooleanNode, _extends({
        value: value
      }, props));

    case typeof value === 'function':
      return /*#__PURE__*/React.createElement(FunctionNode, _extends({
        value: value
      }, props));

    case value instanceof Array:
      return /*#__PURE__*/React.createElement(ArrayNode, _extends({
        value: value
      }, props));

    case value instanceof Date:
      return /*#__PURE__*/React.createElement(DateNode, _extends({
        value: value
      }, props));

    case value instanceof Error:
      return /*#__PURE__*/React.createElement(ErrorNode, _extends({
        value: value
      }, props));

    case value instanceof RegExp:
      return /*#__PURE__*/React.createElement(RegExpNode, _extends({
        value: value
      }, props));

    case Object.prototype.hasOwnProperty.call(value, '__element__'):
      // eslint-disable-next-line no-underscore-dangle
      return /*#__PURE__*/React.createElement(ElementNode, _extends({
        value: value.__element__
      }, props));

    case Object.prototype.hasOwnProperty.call(value, '__callId__'):
      // eslint-disable-next-line no-underscore-dangle
      return /*#__PURE__*/React.createElement(MethodCall, {
        call: callsById.get(value.__callId__),
        callsById: callsById
      });

    case typeof value === 'object' && ((_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name) && ((_value$constructor2 = value.constructor) === null || _value$constructor2 === void 0 ? void 0 : _value$constructor2.name) !== 'Object':
      return /*#__PURE__*/React.createElement(ClassNode, _extends({
        value: value
      }, props));

    case Object.prototype.toString.call(value) === '[object Object]':
      return /*#__PURE__*/React.createElement(ObjectNode, _extends({
        value: value,
        showInspector: showObjectInspector
      }, props));

    default:
      return /*#__PURE__*/React.createElement(OtherNode, _extends({
        value: value
      }, props));
  }
};
export const NullNode = props => {
  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      color: colors.nullish
    }
  }, props), "null");
};
export const UndefinedNode = props => {
  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      color: colors.nullish
    }
  }, props), "undefined");
};
export const StringNode = _ref2 => {
  let {
    value
  } = _ref2,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      color: colors.string
    }
  }, props), JSON.stringify(ellipsize(value, 50)));
};
export const NumberNode = _ref3 => {
  let {
    value
  } = _ref3,
      props = _objectWithoutPropertiesLoose(_ref3, _excluded3);

  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      color: colors.number
    }
  }, props), value);
};
export const BooleanNode = _ref4 => {
  let {
    value
  } = _ref4,
      props = _objectWithoutPropertiesLoose(_ref4, _excluded4);

  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      color: colors.boolean
    }
  }, props), String(value));
};
export const ArrayNode = ({
  value,
  nested = false
}) => {
  const colors = useThemeColors();

  if (nested) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        color: colors.base
      }
    }, "[\u2026]");
  }

  const nodes = value.slice(0, 3).map(v => /*#__PURE__*/React.createElement(Node, {
    key: v,
    value: v,
    nested: true
  }));
  const nodelist = interleave(nodes, /*#__PURE__*/React.createElement("span", null, ", "));

  if (value.length <= 3) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        color: colors.base
      }
    }, "[", nodelist, "]");
  }

  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.base
    }
  }, "(", value.length, ") [", nodelist, ", \u2026]");
};
export const ObjectNode = ({
  showInspector,
  value,
  nested = false
}) => {
  const isDarkMode = useTheme().base === 'dark';
  const colors = useThemeColors();

  if (showInspector) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ObjectInspector, {
      id: "interactions-object-inspector",
      data: value,
      includePrototypes: false,
      colorScheme: isDarkMode ? 'dark' : 'light'
    }));
  }

  if (nested) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        color: colors.base
      }
    }, '{…}');
  }

  const nodelist = interleave(Object.entries(value).slice(0, 2).map(([k, v]) => /*#__PURE__*/React.createElement(Fragment, {
    key: k
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.objectkey
    }
  }, k, ": "), /*#__PURE__*/React.createElement(Node, {
    value: v,
    nested: true
  }))), /*#__PURE__*/React.createElement("span", null, ", "));

  if (Object.keys(value).length <= 2) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        color: colors.base
      }
    }, '{ ', nodelist, ' }');
  }

  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.base
    }
  }, "(", Object.keys(value).length, ") ", '{ ', nodelist, ', … }');
};
export const ClassNode = ({
  value
}) => {
  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.instance
    }
  }, value.constructor.name);
};
export const FunctionNode = ({
  value
}) => {
  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.function
    }
  }, value.name || 'anonymous');
};
export const ElementNode = ({
  value
}) => {
  const {
    prefix,
    localName,
    id,
    classNames = [],
    innerText
  } = value;
  const name = prefix ? `${prefix}:${localName}` : localName;
  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      wordBreak: 'keep-all'
    }
  }, /*#__PURE__*/React.createElement("span", {
    key: `${name}_lt`,
    style: {
      color: colors.muted
    }
  }, "<"), /*#__PURE__*/React.createElement("span", {
    key: `${name}_tag`,
    style: {
      color: colors.tag.name
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    key: `${name}_suffix`,
    style: {
      color: colors.tag.suffix
    }
  }, id ? `#${id}` : classNames.reduce((acc, className) => `${acc}.${className}`, '')), /*#__PURE__*/React.createElement("span", {
    key: `${name}_gt`,
    style: {
      color: colors.muted
    }
  }, ">"), !id && classNames.length === 0 && innerText && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    key: `${name}_text`
  }, innerText), /*#__PURE__*/React.createElement("span", {
    key: `${name}_close_lt`,
    style: {
      color: colors.muted
    }
  }, "<"), /*#__PURE__*/React.createElement("span", {
    key: `${name}_close_tag`,
    style: {
      color: colors.tag.name
    }
  }, "/", name), /*#__PURE__*/React.createElement("span", {
    key: `${name}_close_gt`,
    style: {
      color: colors.muted
    }
  }, ">")));
};
export const DateNode = ({
  value
}) => {
  const [date, time, ms] = value.toISOString().split(/[T.Z]/);
  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap',
      color: colors.date
    }
  }, date, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, "T"), time === '00:00:00' ? /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, time) : time, ms === '000' ? /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, ".", ms) : `.${ms}`, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, "Z"));
};
export const ErrorNode = ({
  value
}) => {
  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.error.name
    }
  }, value.name, value.message && ': ', value.message && /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.error.message
    },
    title: value.message.length > 50 ? value.message : ''
  }, ellipsize(value.message, 50)));
};
export const RegExpNode = ({
  value
}) => {
  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap',
      color: colors.regex.flags
    }
  }, "/", /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.regex.source
    }
  }, value.source), "/", value.flags);
};
export const SymbolNode = ({
  value
}) => {
  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap',
      color: colors.instance
    }
  }, "Symbol(", value.description && /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.meta
    }
  }, JSON.stringify(value.description)), ")");
};
export const OtherNode = ({
  value
}) => {
  const colors = useThemeColors();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.meta
    }
  }, stringify(value));
};
export const MethodCall = ({
  call,
  callsById
}) => {
  // Call might be undefined during initial render, can be safely ignored.
  if (!call) return null;
  const colors = useThemeColors();
  const path = call.path.flatMap((elem, index) => {
    // eslint-disable-next-line no-underscore-dangle
    const callId = elem.__callId__;
    return [callId ? /*#__PURE__*/React.createElement(MethodCall, {
      key: `elem${index}`,
      call: callsById.get(callId),
      callsById: callsById
    }) : /*#__PURE__*/React.createElement("span", {
      key: `elem${index}`
    }, elem), /*#__PURE__*/React.createElement("wbr", {
      key: `wbr${index}`
    }), /*#__PURE__*/React.createElement("span", {
      key: `dot${index}`
    }, ".")];
  });
  const args = call.args.flatMap((arg, index, array) => {
    const node = /*#__PURE__*/React.createElement(Node, {
      key: `node${index}`,
      value: arg,
      callsById: callsById
    });
    return index < array.length - 1 ? [node, /*#__PURE__*/React.createElement("span", {
      key: `comma${index}`
    }, ",\xA0"), /*#__PURE__*/React.createElement("wbr", {
      key: `wbr${index}`
    })] : [node];
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.base
    }
  }, path), /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.method
    }
  }, call.method), /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.base
    }
  }, "(", /*#__PURE__*/React.createElement("wbr", null), args, /*#__PURE__*/React.createElement("wbr", null), ")"));
};