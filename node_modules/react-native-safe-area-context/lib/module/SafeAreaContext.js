function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { NativeSafeAreaProvider } from './NativeSafeAreaProvider';
const isDev = process.env.NODE_ENV !== 'production';
export const SafeAreaInsetsContext = /*#__PURE__*/React.createContext(null);

if (isDev) {
  SafeAreaInsetsContext.displayName = 'SafeAreaInsetsContext';
}

export const SafeAreaFrameContext = /*#__PURE__*/React.createContext(null);

if (isDev) {
  SafeAreaFrameContext.displayName = 'SafeAreaFrameContext';
}

export function SafeAreaProvider(_ref) {
  var _ref2, _ref3, _initialMetrics$inset, _ref4, _initialMetrics$frame;

  let {
    children,
    initialMetrics,
    initialSafeAreaInsets,
    style,
    ...others
  } = _ref;
  const parentInsets = useParentSafeAreaInsets();
  const parentFrame = useParentSafeAreaFrame();
  const [insets, setInsets] = React.useState((_ref2 = (_ref3 = (_initialMetrics$inset = initialMetrics === null || initialMetrics === void 0 ? void 0 : initialMetrics.insets) !== null && _initialMetrics$inset !== void 0 ? _initialMetrics$inset : initialSafeAreaInsets) !== null && _ref3 !== void 0 ? _ref3 : parentInsets) !== null && _ref2 !== void 0 ? _ref2 : null);
  const [frame, setFrame] = React.useState((_ref4 = (_initialMetrics$frame = initialMetrics === null || initialMetrics === void 0 ? void 0 : initialMetrics.frame) !== null && _initialMetrics$frame !== void 0 ? _initialMetrics$frame : parentFrame) !== null && _ref4 !== void 0 ? _ref4 : {
    // Backwards compat so we render anyway if we don't have frame.
    x: 0,
    y: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  });
  const onInsetsChange = React.useCallback(event => {
    const {
      nativeEvent: {
        frame: nextFrame,
        insets: nextInsets
      }
    } = event;

    if ( // Backwards compat with old native code that won't send frame.
    nextFrame && (nextFrame.height !== frame.height || nextFrame.width !== frame.width || nextFrame.x !== frame.x || nextFrame.y !== frame.y)) {
      setFrame(nextFrame);
    }

    if (!insets || nextInsets.bottom !== insets.bottom || nextInsets.left !== insets.left || nextInsets.right !== insets.right || nextInsets.top !== insets.top) {
      setInsets(nextInsets);
    }
  }, [frame, insets]);
  return /*#__PURE__*/React.createElement(NativeSafeAreaProvider, _extends({
    style: [styles.fill, style],
    onInsetsChange: onInsetsChange
  }, others), insets != null ? /*#__PURE__*/React.createElement(SafeAreaFrameContext.Provider, {
    value: frame
  }, /*#__PURE__*/React.createElement(SafeAreaInsetsContext.Provider, {
    value: insets
  }, children)) : null);
}
const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
});

function useParentSafeAreaInsets() {
  return React.useContext(SafeAreaInsetsContext);
}

function useParentSafeAreaFrame() {
  return React.useContext(SafeAreaFrameContext);
}

const NO_INSETS_ERROR = 'No safe area value available. Make sure you are rendering `<SafeAreaProvider>` at the top of your app.';
export function useSafeAreaInsets() {
  const safeArea = React.useContext(SafeAreaInsetsContext);

  if (safeArea == null) {
    throw new Error(NO_INSETS_ERROR);
  }

  return safeArea;
}
export function useSafeAreaFrame() {
  const frame = React.useContext(SafeAreaFrameContext);

  if (frame == null) {
    throw new Error(NO_INSETS_ERROR);
  }

  return frame;
}
export function withSafeAreaInsets(WrappedComponent) {
  return /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(SafeAreaInsetsContext.Consumer, null, insets => {
    if (insets == null) {
      throw new Error(NO_INSETS_ERROR);
    }

    return /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, props, {
      insets: insets,
      ref: ref
    }));
  }));
}
/**
 * @deprecated
 */

export function useSafeArea() {
  return useSafeAreaInsets();
}
/**
 * @deprecated
 */

export const SafeAreaConsumer = SafeAreaInsetsContext.Consumer;
/**
 * @deprecated
 */

export const SafeAreaContext = SafeAreaInsetsContext;
//# sourceMappingURL=SafeAreaContext.js.map