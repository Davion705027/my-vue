import { isObject } from "@vue/shared";
import { mutableHandles } from "./baseHandlers";

/*
 * @FilePath: /my-vue/packages/reactivity/src/reactive.ts
 * @Description:
 */
export const enum ReactiveFlags {
  SKIP = "__v_skip",
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  IS_SHALLOW = "__v_isShallow",
  RAW = "__v_raw",
}
export interface Target {
  [ReactiveFlags.SKIP]?: boolean;
  [ReactiveFlags.IS_REACTIVE]?: boolean;
  [ReactiveFlags.IS_READONLY]?: boolean;
  [ReactiveFlags.IS_SHALLOW]?: boolean;
  [ReactiveFlags.RAW]?: any;
}
export const reactiveMap = new WeakMap<Target, any>();
export const shallowReactiveMap = new WeakMap<Target, any>();
export const readonlyMap = new WeakMap<Target, any>();
export const shallowReadonlyMap = new WeakMap<Target, any>();

export const isReadonly = (value: any) =>
  !!(value && (value as Target)[ReactiveFlags.IS_READONLY]);
export const isReactive = (value: any) =>
  !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE]);

export const reactive = (target: object) => {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandles, reactiveMap);
};

export const readonly = (target: object) => {};

function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandles: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  if (!isObject(target)) {
    return target;
  }

  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  const proxy = new Proxy(target, baseHandles);

  proxyMap.set(target, proxy);
  return proxy;
}
