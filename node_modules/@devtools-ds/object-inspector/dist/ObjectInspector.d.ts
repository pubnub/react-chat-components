/// <reference types="react" />
import { SupportedTypes, ASTNode, ResolvedASTNode } from "@devtools-ds/object-parser";
import { ThemeableElement } from "@devtools-ds/themes";
interface ObjectInspectorProps extends Omit<ThemeableElement<"div">, "onSelect"> {
    /** JSON data to render in the tree. */
    data: SupportedTypes;
    /** Depth of the tree that is open at first render. */
    expandLevel: number;
    /** Whether to sort keys like the browsers do. */
    sortKeys: boolean;
    /** Whether to include object Prototypes */
    includePrototypes: boolean;
    /** Callback when a particular node in the tree is actively selected */
    onSelect?: (node?: ASTNode | ResolvedASTNode) => void;
}
/** An emulation of browsers JSON object inspector. */
export declare const ObjectInspector: {
    (props: ObjectInspectorProps): JSX.Element;
    defaultProps: {
        expandLevel: number;
        sortKeys: boolean;
        includePrototypes: boolean;
    };
};
export default ObjectInspector;
//# sourceMappingURL=ObjectInspector.d.ts.map