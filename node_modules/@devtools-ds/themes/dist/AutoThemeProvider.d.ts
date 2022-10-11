import React from "react";
import { ThemeableElement } from "./utils";
/** Determine if the current browser is FireFox */
export declare const isFirefox: () => boolean;
export interface AutoThemeProviderProps extends ThemeableElement<"div"> {
    /** Whether to automatically change the font and background color */
    autoStyle?: boolean;
    /** Any React node children */
    children: React.ReactNode;
}
/**
 * A theme provider that automatically detects a users browser and colorScheme.
 * Themes are set for each component using React Context.
 * It also sets the background color and text color to the correct color.
 */
export declare const AutoThemeProvider: ({ theme: propsTheme, colorScheme: propsColorScheme, autoStyle, children, ...html }: AutoThemeProviderProps) => JSX.Element;
//# sourceMappingURL=AutoThemeProvider.d.ts.map