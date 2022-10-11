import * as React from 'react';
export declare const SLOT_KEY = "_SLOT_";
interface Props {
    [prop: string]: any;
    /** Children to display within the component */
    children?: React.ReactNode;
}
declare type AnyComponent = React.ComponentType<any>;
declare type SlotIdentifier = AnyComponent | AnyComponent[] | symbol;
interface ComponentMap {
    [name: string]: SlotIdentifier;
}
/**
 * Gets the token to represent the slot on an element
 *
 * @param child - The React component or element you want to get the slot token from
 */
export declare function getSlotToken(child: any): any;
/**
 * Check to see if a child component is an instance of the given slot
 *
 * @param child - The React child component instance to test
 * @param identifier - The React Component or Slot ID (Symbol) to test against
 */
export declare function isSlotOf(child: any, identifier: AnyComponent | symbol): boolean;
/**
 * Forward a ref and make the returned component slottable.
 *
 * @param Component - Same props you give to React.forwardRef
 *
 * @example
 * export const SlottedComponentWithRef = forwardWithSlots<
 *  HTMLDivElement,
 *  ContentCardProps,
 *  SubComponents
 * >((props, ref) => null);
 */
export declare const forwardWithSlots: <RefType, PropType, Slots_1>(Component: React.RefForwardingComponent<RefType, PropType>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<PropType> & React.RefAttributes<RefType>> & Slots_1;
/**
 * Chunk child elements into buckets based on React components.
 * Will also return the rest of the props.
 *
 * @param props - The props to find the slots in. Either in props or children
 * @param componentMapping - A map of slot names to slot components
 * @param omit - A list of props to omit from the final returned props
 *
 * @example
 * const Example = props => {
 *   const { header, body, footer, ...html } = createSlots(props, {
 *     header: Header,
 *     body: Body,
 *     footer: Footer
 *   });
 *
 *   return (
 *     <div>
 *       {header}
 *       {body}
 *       {footer}
 *     </div>
 *   )
 * };
 *
 * // No matter what order given, it displays how we defined it!
 * const Usage = () => (
 *   <Example>
 *     <Footer>by me!</Footer>
 *     <Body>Some Text</Body>
 *     <Header>Title</Header>
 *   </Example>
 * )
 *
 * // or
 *
 * const Usage = () => (
 *   <Example>
 *     <Footer>by me!</Footer>
 *     <Body>Some Text</Body>
 *     <Header>Title</Header>
 *   </Example>
 * )
 */
export declare function createSlots<InputProps extends Props>(props: InputProps, componentMapping: ComponentMap, omit?: (keyof InputProps | string)[]): InputProps;
export {};
//# sourceMappingURL=createSlots.d.ts.map