/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "storybook-addon-apollo-client",
    "storybook-addon-mock",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  /** Enable CSS modules in Storybook */
  webpackFinal: async (config) => {
    const cssRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString().includes("css"),
    );
    if (cssRule) {
      const cssModulesRule = {
        test: /\.module\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]",
              },
              importLoaders: 1,
              sourceMap: true,
            },
          },
        ],
      };
      cssRule.exclude = /\.module\.css$/;
      config.module.rules.push(cssModulesRule);
    }
    return config;
  },
};
export default config;
