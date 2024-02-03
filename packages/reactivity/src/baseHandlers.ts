/*
 * @FilePath: /my-vue/packages/reactivity/src/baseHandlers.ts
 * @Description:
 */

import { isObject } from "@vue/shared";
import { track, trigger } from "./effect";
import { TrackOpTypes } from "./operations";
import { Target, reactive, readonly } from "./reactive";

class MutableReactiveHandler {
  constructor(
    protected readonly _isReadonly = false,
    protected readonly _shallow = false
  ) {}
  get(target: Target, key: string | symbol, receiver: object) {
    const isReadonly = this._isReadonly,
      shallow = this._shallow;
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key);
    }

    if (shallow) {
      return res;
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  }

  set(target: Target, key: string | symbol, value: any, receiver: object) {
    const res = Reflect.set(target, key, value, receiver);

    trigger(target, key, value);
    return res;
  }
}

export const mutableHandles: ProxyHandler<object> =
  new MutableReactiveHandler();
