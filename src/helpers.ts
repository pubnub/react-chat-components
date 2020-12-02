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
