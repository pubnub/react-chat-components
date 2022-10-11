import { nanoid } from 'nanoid/non-secure';
import * as React from 'react';
import useLatestCallback from 'use-latest-callback';
import NavigationHelpersContext from './NavigationHelpersContext';
import NavigationRouteContext from './NavigationRouteContext';
import PreventRemoveContext from './PreventRemoveContext';

/**
 * Util function to transform map of prevented routes to a simpler object.
 */
const transformPreventedRoutes = preventedRoutesMap => {
  const preventedRoutesToTransform = [...preventedRoutesMap.values()];
  const preventedRoutes = preventedRoutesToTransform.reduce((acc, _ref) => {
    var _acc$routeKey;

    let {
      routeKey,
      preventRemove
    } = _ref;
    acc[routeKey] = {
      preventRemove: ((_acc$routeKey = acc[routeKey]) === null || _acc$routeKey === void 0 ? void 0 : _acc$routeKey.preventRemove) || preventRemove
    };
    return acc;
  }, {});
  return preventedRoutes;
};
/**
 * Component used for managing which routes have to be prevented from removal in native-stack.
 */


export default function PreventRemoveProvider(_ref2) {
  let {
    children
  } = _ref2;
  const [parentId] = React.useState(() => nanoid());
  const [preventedRoutesMap, setPreventedRoutesMap] = React.useState(new Map());
  const navigation = React.useContext(NavigationHelpersContext);
  const route = React.useContext(NavigationRouteContext);
  const preventRemoveContextValue = React.useContext(PreventRemoveContext); // take `setPreventRemove` from parent context - if exist it means we're in a nested context

  const setParentPrevented = preventRemoveContextValue === null || preventRemoveContextValue === void 0 ? void 0 : preventRemoveContextValue.setPreventRemove;
  const setPreventRemove = useLatestCallback((id, routeKey, preventRemove) => {
    if (preventRemove && (navigation == null || navigation !== null && navigation !== void 0 && navigation.getState().routes.every(route => route.key !== routeKey))) {
      throw new Error(`Couldn't find a route with the key ${routeKey}. Is your component inside NavigationContent?`);
    }

    setPreventedRoutesMap(prevPrevented => {
      var _prevPrevented$get, _prevPrevented$get2;

      // values haven't changed - do nothing
      if (routeKey === ((_prevPrevented$get = prevPrevented.get(id)) === null || _prevPrevented$get === void 0 ? void 0 : _prevPrevented$get.routeKey) && preventRemove === ((_prevPrevented$get2 = prevPrevented.get(id)) === null || _prevPrevented$get2 === void 0 ? void 0 : _prevPrevented$get2.preventRemove)) {
        return prevPrevented;
      }

      const nextPrevented = new Map(prevPrevented);

      if (preventRemove) {
        nextPrevented.set(id, {
          routeKey,
          preventRemove
        });
      } else {
        nextPrevented.delete(id);
      }

      return nextPrevented;
    });
  });
  const isPrevented = [...preventedRoutesMap.values()].some(_ref3 => {
    let {
      preventRemove
    } = _ref3;
    return preventRemove;
  });
  React.useEffect(() => {
    if ((route === null || route === void 0 ? void 0 : route.key) !== undefined && setParentPrevented !== undefined) {
      // when route is defined (and setParentPrevented) it means we're in a nested stack
      // route.key then will be the route key of parent
      setParentPrevented(parentId, route.key, isPrevented);
      return () => {
        setParentPrevented(parentId, route.key, false);
      };
    }

    return;
  }, [parentId, isPrevented, route === null || route === void 0 ? void 0 : route.key, setParentPrevented]);
  const value = React.useMemo(() => ({
    setPreventRemove,
    preventedRoutes: transformPreventedRoutes(preventedRoutesMap)
  }), [setPreventRemove, preventedRoutesMap]);
  return /*#__PURE__*/React.createElement(PreventRemoveContext.Provider, {
    value: value
  }, children);
}
//# sourceMappingURL=PreventRemoveProvider.js.map