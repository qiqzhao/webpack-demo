import "./css/iconfont.css";
import "./css/index.css";
import sum from "./js/sum";
import "./less/index.less";
import "./scss/index.scss";
import "./stylus/index.styl";

console.log("hello webpack");

console.log(sum(1, 2, 3, 4, 5));

document.getElementById("btn").onclick = function () {
  /* eslint-disable-next-line import/first */
  import(/* webpackChunkName: "math" */"./js/math").then(({ mul }) => {
    console.log(mul(2, 3));
  });
};

if (module.hot) {
  module.hot.accept("./js/sum");
}
