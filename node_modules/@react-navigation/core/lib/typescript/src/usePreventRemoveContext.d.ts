export default function usePreventRemoveContext(): {
    preventedRoutes: import("./PreventRemoveContext").PreventedRoutes;
    setPreventRemove: (id: string, routeKey: string, preventRemove: boolean) => void;
};
