const path = require("path");
const EslintPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口
  entry: "./src/main.js",
  // 输出
  output: {
    // 所有文件的输出路径
    // 开发模式没有输出
    path: undefined,
    // 入口文件打包输出文件名
    filename: "static/js/main_bundle.js",
    //自动清空上次打包的信息
    // 原理：在打包前，将path整个目录内容情况，再进行打包
  },
  // 加载器 loader
  module: {
    rules: [
      // loader 配置
      {
        test: /\.css$/, // 只检测.css文件
        use: [
          // 执行顺序，从右到左，从上到下
          "style-loader", // 将js中css通过创建style标签添加html文件中生效
          "css-loader", // 将css资源编译成commonjs的模块到js中
        ],
      },
      {
        test: /\.less$/, // 只检测.css文件
        // loader: 'xx' 只能使用一个loader
        use: [
          "style-loader",
          "css-loader",
          "less-loader", // 将less编译成css
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader", // 将sass编译成css文件
        ],
      },
      {
        test: /\.styl$/,
        use: [
          "style-loader",
          "css-loader",
          "stylus-loader", // 将stylus编译成css文件
        ],
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
  ],
  // 开发服务器
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3001", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
  },
  // 模式
  mode: "development",
};
