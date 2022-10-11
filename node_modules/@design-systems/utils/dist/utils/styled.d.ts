import * as React from 'react';
export interface DocGen {
    /** The generated docs for the react component */
    __docgenInfo?: {
        /** A description for the component */
        description: string | undefined;
    };
}
export interface Slotted {
    /** The slot the styled element should render in */
    _SLOT_: symbol;
}
interface WrappedComponent {
    /** A className to attach to the root component */
    class?: string;
    /** The name to set as the display name for the component */
    name: string;
    /** A description for documentation tools */
    description?: string;
    /** The slot the styled element should render in */
    slot?: symbol;
}
/**
 * Create a react element with a className attached. The generated element accepts
 * all the same props as the element prop.
 *
 * @param element - The html dom element to create a Component for
 * @param options - The class an metadata to attach to the Component
 *
 * @example
 *
 * const Wrapper = styled('div', {
 *   class: styles.fancy,
 *   description: 'A fancy component',
 *   name: 'FancyWrapper'
 * });
 *
 * const Example = ({ children, ...html }) => {
 *   <Wrapper {...html}>
 *     {children}
 *   </Wrapper>
 * }
 */
export declare function styled<T extends keyof JSX.IntrinsicElements>(element: T | [T, ...((props: any) => React.ReactNode)[]], options: string | WrappedComponent): DocGen & Slotted & React.ForwardRefExoticComponent<React.PropsWithoutRef<React.PropsWithoutRef<JSX.IntrinsicElements[T]> & {
    /** A component to render as instead of a 'div' */
    as?: "symbol" | "object" | "button" | "meter" | "textarea" | "style" | "progress" | "text" | "ruby" | "table" | "small" | "sub" | "circle" | "embed" | "pre" | "caption" | "menu" | "menuitem" | "clipPath" | "filter" | "mask" | "marker" | "big" | "link" | "sup" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "blockquote" | "body" | "br" | "canvas" | "cite" | "code" | "col" | "colgroup" | "data" | "datalist" | "dd" | "del" | "details" | "dfn" | "dialog" | "div" | "dl" | "dt" | "em" | "fieldset" | "figcaption" | "figure" | "footer" | "form" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "head" | "header" | "hgroup" | "hr" | "html" | "i" | "iframe" | "img" | "input" | "ins" | "kbd" | "keygen" | "label" | "legend" | "li" | "main" | "map" | "mark" | "meta" | "nav" | "noindex" | "noscript" | "ol" | "optgroup" | "option" | "output" | "p" | "param" | "picture" | "q" | "rp" | "rt" | "s" | "samp" | "slot" | "script" | "section" | "select" | "source" | "span" | "strong" | "summary" | "template" | "tbody" | "td" | "tfoot" | "th" | "thead" | "time" | "title" | "tr" | "track" | "u" | "ul" | "var" | "video" | "wbr" | "webview" | "svg" | "animate" | "animateMotion" | "animateTransform" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feDropShadow" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "foreignObject" | "g" | "image" | "line" | "linearGradient" | "metadata" | "mpath" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "stop" | "switch" | "textPath" | "tspan" | "use" | "view" | React.ComponentClass<any, any> | React.FunctionComponent<any> | undefined;
}> & React.RefAttributes<HTMLElement>>;
export {};
//# sourceMappingURL=styled.d.ts.map