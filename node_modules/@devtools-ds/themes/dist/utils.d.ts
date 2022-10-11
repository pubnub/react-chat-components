import React from "react";
import { Element } from "@design-systems/utils";
export declare const colorSchemes: readonly ["light", "dark"];
export declare type ColorScheme = typeof colorSchemes[number];
export declare const themes: readonly ["chrome", "firefox"];
export declare type Theme = typeof themes[number];
/**
 * Get all of the props for an HTML element + add the theme props.
 * Used to easily type the rest props of a component and add theming.
 *
 * @example
 * export interface ButtonProps extends ThemeableElement<'button'> {
 *   size?: Sizes;
 * }
 */
export interface Themeable {
    /** Light or Dark mode. */
    colorScheme?: ColorScheme;
    /** Supported browser themes.  */
    theme?: Theme;
}
export declare type ThemeableElement<T extends keyof JSX.IntrinsicElements> = Element<T> & Themeable;
export declare const ThemeContext: React.Context<Themeable>;
/**
 * Determine if the user has a "prefers-color-scheme" mode enabled in their browser.
 * This is helpful for detecting if a user prefers dark mode.
 */
export declare const useDarkMode: () => boolean;
/** A React Context provider for devtools-ds themes */
export declare const ThemeProvider: ({ children, ...value }: React.PropsWithChildren<Themeable>) => JSX.Element;
/**
 * A hook to use the closest theme context.
 *
 * @param props - Current component props
 * @param styles - The css modules for the component
 *
 * @example
 * const { themeClass } = useTheme({ colorScheme, theme }, styles);
 */
export declare const useTheme: (props: Themeable, styles?: Record<string, string>) => {
    currentColorScheme: "light" | "dark";
    currentTheme: "chrome" | "firefox";
    themeClass: string;
};
interface BasicTheme {
    [key: string]: string;
}
interface LightDarkTheme {
    /** The light version of the theme */
    light: BasicTheme;
    /** The dark version of the theme */
    dark: BasicTheme;
}
declare type CustomTheme = BasicTheme | LightDarkTheme;
export declare type ComponentTheme = Required<Record<"chrome", CustomTheme>> & Partial<Record<Theme, CustomTheme>>;
export {};
//# sourceMappingURL=utils.d.ts.map