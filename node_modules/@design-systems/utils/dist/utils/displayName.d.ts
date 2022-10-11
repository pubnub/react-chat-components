/// <reference types="react" />
export interface DisplayNamed {
    /** The name various dev tools should use to display the component */
    displayName?: string;
}
/**
 * Set a displayName on a component. This name is used in various dev tools.
 *
 * @param comp - The component to set the display name on
 * @param name - The display name for the component
 *
 * @example
 * displayName(Component, 'MyCoolComponent');
 */
export declare const displayName: <T extends import("react").ComponentType<{}>>(comp: T, name: string) => T & DisplayNamed;
//# sourceMappingURL=displayName.d.ts.map