"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _externalModule = require("./ExternalModule");
class NgrokResolver extends _externalModule.ExternalModule {
    constructor(projectRoot){
        super(projectRoot, {
            name: "@expo/ngrok",
            versionRange: "^4.1.0"
        }, (packageName)=>`The package ${packageName} is required to use tunnels, would you like to install it globally?`
        );
    }
}
exports.NgrokResolver = NgrokResolver;

//# sourceMappingURL=NgrokResolver.js.map