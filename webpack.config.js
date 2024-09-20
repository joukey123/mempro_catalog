import path from "node:path";
import CopyWebpackPlugin from "copy-webpack-plugin";

const cMapsDir = path.join(
  path.dirname(require.resolve("pdfjs-dist/package.json")),
  "cmaps"
);
const standardFontsDir = path.join(
  path.dirname(require.resolve("pdfjs-dist/package.json")),
  "standard_fonts"
);

module.exports = {
  entry: "./src/index.js", // 번들링의 시작점
  output: {
    filename: "bundle.js", // 번들링된 파일의 이름
    path: path.resolve(__dirname, "dist"), // 번들링된 파일의 경로
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: cMapsDir,
          to: "cmaps/",
        },
      ],
    }),
  ],
};
