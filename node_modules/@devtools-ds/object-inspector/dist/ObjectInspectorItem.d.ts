/// <reference types="react" />
import { ResolvedASTNode, ASTNode } from "@devtools-ds/object-parser";
interface ObjectInspectorItemProps {
    /** JSON ast to render in the tree. */
    ast: ASTNode;
    /** The current depth. */
    depth: number;
    /** Depth of the tree that is open at first render. */
    expandLevel: number;
    /** Callback when a particular node in the tree is actively selected */
    onSelect?: (node?: ASTNode | ResolvedASTNode) => void;
}
/** A simple component. */
export declare const ObjectInspectorItem: {
    (props: ObjectInspectorItemProps): JSX.Element;
    defaultProps: {
        expandLevel: number;
        depth: number;
    };
};
export default ObjectInspectorItem;
//# sourceMappingURL=ObjectInspectorItem.d.ts.map