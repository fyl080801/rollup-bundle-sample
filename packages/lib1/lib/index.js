// import Vue from "vue";
// import CompositionApi from "@vue/composition-api";
import { JRender, JNode } from "./components";

export { JRender, JNode };
export { useRootRender } from "./utils/mixins";
export { useGlobalRender } from "./utils/service";
export * from "./utils/helper";
export * from "./utils/proxy";

// import { useGlobalRender } from "./utils/service";
// import * as helpers from "./utils/helper";
// import * as proxy from "./utils/proxy";

// Vue.use(CompositionApi);

const install = function (v) {
  if (install.installed) {
    return;
  }

  v.component(JRender.name, JRender);
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  ...JRender,
};
