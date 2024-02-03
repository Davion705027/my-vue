var Reactivity = (function (exports) {
  'use strict';

  /*
   * @FilePath: /my-vue/packages/shared/src/general.ts
   * @Description:
   */
  const isObject = (v) => typeof v === "object" && v !== null;

  const targetMap = new WeakMap();
  let activeEffect;
  function track(target, type, key) {
      //   console.log(activeEffect);
      let depsMap = targetMap.get(target);
      if (!depsMap) {
          targetMap.set(target, (depsMap = new Map()));
      }
      let dep = depsMap.get(key);
      if (!dep) {
          depsMap.set(key, (dep = new Set()));
      }
      dep.add(activeEffect);
      //   console.log(targetMap);
  }
  function trigger(target, key, value) {
      const depsMap = targetMap.get(target);
      if (!depsMap) {
          return;
      }
      const effects = new Set(depsMap.get(key));
      effects.forEach((effect) => {
          effect.run();
          // if (effect.scheduler) {
          //   effect.scheduler();
          // } else {
          //   effect.run();
          // }
      });
  }
  function effect(fn, option) {
      const _effect = new ReactiveEffect(fn);
      if (!option || !option.lazy) {
          _effect.run();
      }
      const runner = _effect.run.bind(_effect);
      runner.effect = _effect;
      return runner;
  }
  class ReactiveEffect {
      constructor(fn) {
          this.fn = fn;
          this.active = true;
      }
      run() {
          activeEffect = this;
          return this.fn();
      }
  }

  /*
   * @FilePath: /my-vue/packages/reactivity/src/baseHandlers.ts
   * @Description:
   */
  class MutableReactiveHandler {
      constructor(_isReadonly = false, _shallow = false) {
          this._isReadonly = _isReadonly;
          this._shallow = _shallow;
      }
      get(target, key, receiver) {
          const isReadonly = this._isReadonly, shallow = this._shallow;
          const res = Reflect.get(target, key, receiver);
          if (!isReadonly) {
              track(target, "get" /* TrackOpTypes.GET */, key);
          }
          if (shallow) {
              return res;
          }
          if (isObject(res)) {
              return isReadonly ? readonly() : reactive(res);
          }
          return res;
      }
      set(target, key, value, receiver) {
          const res = Reflect.set(target, key, value, receiver);
          trigger(target, key);
          return res;
      }
  }
  const mutableHandles = new MutableReactiveHandler();

  const reactiveMap = new WeakMap();
  const shallowReactiveMap = new WeakMap();
  const readonlyMap = new WeakMap();
  const shallowReadonlyMap = new WeakMap();
  const isReadonly = (value) => !!(value && value["__v_isReadonly" /* ReactiveFlags.IS_READONLY */]);
  const isReactive = (value) => !!(value && value["__v_isReactive" /* ReactiveFlags.IS_REACTIVE */]);
  const reactive = (target) => {
      if (isReadonly(target)) {
          return target;
      }
      return createReactiveObject(target, false, mutableHandles, reactiveMap);
  };
  const readonly = (target) => { };
  function createReactiveObject(target, isReadonly, baseHandles, proxyMap) {
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

  exports.ReactiveEffect = ReactiveEffect;
  exports.effect = effect;
  exports.isReactive = isReactive;
  exports.isReadonly = isReadonly;
  exports.reactive = reactive;
  exports.reactiveMap = reactiveMap;
  exports.readonly = readonly;
  exports.readonlyMap = readonlyMap;
  exports.shallowReactiveMap = shallowReactiveMap;
  exports.shallowReadonlyMap = shallowReadonlyMap;
  exports.track = track;
  exports.trigger = trigger;

  return exports;

})({});
//# sourceMappingURL=reactivity.global.js.map
