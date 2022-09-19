const path = require("path");

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../stories/**/*.stories.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-scss",
  ],
  framework: "@storybook/react",
  // https://github.com/storybookjs/storybook/issues/14197
  babel: async (options) => ({
    ...options,
    plugins: [["@babel/plugin-proposal-class-properties", { loose: true }]],
  }),
  webpackFinal: async (config) => {
    config.module.rules
      .filter((rule) => rule.test.test(".svg"))
      .forEach((rule) => (rule.exclude = /\.svg$/i));

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
      enforce: "pre",
    });
    return config;
  },
};
