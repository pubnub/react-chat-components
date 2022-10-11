import * as React from 'react';
export default function useInvalidPreventRemoveError(state) {
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