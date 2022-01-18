import { JRender as Render, JNode } from "./components";

export { JNode };
export { useRootRender } from "./utils/mixins";
export { useGlobalRender } from "./utils/service";
export * from "./utils/helper";
export * from "./utils/proxy";

// import { useGlobalRender } from "./utils/service";
// import * as helpers from "./utils/helper";
// import * as proxy from "./utils/proxy";

const install = function (Vue) {
  if (install.installed) {
    return;
  }

  Vue.component(Render.name, Render);
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export const JRender = {
  install,
  ...Render,
  // JNode,
  // useRootRender,
  // useGlobalRender,
  // ...helpers,
  // ...proxy,
};
