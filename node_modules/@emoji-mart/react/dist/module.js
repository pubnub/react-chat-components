import $4HQTI$react, {useRef as $4HQTI$useRef, useEffect as $4HQTI$useEffect} from "react";
import {Picker as $4HQTI$Picker} from "emoji-mart";



function $c02e6cf130881224$export$2e2bcd8739ae039(props) {
    const ref = $4HQTI$useRef(null);
    const instance = $4HQTI$useRef(null);
    if (instance.current) instance.current.update(props);
    $4HQTI$useEffect(()=>{
        instance.current = new $4HQTI$Picker({
            ...props,
            ref: ref
        });
        return ()=>{
            instance.current = null;
        };
    }, []);
    return(/*#__PURE__*/ $4HQTI$react.createElement('div', {
        ref: ref
    }));
}


export {$c02e6cf130881224$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=module.js.map
