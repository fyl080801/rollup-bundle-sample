import { assignArray, assignObject, isArray, isFunction, isObject, uuid } from "./helper";
import { rawData, compute, GET, SET, REF } from "./inner";

const sortHandlers = (handlers) => {
  const maps = handlers.reduce((target, item) => {
    target[item.name] = item;
    return target;
  }, {});
  const dependencies = handlers.reduce((target, item) => {
    target[item.name] = item.dependencies;
    return target;
  }, {});
  const used = new Set();
  const result = [];

  let keys = Object.keys(dependencies);
  let items;
  let length;

  do {
    length = keys.length;
    items = [];
    keys = keys.filter((k) => {
      if (!dependencies[k].every(Set.prototype.has, used)) {
        return true;
      }
      items.push(k);
    });
    result.push(...items);
    items.forEach(Set.prototype.add, used);
  } while (keys.length && keys.length !== length);

  result.push(...keys);

  return result.map((key) => maps[key]);
};

export const createServiceProvider = () => {
  const services = {
    components: {},
    functional: {},
    beforeBindHandlers: [],
    bindHandlers: [],
    proxy: [],
    dataSource: {},
  };

  const setting = {
    addComponent: (name, type) => {
      if (type !== undefined) {
        services.components[name] = type;
      } else if (name?.name) {
        services.components[name.name] = name;
      }
    },
    addFunction: (name, fx) => {
      if (isFunction(fx)) {
        services.functional[name] = fx;
      }
    },
    onBeforeBind: (handler) => {
      const hook = { name: `BR_${uuid(5)}`, dependencies: [], handler };

      if (isFunction(handler)) {
        services.beforeBindHandlers.push(hook);
      }

      const instance = {
        name: (name) => {
          hook.name = name;
          return instance;
        },
        depend: (name) => {
          if (hook.dependencies.indexOf(name) < 0) {
            hook.dependencies.push(name);
          }
          return instance;
        },
      };

      return instance;
    },
    onBind: (handler) => {
      const hook = { name: `R_${uuid(5)}`, dependencies: [], handler };

      if (isFunction(handler)) {
        services.bindHandlers.push(hook);
      }

      const instance = {
        name: (name) => {
          hook.name = name;
          return instance;
        },
        depend: (name) => {
          if (hook.dependencies.indexOf(name) < 0) {
            hook.dependencies.push(name);
          }
          return instance;
        },
      };

      return instance;
    },
    addProxy: (handler) => {
      if (isFunction(handler)) {
        services.proxy.push(handler);
      }
    },
    addDataSource(type, provider) {
      if (type && isFunction(provider)) {
        services.dataSource[type] = provider;
      }
    },
  };

  const instance = {
    setup: (onSetup) => {
      onSetup(setting);
      return instance;
    },
    getSetting() {
      return setting;
    },
    getServices() {
      return services;
    },
  };

  return instance;
};

export const mergeServices = (...services) => {
  const merged = {
    functional: { SET, GET, REF },
    proxy: [compute],
    beforeBindHandlers: [],
    bindHandlers: [],
    dataSource: {
      default: rawData,
    },
  };

  services.forEach((service) => {
    Object.keys(service || {}).forEach((key) => {
      if (isObject(service[key])) {
        merged[key] = merged[key] || {};
        merged[key] = assignObject(merged[key], service[key]);
      } else if (isArray(service[key])) {
        merged[key] = merged[key] || [];
        merged[key] = assignArray(merged[key], service[key]);
      }
    });
  });

  merged.beforeBindHandlers = sortHandlers(merged.beforeBindHandlers);
  merged.bindHandlers = sortHandlers(merged.bindHandlers);

  return merged;
};

export const globalServiceProvider = createServiceProvider();

export const useGlobalRender = (setting) => {
  globalServiceProvider.setup(setting);
};
