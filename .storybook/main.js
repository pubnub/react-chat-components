const path = require("path");

module.exports = {
  stories: ["./stories/**/*.stories.mdx", "./stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../"),
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: [],
      include: path.resolve(__dirname, "../"),
    });

    return config;
  },
};
