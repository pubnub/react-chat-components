import * as React from 'react';
interface PortalProps {
    /** A ref to the portal's container */
    containerRef?: React.MutableRefObject<HTMLElement>;
    /** The content to render in a portal */
    children: React.ReactNode;
}
/**
 * Render an element inside of a portal.
 *
 * @example
 * const Example = () => (
 *   <Portal>
 *     {'I am rendered at the end of the dom'}
 *   </Portal>
 * )
 */
export declare const Portal: React.ForwardRefExoticComponent<PortalProps & React.RefAttributes<HTMLElement>>;
export {};
//# sourceMappingURL=portal.d.ts.map