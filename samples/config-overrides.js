const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const path = require("path");

module.exports = function override(config) {
  config.resolve.plugins.forEach((plugin) => {
    if (plugin instanceof ModuleScopePlugin) {
      plugin.allowedFiles.add(path.resolve("./pubnub-keys.json"));
      plugin.allowedFiles.add(path.resolve("../data/users.json"));
      plugin.allowedFiles.add(path.resolve("../data/messages.json"));
      plugin.allowedFiles.add(path.resolve("../data/channels-work.json"));
      plugin.allowedFiles.add(path.resolve("../data/channels-social.json"));
      plugin.allowedFiles.add(path.resolve("../data/channels-direct.json"));
    }
  });

  return config;
};
