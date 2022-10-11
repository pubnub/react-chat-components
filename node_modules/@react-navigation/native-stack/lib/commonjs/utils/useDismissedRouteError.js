"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useInvalidPreventRemoveError;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function useInvalidPreventRemoveError(state) {
  var _state$routes$find;

  const [nextDismissedKey, setNextDismissedKey] = React.useState(null);
  const dismissedRouteName = nextDismissedKey ? (_state$routes$find = state.routes.find(route => route.key === nextDismissedKey)) === null || _state$routes$find === void 0 ? void 0 : _state$routes$find.name : null;
  React.useEffect(() => {
    if (dismissedRouteName) {
      const message = `The screen '${dismissedRouteName}' was removed natively but didn't get removed from JS state. ` + `This can happen if the action was prevented in a 'beforeRemove' listener, which is not fully supported in native-stack.\n\n` + `Consider using a 'usePreventRemove' hook with 'headerBackButtonMenuEnabled: false' to prevent users from natively going back multiple screens.`;
      console.error(message);
    }
  }, [dismissedRouteName]);
  return {
    setNextDismissedKey
  };
}
//# sourceMappingURL=useDismissedRouteError.js.map