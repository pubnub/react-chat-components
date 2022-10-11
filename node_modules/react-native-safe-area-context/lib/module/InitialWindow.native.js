var _NativeSafeAreaContex, _NativeSafeAreaContex2;

import NativeSafeAreaContext from './specs/NativeSafeAreaContext';
export const initialWindowMetrics = (_NativeSafeAreaContex = NativeSafeAreaContext === null || NativeSafeAreaContext === void 0 ? void 0 : (_NativeSafeAreaContex2 = NativeSafeAreaContext.getConstants()) === null || _NativeSafeAreaContex2 === void 0 ? void 0 : _NativeSafeAreaContex2.initialWindowMetrics) !== null && _NativeSafeAreaContex !== void 0 ? _NativeSafeAreaContex : null;
/**
 * @deprecated
 */

export const initialWindowSafeAreaInsets = initialWindowMetrics === null || initialWindowMetrics === void 0 ? void 0 : initialWindowMetrics.insets;
//# sourceMappingURL=InitialWindow.native.js.map