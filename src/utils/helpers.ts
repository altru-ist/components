const isObject = (item: any) =>
  typeof item === "object" && !Array.isArray(item);

/**
 * Merge function to replace Object.assign with deep merging possibility
 */
export const merge = (target: any, source: any, deep = false): any => {
  if (deep || !Object.assign) {
    const isDeep = (prop: any) =>
      isObject(source[prop]) &&
      target !== null &&
      Object.prototype.hasOwnProperty.call(target, prop) &&
      isObject(target[prop]);
    const replaced = Object.getOwnPropertyNames(source)
      .map((prop) => ({
        [prop]: isDeep(prop)
          ? merge(target[prop], source[prop], deep)
          : source[prop],
      }))
      .reduce((a, b) => ({ ...a, ...b }), {});

    return {
      ...target,
      ...replaced,
    };
  } else {
    return Object.assign(target, source);
  }
};
