const path = require("path");

module.exports = {
  stories: ["./stories/**/*.stories.mdx", "./stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config, { configType }) => {
    const rules = config.module.rules;

    const fileLoaderRule = rules.find((rule) => rule.test.test(".svg"));
    fileLoaderRule.exclude = path.resolve(__dirname, "../src");

    rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../src"),
    });

    rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
      include: path.resolve(__dirname, "../src"),
    });

    return config;
  },
};
