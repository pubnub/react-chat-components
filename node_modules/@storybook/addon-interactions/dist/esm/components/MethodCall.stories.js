import "regenerator-runtime/runtime.js";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import "core-js/modules/es.array.map.js";
import "core-js/modules/es.regexp.constructor.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.regexp.to-string.js";
import "core-js/modules/es.symbol.js";
import "core-js/modules/es.symbol.description.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.map.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.symbol.iterator.js";
import "core-js/modules/es.array.from.js";
import "core-js/modules/es.array.slice.js";
import "core-js/modules/es.function.name.js";
import "core-js/modules/es.promise.js";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import React from 'react';
import { styled, typography } from '@storybook/theming';
import { Node, MethodCall } from './MethodCall';
var StyledWrapper = styled.div(function (_ref) {
  var theme = _ref.theme;
  return {
    backgroundColor: theme.background.content,
    padding: '20px',
    boxShadow: "0 0 0 1px ".concat(theme.appBorderColor),
    color: theme.color.defaultText,
    fontFamily: typography.fonts.mono,
    fontSize: typography.size.s1
  };
});
export default {
  title: 'Addons/Interactions/MethodCall',
  component: MethodCall,
  decorators: [function (Story) {
    return /*#__PURE__*/React.createElement(StyledWrapper, null, /*#__PURE__*/React.createElement(Story, null));
  }],
  parameters: {
    layout: 'fullscreen'
  }
};

var FooBar = /*#__PURE__*/_createClass(function FooBar() {
  _classCallCheck(this, FooBar);
});

