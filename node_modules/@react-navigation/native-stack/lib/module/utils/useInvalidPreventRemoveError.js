import { usePreventRemoveContext } from '@react-navigation/native';
import * as React from 'react';
export default function useInvalidPreventRemoveError(descriptors) {
  var _preventedDescriptor$, _preventedDescriptor$2;

  const {
    preventedRoutes
  } = usePreventRemoveContext();
  const preventedRouteKey = Object.keys(preventedRoutes)[0];
  const preventedDescriptor = descriptors[preventedRouteKey];
  const isHeaderBackButtonMenuEnabledOnPreventedScreen = preventedDescriptor === null || preventedDescriptor === void 0 ? void 0 : (_preventedDescriptor$ = preventedDescriptor.options) === null || _preventedDescriptor$ === void 0 ? void 0 : _preventedDescriptor$.headerBackButtonMenuEnabled;
  const preventedRouteName = preventedDescriptor === null || preventedDescriptor === void 0 ? void 0 : (_preventedDescriptor$2 = preventedDescriptor.route) === null || _preventedDescriptor$2 === void 0 ? void 0 : _preventedDescriptor$2.name;
  React.useEffect(() => {
    if (preventedRouteKey != null && isHeaderBackButtonMenuEnabledOnPreventedScreen) {
      const message = `The screen ${preventedRouteName} uses 'usePreventRemove' hook alongside 'headerBackButtonMenuEnabled: true', which is not supported. \n\n` + `Consider removing 'headerBackButtonMenuEnabled: true' from ${preventedRouteName} screen to get rid of this error.`;
      console.error(message);
    }
  }, [preventedRouteKey, isHeaderBackButtonMenuEnabledOnPreventedScreen, preventedRouteName]);
}
//# sourceMappingURL=useInvalidPreventRemoveError.js.map