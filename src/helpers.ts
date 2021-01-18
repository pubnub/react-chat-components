export function setDeep(obj: unknown, path: string[], value: unknown): void {
  path.reduce((a, b, level) => {
    if (typeof a[b] === "undefined" && level < path.length - 1) {
      a[b] = {};
      return a[b];
    }
    if (level === path.length - 1) {
      a[b] = value;
      return value;
    }
    return a[b];
  }, obj);
}

export function mergeDeep<T>(target: T, source: T): T {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object)
      Object.assign(source[key], mergeDeep(target[key], source[key]));
  }

  Object.assign(target || {}, source);
  return target;
}

export function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