export var Args = function Args() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Node, {
    value: null
  }), /*#__PURE__*/React.createElement(Node, {
    value: undefined
  }), /*#__PURE__*/React.createElement(Node, {
    value: "Hello world"
  }), /*#__PURE__*/React.createElement(Node, {
    value: "https://github.com/storybookjs/storybook/blob/next/README.md"
  }), /*#__PURE__*/React.createElement(Node, {
    value: "012345678901234567890123456789012345678901234567890123456789"
  }), /*#__PURE__*/React.createElement(Node, {
    value: true
  }), /*#__PURE__*/React.createElement(Node, {
    value: false
  }), /*#__PURE__*/React.createElement(Node, {
    value: 12345
  }), /*#__PURE__*/React.createElement(Node, {
    value: ['foo', 1, {
      hello: 'world'
    }]
  }), /*#__PURE__*/React.createElement(Node, {
    value: _toConsumableArray(Array(23)).map(function (_, i) {
      return i;
    })
  }), /*#__PURE__*/React.createElement(Node, {
    value: {
      hello: 'world'
    }
  }), /*#__PURE__*/React.createElement(Node, {
    value: {
      hello: 'world',
      arr: [1, 2, 3],
      more: true
    }
  }), /*#__PURE__*/React.createElement(Node, {
    value: {
      hello: 'world',
      arr: [1, 2, 3],
      more: true
    },
    showObjectInspector: true
  }), /*#__PURE__*/React.createElement(Node, {
    value: {
      hello: 'world',
      arr: [1, 2, 3],
      more: true,
      regex: /regex/,
      class: /*#__PURE__*/_createClass(function DummyClass() {
        _classCallCheck(this, DummyClass);
      }),
      fn: function fn() {
        return 123;
      },
      asyncFn: function () {
        var _asyncFn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", 'hello');

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function asyncFn() {
          return _asyncFn.apply(this, arguments);
        }

        return asyncFn;
      }()
    },
    showObjectInspector: true
  }), /*#__PURE__*/React.createElement(Node, {
    value: new FooBar()
  }), /*#__PURE__*/React.createElement(Node, {
    value: function goFaster() {}
  }), /*#__PURE__*/React.createElement(Node, {
    value: {
      __element__: {
        localName: 'hr'
      }
    }
  }), /*#__PURE__*/React.createElement(Node, {
    value: {
      __element__: {
        localName: 'foo',
        prefix: 'x'
      }
    }
  }), /*#__PURE__*/React.createElement(Node, {
    value: {
      __element__: {
        localName: 'div',
        id: 'foo'
      }
    }
  }), /*#__PURE__*/React.createElement(Node, {
    value: {
      __element__: {
        localName: 'span',
        classNames: ['foo', 'bar']
      }
    }
  }), /*#__PURE__*/React.createElement(Node, {
    value: {
      __element__: {
        localName: 'button',
        innerText: 'Click me'
      }
    }
  }), /*#__PURE__*/React.createElement(Node, {
    value: new Date(Date.UTC(2012, 11, 20, 0, 0, 0))
  }), /*#__PURE__*/React.createElement(Node, {
    value: new Date(1600000000000)
  }), /*#__PURE__*/React.createElement(Node, {
    value: new Date(1600000000123)
  }), /*#__PURE__*/React.createElement(Node, {
    value: new EvalError()
  }), /*#__PURE__*/React.createElement(Node, {
    value: new SyntaxError("Can't do that")
  }), /*#__PURE__*/React.createElement(Node, {
    value: new TypeError("Cannot read property 'foo' of undefined")
  }), /*#__PURE__*/React.createElement(Node, {
    value: new ReferenceError('Invalid left-hand side in assignment')
  }), /*#__PURE__*/React.createElement(Node, {
    value: new Error("XMLHttpRequest cannot load https://example.com. No 'Access-Control-Allow-Origin' header is present on the requested resource.")
  }), /*#__PURE__*/React.createElement(Node, {
    value: /hello/i
  }), /*#__PURE__*/React.createElement(Node, {
    value: new RegExp("src(.*)\\.js$")
  }), /*#__PURE__*/React.createElement(Node, {
    value: Symbol()
  }), /*#__PURE__*/React.createElement(Node, {
    value: Symbol('Hello world')
  }));
};
var calls = [{
  id: '1',
  path: ['screen'],
  method: 'getByText',
  storyId: 'kind--story',
  args: ['Click'],
  interceptable: false,
  retain: false
}, {
  id: '2',
  path: ['userEvent'],
  method: 'click',
  storyId: 'kind--story',
  args: [{
    __callId__: '1'
  }],
  interceptable: true,
  retain: false
}, {
  id: '3',
  path: [],
  method: 'expect',
  storyId: 'kind--story',
  args: [true],
  interceptable: true,
  retain: false
}, {
  id: '4',
  path: [{
    __callId__: '3'
  }, 'not'],
  method: 'toBe',
  storyId: 'kind--story',
  args: [false],
  interceptable: true,
  retain: false
}, {
  id: '5',
  path: ['jest'],
  method: 'fn',
  storyId: 'kind--story',
  args: [function actionHandler() {}],
  interceptable: false,
  retain: false
}, {
  id: '6',
  path: [],
  method: 'expect',
  storyId: 'kind--story',
  args: [{
    __callId__: '5'
  }],
  interceptable: false,
  retain: false
}, {
  id: '7',
  path: ['expect'],
  method: 'stringMatching',
  storyId: 'kind--story',
  args: [/hello/i],
  interceptable: false,
  retain: false
}, {
  id: '8',
  path: [{
    __callId__: '6'
  }, 'not'],
  method: 'toHaveBeenCalledWith',
  storyId: 'kind--story',
  args: [{
    __callId__: '7'
  }, new Error("Cannot read property 'foo' of undefined")],
  interceptable: false,
  retain: false
}];
var callsById = calls.reduce(function (acc, call) {
  acc.set(call.id, call);
  return acc;
}, new Map());
export var Simple = function Simple() {
  return /*#__PURE__*/React.createElement(MethodCall, {
    call: callsById.get('1'),
    callsById: callsById
  });
};
export var Nested = function Nested() {
  return /*#__PURE__*/React.createElement(MethodCall, {
    call: callsById.get('2'),
    callsById: callsById
  });
};
export var Chained = function Chained() {
  return /*#__PURE__*/React.createElement(MethodCall, {
    call: callsById.get('4'),
    callsById: callsById
  });
};
export var Complex = function Complex() {
  return /*#__PURE__*/React.createElement(MethodCall, {
    call: callsById.get('8'),
    callsById: callsById
  });
};