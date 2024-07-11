module.exports = {
  extends: ["eslint:recommended"],
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    allowImportExortEverywhere: true,
  },
  plugins: ["import"],
  rules: {
    "no-var": 2, // 不能使用var定义变量
  },
};
