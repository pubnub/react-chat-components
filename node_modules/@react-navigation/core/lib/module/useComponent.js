import * as React from 'react';

const NavigationContent = _ref => {
  let {
    render,
    children
  } = _ref;
  return render(children);
};

export default function useComponent(render) {
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