var $3OGu3$react = require("react");
var $3OGu3$emojimart = require("emoji-mart");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $f254ce3fabd6d1c7$export$2e2bcd8739ae039);


function $f254ce3fabd6d1c7$export$2e2bcd8739ae039(props) {
    const ref = $3OGu3$react.useRef(null);
    const instance = $3OGu3$react.useRef(null);
    if (instance.current) instance.current.update(props);
    $3OGu3$react.useEffect(()=>{
        instance.current = new $3OGu3$emojimart.Picker({
            ...props,
            ref: ref
        });
        return ()=>{
            instance.current = null;
        };
    }, []);
    return(/*#__PURE__*/ ($parcel$interopDefault($3OGu3$react)).createElement('div', {
        ref: ref
    }));
}


//# sourceMappingURL=main.js.map
