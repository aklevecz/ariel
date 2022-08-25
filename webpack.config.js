const HtmlWebpackPlugin = require("html-webpack-plugin"); //installed via pnpm
const webpack = require("webpack"); //to access built-in plugins
const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename:
      process.env.NODE_ENV === "development"
        ? "[name].js"
        : "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./views/index.html" }),
    new webpack.ProvidePlugin({
      THREE: "three",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
    ],
  },
  resolve: {
    alias: {
      "three/OrbitControls": path.join(
        __dirname,
        "node_modules/three/examples/js/controls/OrbitControls.js"
      ),
      "three/SVGLoader": path.join(
        __dirname,
        "node_modules/three/examples/js/loaders/SVGLoader.js"
      ),
    },
  },
};
