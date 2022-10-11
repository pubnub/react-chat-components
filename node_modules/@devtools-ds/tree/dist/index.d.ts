import { ReactNode } from "react";
import { ThemeableElement } from "@devtools-ds/themes";
export interface TreeProps extends ThemeableElement<"ul"> {
    /** The label for this node */
    label: string | ReactNode;
    /** Whether this node is open */
    open: boolean;
    /** Whether to add hover styles to children */
    hover: boolean;
    /** Send state updates so parent can track them */
    onUpdate?: (value: boolean) => void;
    /**
     * Called when the given node is selected/focused
     * For nodes w/ children, this is equivalent to them updating their state
     */
    onSelect?: () => void;
}
/** A keyboard accessible expanding tree view. */
export declare const Tree: {
    (props: TreeProps): JSX.Element;
    defaultProps: {
        open: boolean;
        hover: boolean;
    };
};
//# sourceMappingURL=index.d.ts.map