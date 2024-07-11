module.exports = {
  presets: [
    // 智能预设，编译js
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", // 按需加载，自动引入
        corejs: 3,
      },
    ],
  ],
};
