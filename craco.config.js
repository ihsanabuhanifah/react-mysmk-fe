// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        exclude: /node_modules\/(?!@monaco-editor)/,
        include: /node_modules/,
        type: "javascript/auto",
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-transform-modules-commonjs",
              "@babel/plugin-proposal-private-methods",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-private-property-in-object",
              "@babel/plugin-proposal-logical-assignment-operators"

            ],
          },
        },
      });
      return webpackConfig;
    },
  },
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
