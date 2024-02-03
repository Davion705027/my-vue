/*
 * @FilePath: /my-vue/packages/shared/src/general.ts
 * @Description:
 */
export const isObject = (v: any) => typeof v === "object" && v !== null;
export const extend = Object.assign;
export const isFunction = (v: any) => typeof v === "function";
export const isString = (v: any) => typeof v === "string";
export const isArray = Array.isArray;

export const objectToString = Object.prototype.toString;
export const toTypeString = (value: any) => objectToString.call(value);
export const toRawType = (value: any) => toTypeString(value).slice(8, -1);

export const isPlainObject = (value: any) =>
  toTypeString(value) === "[object Object]";
export const isPromise = (val: any) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
export const isDate = (val: any) => toTypeString(val) === "[object Date]";
export const isRegExp = (val: any) => toTypeString(val) === "[object RegExp]";

export const def = (
  obj: any,
  key: string,
  value: any,
  enumerable: boolean = false
) => {
  Object.defineProperty(obj, key, {
    value,
    enumerable,
    writable: true,
    configurable: true,
  });
};
