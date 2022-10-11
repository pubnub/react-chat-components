"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SafeAreaView = void 0;

var React = _interopRequireWildcard(require("react"));

var _NativeSafeAreaView = _interopRequireDefault(require("./specs/NativeSafeAreaView"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const SafeAreaView = /*#__PURE__*/React.forwardRef((_ref, ref) => {
  let {
    edges,
    ...props
  } = _ref;
  return /*#__PURE__*/React.createElement(_NativeSafeAreaView.default, _extends({}, props, {
    // Codegen doesn't support default values for array types so
    // set it here.
    edges: edges !== null && edges !== void 0 ? edges : ['bottom', 'left', 'right', 'top'],
    ref: ref
  }));
});
exports.SafeAreaView = SafeAreaView;
//# sourceMappingURL=SafeAreaView.js.map