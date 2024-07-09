const path = require("path");

module.exports = {
  // 入口
  entry: "./src/main.js",
  // 输出
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  // 加载器 loader
  module: {
    rules: [
      // loader 配置
      {
        test: /\.css/, // 只检测.css文件
        use: [
          // 执行顺序，从右到左，从上到下
          "style-loader", // 将js中css通过创建style标签添加html文件中生效
          "css-loader", // 将css资源编译成commonjs的模块到js中
        ],
      },
    ],
  },
  // plugin 插件
  plugins: [],
  // 模式
  mode: "development",
};
