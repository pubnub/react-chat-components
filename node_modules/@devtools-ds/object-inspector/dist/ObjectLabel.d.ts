/// <reference types="react" />
import { ThemeableElement } from "@devtools-ds/themes";
import { ResolvedASTNode } from "@devtools-ds/object-parser";
interface ObjectLabelProps extends ThemeableElement<"span"> {
    /** Type of object. */
    ast: ResolvedASTNode;
    /** How many previews to render */
    previewMax: number;
    /** Whether the Object label is open */
    open: boolean;
}
/** Create a styled label for an object, with previews of the object contents. */
export declare const ObjectLabel: {
    (props: ObjectLabelProps): JSX.Element;
    defaultProps: {
        previewMax: number;
        open: boolean;
    };
};
export default ObjectLabel;
//# sourceMappingURL=ObjectLabel.d.ts.map