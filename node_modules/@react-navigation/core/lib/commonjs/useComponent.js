"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useComponent;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const NavigationContent = _ref => {
  let {
    render,
    children
  } = _ref;
  return render(children);
};

function useComponent(render) {
  const renderRef = React.useRef(render); // Normally refs shouldn't be mutated in render
  // But we return a component which will be rendered
  // So it's just for immediate consumption

  renderRef.current = render;
  React.useEffect(() => {
    renderRef.current = null;
  });
  return React.useRef(_ref2 => {
    let {
      children
    } = _ref2;
    const render = renderRef.current;

    if (render === null) {
      throw new Error('The returned component must be rendered in the same render phase as the hook.');
    }

    return /*#__PURE__*/React.createElement(NavigationContent, {
      render: render
    }, children);
  }).current;
}
//# sourceMappingURL=useComponent.js.map