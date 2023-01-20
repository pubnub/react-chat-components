// eslint-disable-next-line
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  config.resolve.alias["@pubnub/react-native-chat-components$"] =
    "@pubnub/react-native-chat-components/dist/commonjs/index.web.js";

  return config;
};
