var path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "game.js"
  },
  watch: true,
  watchDelay: 500,
  devtool: 'source-map'
}
