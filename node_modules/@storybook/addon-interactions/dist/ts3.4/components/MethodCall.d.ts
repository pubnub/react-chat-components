/// <reference types="react" />
import { Call, ElementRef } from '@storybook/instrumenter';
export declare const Node: ({ value, nested, showObjectInspector, callsById, ...props }: {
    [props: string]: any;
    value: any;
    nested?: boolean;
    /**
     * Shows an object inspector instead of just printing the object.
     * Only available for Objects
     */
    showObjectInspector?: boolean;
    callsById?: Map<Call['id'], Call>;
}) => JSX.Element;
export declare const NullNode: (props: object) => JSX.Element;
export declare const UndefinedNode: (props: object) => JSX.Element;
export declare const StringNode: ({ value, ...props }: {
    value: string;
}) => JSX.Element;
export declare const NumberNode: ({ value, ...props }: {
    value: number;
}) => JSX.Element;
export declare const BooleanNode: ({ value, ...props }: {
    value: boolean;
}) => JSX.Element;
export declare const ArrayNode: ({ value, nested }: {
    value: any[];
    nested?: boolean;
}) => JSX.Element;
export declare const ObjectNode: ({ showInspector, value, nested, }: {
    showInspector?: boolean;
    value: object;
    nested?: boolean;
}) => JSX.Element;
export declare const ClassNode: ({ value }: {
    value: Record<string, any>;
}) => JSX.Element;
export declare const FunctionNode: ({ value }: {
    value: Function;
}) => JSX.Element;
export declare const ElementNode: ({ value }: {
    value: ElementRef['__element__'];
}) => JSX.Element;
export declare const DateNode: ({ value }: {
    value: Date;
}) => JSX.Element;
export declare const ErrorNode: ({ value }: {
    value: Error;
}) => JSX.Element;
export declare const RegExpNode: ({ value }: {
    value: RegExp;
}) => JSX.Element;
export declare const SymbolNode: ({ value }: {
    value: symbol;
}) => JSX.Element;
export declare const OtherNode: ({ value }: {
    value: any;
}) => JSX.Element;
export declare const MethodCall: ({ call, callsById, }: {
    call: Call;
    callsById: Map<Call['id'], Call>;
}) => JSX.Element;
