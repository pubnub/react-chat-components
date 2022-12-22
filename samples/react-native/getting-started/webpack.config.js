// eslint-disable-next-line
const createExpoWebpackConfigAsync = require("@expo/webpack-config");
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const webpack = require("webpack");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  config.resolve.alias["@pubnub/react-native-chat-components$"] =
    "@pubnub/react-native-chat-components/dist/index";
  // config.resolve.alias["react-native$"] = "react-native-web";
  // console.log("config.module.rules", config)

  // config.module.rules.push({
  //   test: /\.m?js$/,
  //   use: "babel-loader",
  // });

  // config.plugins.push(
  //   new webpack.DefinePlugin({
  //     "process.env.NODE_ENV": "Hello",
  //   })
  // );

  return config;
};
