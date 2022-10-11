function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import NativeSafeAreaView from './specs/NativeSafeAreaView';
export const SafeAreaView = /*#__PURE__*/React.forwardRef((_ref, ref) => {
  let {
    edges,
    ...props
  } = _ref;
  return /*#__PURE__*/React.createElement(NativeSafeAreaView, _extends({}, props, {
    // Codegen doesn't support default values for array types so
    // set it here.
    edges: edges !== null && edges !== void 0 ? edges : ['bottom', 'left', 'right', 'top'],
    ref: ref
  }));
});
//# sourceMappingURL=SafeAreaView.js.map