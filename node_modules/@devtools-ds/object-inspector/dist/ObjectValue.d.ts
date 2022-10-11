/// <reference types="react" />
import { ThemeableElement } from "@devtools-ds/themes";
import { ASTNode } from "@devtools-ds/object-parser";
interface ObjectValueProps extends ThemeableElement<"span"> {
    /** Type of object. */
    ast: ASTNode;
    /** Whether or not to show the key */
    showKey: boolean;
}
/** Display a leaf key-value pair with appropriate styles. */
export declare const ObjectValue: {
    (props: ObjectValueProps): JSX.Element;
    defaultProps: {
        showKey: boolean;
    };
};
export default ObjectValue;
//# sourceMappingURL=ObjectValue.d.ts.map