const os = require("os");
const path = require("path");
const EslintPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// CPU 核数
const threads = os.cpus().length;

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
    filename: "static/js/[name].js",
    // 打包输出其他文件命名
    chunkFilename: "static/js/[name].chunk.js",
    //图片、字体等多媒体通过 type:asset处理资源命名方式
    assetModuleFilename: "static/media/[hash:10][ext][query]",
    //自动清空上次打包的信息
    // 原理：在打包前，将path整个目录内容情况，再进行打包
    clean: true,
  },
  // 加载器 loader
  module: {
    rules: [
      {
        // 每个文件只能被一个loader配置处理
        oneOf: [
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
            // generator: {
            //   // 输出图片名称
            //   // [hash:10] hash值前10位
            //   // [ext] 扩展名，保留之前文件扩展名
            //   // [query] 携带其他参数，保留之前文件携带的参数
            //   filename: "static/images/[hash:10][ext][query]",
            // },
          },
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
            type: "asset/resource", // 不会转base64
            // generator: {
            //   // 输出名称
            //   filename: "static/media/[hash:10][ext][query]",
            // },
          },
          {
            test: /\.js$/,
            exclude: /node_modules/, // 排除node_modules中的js文件
            use: [
              {
                loader: "thread-loader", // 开启多进程
                options: {
                  works: threads, // 进程数
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 开启babel缓存
                  cacheCompression: false, // 关闭缓存文件压缩
                  plugins: [
                    "@babel/plugin-transform-runtime", // 减少代码体积
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // plugin 插件
  plugins: [
    new EslintPlugin({
      // eslint 检测那些文件
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true, // 开启缓存
      cacheLocation: path.relative(
        __dirname,
        "../node_modules/.chache/eslintcache"
      ),
      threads, // 开启多进程和进程数量
    }),
    new HTMLWebpackPlugin({
      // 模版，以public/index.html为模版创建新的HTML文件
      // 新的html文件特点 1. 结构和原来一样 2. 自动引入打包输出的资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].css",
      chunkFilename: "static/css/[name].chunk.css",
    }),
    // new CssMinimizerPlugin(),
    // new TerserPlugin({
    //   parallel: threads, // 开启多进程和设置进程数量
    // }),
  ],
  optimization: {
    // 压缩操作
    minimizer: [
      // 压缩 css
      new CssMinimizerPlugin(),
      // 压缩 js
      new TerserPlugin({
        parallel: threads, // 开启多进程和设置进程数量
      }),
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 代码分割
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`
    }
  },
  // 模式
  mode: "production",
  devtool: "source-map",
};
