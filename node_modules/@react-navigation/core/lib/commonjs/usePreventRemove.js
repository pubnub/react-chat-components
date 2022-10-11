"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = usePreventRemove;

var _nonSecure = require("nanoid/non-secure");

var React = _interopRequireWildcard(require("react"));

var _useLatestCallback = _interopRequireDefault(require("use-latest-callback"));

var _useNavigation = _interopRequireDefault(require("./useNavigation"));

var _usePreventRemoveContext = _interopRequireDefault(require("./usePreventRemoveContext"));

var _useRoute = _interopRequireDefault(require("./useRoute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Hook to prevent screen from being removed. Can be used to prevent users from leaving the screen.
 *
 * @param preventRemove Boolean indicating whether to prevent screen from being removed.
 * @param callback Function which is executed when screen was prevented from being removed.
 */
function usePreventRemove(preventRemove, callback) {
  const [id] = React.useState(() => (0, _nonSecure.nanoid)());
  const navigation = (0, _useNavigation.default)();
  const {
    key: routeKey
  } = (0, _useRoute.default)();
  const {
    setPreventRemove
  } = (0, _usePreventRemoveContext.default)();
  React.useEffect(() => {
    setPreventRemove(id, routeKey, preventRemove);
    return () => {
      setPreventRemove(id, routeKey, false);
    };
  }, [setPreventRemove, id, routeKey, preventRemove]);
  const beforeRemoveListener = (0, _useLatestCallback.default)(e => {
    if (!preventRemove) {
      return;
    }

    e.preventDefault();
    callback({
      data: e.data
    });
  });
  React.useEffect(() => navigation === null || navigation === void 0 ? void 0 : navigation.addListener('beforeRemove', beforeRemoveListener), [navigation, beforeRemoveListener]);
}
//# sourceMappingURL=usePreventRemove.js.map