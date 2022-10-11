import "core-js/modules/es.array.reduce.js";
import React from 'react';
import { styled, typography } from '@storybook/theming';
import { Node, MethodCall } from './MethodCall';
const StyledWrapper = styled.div(({
  theme
}) => ({
  backgroundColor: theme.background.content,
  padding: '20px',
  boxShadow: `0 0 0 1px ${theme.appBorderColor}`,
  color: theme.color.defaultText,
  fontFamily: typography.fonts.mono,
  fontSize: typography.size.s1
}));
export default {
  title: 'Addons/Interactions/MethodCall',
  component: MethodCall,
  decorators: [Story => /*#__PURE__*/React.createElement(StyledWrapper, null, /*#__PURE__*/React.createElement(Story, null))],
  parameters: {
    layout: 'fullscreen'
  }
};

class FooBar {}

export const Args = () => /*#__PURE__*/React.createElement("div", {
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
  value: [...Array(23)].map((_, i) => i)
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
    class: class DummyClass {},
    fn: () => 123,
    asyncFn: async () => 'hello'
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
  value: new RegExp(`src(.*)\\.js$`)
}), /*#__PURE__*/React.createElement(Node, {
  value: Symbol()
}), /*#__PURE__*/React.createElement(Node, {
  value: Symbol('Hello world')
}));
const calls = [{
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
const callsById = calls.reduce((acc, call) => {
  acc.set(call.id, call);
  return acc;
}, new Map());
export const Simple = () => /*#__PURE__*/React.createElement(MethodCall, {
  call: callsById.get('1'),
  callsById: callsById
});
export const Nested = () => /*#__PURE__*/React.createElement(MethodCall, {
  call: callsById.get('2'),
  callsById: callsById
});
export const Chained = () => /*#__PURE__*/React.createElement(MethodCall, {
  call: callsById.get('4'),
  callsById: callsById
});
export const Complex = () => /*#__PURE__*/React.createElement(MethodCall, {
  call: callsById.get('8'),
  callsById: callsById
});