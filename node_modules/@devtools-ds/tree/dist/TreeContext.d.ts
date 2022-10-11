import React from 'react';
interface TreeContext {
    /** Whether the current tree is a child of another */
    isChild: boolean;
    /** Depth of current node */
    depth: number;
    /** Whether to have hover styles */
    hasHover: boolean;
}
declare const TreeContext: React.Context<TreeContext>;
export default TreeContext;
//# sourceMappingURL=TreeContext.d.ts.map