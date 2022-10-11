import React from 'react';
import { styled, typography } from '@storybook/theming';
import { Node } from './MethodCall';

const getParams = (line, fromIndex = 0) => {
  for (let i = fromIndex, depth = 1; i < line.length; i += 1) {
    if (line[i] === '(') depth += 1;else if (line[i] === ')') depth -= 1;
    if (depth === 0) return line.slice(fromIndex, i);
  }

  return '';
};

const parseValue = value => {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value);
  } catch (e) {
    return value;
  }
};

const StyledExpected = styled.span(({
  theme
}) => ({
  color: theme.color.positive
}));
const StyledReceived = styled.span(({
  theme
}) => ({
  color: theme.color.negative
}));
export const Received = ({
  value,
  parsed
}) => parsed ? /*#__PURE__*/React.createElement(Node, {
  showObjectInspector: true,
  value: value,
  style: {
    color: '#D43900'
  }
}) : /*#__PURE__*/React.createElement(StyledReceived, null, value);
export const Expected = ({
  value,
  parsed
}) => {
  if (parsed) {
    if (typeof value === 'string' && value.startsWith('called with')) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, value);
    }

    return /*#__PURE__*/React.createElement(Node, {
      showObjectInspector: true,
      value: value,
      style: {
        color: '#16B242'
      }
    });
  }

  return /*#__PURE__*/React.createElement(StyledExpected, null, value);
};
export const MatcherResult = ({
  message
}) => {
  const lines = message.split('\n');
  return /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: '8px 10px 8px 30px',
      fontSize: typography.size.s1
    }
  }, lines.flatMap((line, index) => {
    if (line.startsWith('expect(')) {
      const received = getParams(line, 7);
      const remainderIndex = received && 7 + received.length;
      const matcher = received && line.slice(remainderIndex).match(/\.(to|last|nth)[A-Z]\w+\(/);

      if (matcher) {
        const expectedIndex = remainderIndex + matcher.index + matcher[0].length;
        const expected = getParams(line, expectedIndex);

        if (expected) {
          return ['expect(', /*#__PURE__*/React.createElement(Received, {
            key: `received_${received}`,
            value: received
          }), line.slice(remainderIndex, expectedIndex), /*#__PURE__*/React.createElement(Expected, {
            key: `expected_${expected}`,
            value: expected
          }), line.slice(expectedIndex + expected.length), /*#__PURE__*/React.createElement("br", {
            key: `br${index}`
          })];
        }
      }
    }

    if (line.match(/^\s*- /)) {
      return [/*#__PURE__*/React.createElement(Expected, {
        key: line + index,
        value: line
      }), /*#__PURE__*/React.createElement("br", {
        key: `br${index}`
      })];
    }

    if (line.match(/^\s*\+ /)) {
      return [/*#__PURE__*/React.createElement(Received, {
        key: line + index,
        value: line
      }), /*#__PURE__*/React.createElement("br", {
        key: `br${index}`
      })];
    }

    const [, assertionLabel, assertionValue] = line.match(/^(Expected|Received): (.*)$/) || [];

    if (assertionLabel && assertionValue) {
      return assertionLabel === 'Expected' ? ['Expected: ', /*#__PURE__*/React.createElement(Expected, {
        key: line + index,
        value: parseValue(assertionValue),
        parsed: true
      }), /*#__PURE__*/React.createElement("br", {
        key: `br${index}`
      })] : ['Received: ', /*#__PURE__*/React.createElement(Received, {
        key: line + index,
        value: parseValue(assertionValue),
        parsed: true
      }), /*#__PURE__*/React.createElement("br", {
        key: `br${index}`
      })];
    }

    const [, prefix, numberOfCalls] = line.match(/(Expected number|Received number|Number) of calls: (\d+)$/i) || [];

    if (prefix && numberOfCalls) {
      return [`${prefix} of calls: `, /*#__PURE__*/React.createElement(Node, {
        key: line + index,
        value: Number(numberOfCalls)
      }), /*#__PURE__*/React.createElement("br", {
        key: `br${index}`
      })];
    }

    const [, receivedValue] = line.match(/^Received has value: (.+)$/) || [];

    if (receivedValue) {
      return ['Received has value: ', /*#__PURE__*/React.createElement(Node, {
        key: line + index,
        value: parseValue(receivedValue)
      }), /*#__PURE__*/React.createElement("br", {
        key: `br${index}`
      })];
    }

    return [/*#__PURE__*/React.createElement("span", {
      key: line + index
    }, line), /*#__PURE__*/React.createElement("br", {
      key: `br${index}`
    })];
  }));
};