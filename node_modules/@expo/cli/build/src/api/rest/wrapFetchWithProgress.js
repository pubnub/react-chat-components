"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.wrapFetchWithProgress = wrapFetchWithProgress;
var Log = _interopRequireWildcard(require("../../log"));
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
function wrapFetchWithProgress(fetch) {
    return async (url, init)=>{
        const res = await fetch(url, init);
        if (res.ok && (init == null ? void 0 : init.onProgress)) {
            const totalDownloadSize = res.headers.get("Content-Length");
            const total = Number(totalDownloadSize);
            if (!totalDownloadSize || isNaN(total) || total < 0) {
                Log.warn('Progress callback not supported for network request because "Content-Length" header missing or invalid in response from URL:', url.toString());
                return res;
            }
            let length = 0;
            res.body.on("data", (chunk)=>{
                length += chunk.length;
                onProgress();
            });
            res.body.on("end", ()=>{
                onProgress();
            });
            const onProgress = ()=>{
                const progress = length / total;
                init.onProgress == null ? void 0 : init.onProgress({
                    progress,
                    total,
                    loaded: length
                });
            };
        }
        return res;
    };
}

//# sourceMappingURL=wrapFetchWithProgress.js.map