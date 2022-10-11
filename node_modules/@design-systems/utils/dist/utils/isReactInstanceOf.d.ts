import * as React from 'react';
declare type Renderable<Props> = React.ComponentType<Props> | {
    /** a function to render the component */
    render: React.ComponentType<Props>;
};
/**
 * Determine whether a HTML element is an instance of a React component.
 *
 * @param element - Element to check the instance of
 * @param component - The component to check for
 *
 * @example
 * isReactInstanceOf(child, MyComponent)
 */
export declare function isReactInstanceOf<Props>(element: any, component: Renderable<Props>): boolean;
export {};
//# sourceMappingURL=isReactInstanceOf.d.ts.map