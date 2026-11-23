// craco.config.js
const webpack = require("webpack");
const { version: APP_VERSION } = require("./package.json");

// ID unik setiap build (di GitHub Actions pakai commit SHA). Dipakai untuk notifikasi "versi baru tersedia".
const BUILD_ID = `${(process.env.GITHUB_SHA || "local").slice(0, 7)}-${Date.now()}`;

// Tulis build/version.json berisi BUILD_ID (dibaca aplikasi untuk cek update)
class VersionFilePlugin {
  apply(compiler) {
    compiler.hooks.emit.tap("VersionFilePlugin", (compilation) => {
      const json = JSON.stringify({ version: BUILD_ID, appVersion: APP_VERSION, builtAt: new Date().toISOString() });
      compilation.assets["version.json"] = { source: () => json, size: () => json.length };
    });
  }
}

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          __BUILD_ID__: JSON.stringify(BUILD_ID),
          __APP_VERSION__: JSON.stringify(APP_VERSION),
        })
      );
      if (env === "production") webpackConfig.plugins.push(new VersionFilePlugin());

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
