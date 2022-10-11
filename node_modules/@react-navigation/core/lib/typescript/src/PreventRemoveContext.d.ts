import * as React from 'react';
/**
 * A type of an object that have a route key as an object key
 * and a value whether to prevent that route.
 */
export declare type PreventedRoutes = Record<string, {
    preventRemove: boolean;
}>;
declare const PreventRemoveContext: React.Context<{
    preventedRoutes: PreventedRoutes;
    setPreventRemove: (id: string, routeKey: string, preventRemove: boolean) => void;
} | undefined>;
export default PreventRemoveContext;
