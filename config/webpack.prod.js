const path = require("path");
const EslintPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function getStyleLoader(pre) {
  return [
    MiniCssExtractPlugin.loader, // 将css提取成单的文件
    "css-loader", // 将css资源编译成commonjs的模块到js中
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", //能解决大多数样式兼容性问题
          ],
        },
      },
    },
    pre,
  ].filter(Boolean);
}

module.exports = {
  // 入口
  entry: "./src/main.js",
  // 输出
  output: {
    // 所有文件的输出路径
    path: path.resolve(__dirname, "../dist"),
    // 入口文件打包输出文件名
    filename: "static/js/main_bundle.js",
    //自动清空上次打包的信息
    // 原理：在打包前，将path整个目录内容情况，再进行打包
    clean: true,
  },
  // 加载器 loader
  module: {
    rules: [
      // loader 配置
      {
        test: /\.css$/, // 只检测.css文件
        use: getStyleLoader(),
      },
      {
        test: /\.less$/, // 只检测.css文件
        // loader: 'xx' 只能使用一个loader
        use: getStyleLoader("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoader("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoader("stylus-loader"),
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            // 小于10kb的图片转base64
            // 优点：减少请求数量 缺点：体积会更大
            maxSize: 10 * 1024, // 10kb
          },
        },
        generator: {
          // 输出图片名称
          // [hash:10] hash值前10位
          // [ext] 扩展名，保留之前文件扩展名
          // [query] 携带其他参数，保留之前文件携带的参数
          filename: "static/images/[hash:10][ext][query]",
        },
      },
      {
        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
        type: "asset/resource", // 不会转base64
        generator: {
          // 输出名称
          filename: "static/media/[hash:10][ext][query]",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules中的js文件
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  // plugin 插件
  plugins: [
    new EslintPlugin({
      // eslint 检测那些文件
      context: path.resolve(__dirname, "../src"),
    }),
    new HTMLWebpackPlugin({
      // 模版，以public/index.html为模版创建新的HTML文件
      // 新的html文件特点 1. 结构和原来一样 2. 自动引入打包输出的资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }),
  ],
  // 模式
  mode: "production",
};
