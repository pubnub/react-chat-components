"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.downloadExpoGoAsync = downloadExpoGoAsync;
var _getUserState = require("@expo/config/build/getUserState");
var _path = _interopRequireDefault(require("path"));
var _getVersions = require("../api/getVersions");
var _downloadAppAsync = require("./downloadAppAsync");
var _errors = require("./errors");
var _profile = require("./profile");
var _progress = require("./progress");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require("debug")("expo:utils:downloadExpoGo");
const platformSettings = {
    ios: {
        versionsKey: "iosClientUrl",
        getFilePath: (filename)=>_path.default.join((0, _getUserState).getExpoHomeDirectory(), "ios-simulator-app-cache", `${filename}.app`)
        ,
        shouldExtractResults: true
    },
    android: {
        versionsKey: "androidClientUrl",
        getFilePath: (filename)=>_path.default.join((0, _getUserState).getExpoHomeDirectory(), "android-apk-cache", `${filename}.apk`)
        ,
        shouldExtractResults: false
    }
};
async function downloadExpoGoAsync(platform, { url , sdkVersion  }) {
    const { getFilePath , versionsKey , shouldExtractResults  } = platformSettings[platform];
    const bar = (0, _progress).createProgressBar("Downloading the Expo Go app [:bar] :percent :etas", {
        width: 64,
        total: 100,
        clear: true,
        complete: "=",
        incomplete: " "
    });
    if (!url) {
        if (!sdkVersion) {
            throw new _errors.CommandError(`Unable to determine which Expo Go version to install (platform: ${platform})`);
        }
        const { sdkVersions: versions  } = await (0, _getVersions).getVersionsAsync();
        const version = versions[sdkVersion];
        if (!version) {
            throw new _errors.CommandError(`Unable to find a version of Expo Go for SDK ${sdkVersion} (platform: ${platform})`);
        }
        debug(`Installing Expo Go version for SDK ${sdkVersion} at URL: ${version[versionsKey]}`);
        url = version[versionsKey];
    }
    const filename = _path.default.parse(url).name;
    try {
        const outputPath = getFilePath(filename);
        debug(`Downloading Expo Go from "${url}" to "${outputPath}".`);
        debug(`The requested copy of Expo Go might already be cached in: "${(0, _getUserState).getExpoHomeDirectory()}". You can disable the cache with EXPO_NO_CACHE=1`);
        await (0, _profile).profile(_downloadAppAsync.downloadAppAsync)({
            url,
            // Save all encrypted cache data to `~/.expo/expo-go`
            cacheDirectory: "expo-go",
            outputPath,
            extract: shouldExtractResults,
            onProgress ({ progress  }) {
                if (bar) {
                    bar.tick(1, progress);
                }
            }
        });
        return outputPath;
    } finally{
        bar == null ? void 0 : bar.terminate();
    }
}

//# sourceMappingURL=downloadExpoGoAsync.js.map