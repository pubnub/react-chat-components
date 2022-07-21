/* eslint-disable */
const path = require("path");
/* eslint-enable */

module.exports = {
  stories: ["./stories/**/*.stories.mdx", "./stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config) => {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test(".svg"));
    fileLoaderRule.exclude = /\.svg$/;

    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../"),
    });
    config.module.rules.push({
      test: /\.svg$/,
      enforce: "pre",
      use: ["@svgr/webpack"],
      include: path.resolve(__dirname, "../"),
    });
    return config;
  },
};
