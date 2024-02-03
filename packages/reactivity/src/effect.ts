/*
 * @FilePath: /my-vue/packages/reactivity/src/effect.ts
 * @Description:
 */
import { Target } from ".";
import { TrackOpTypes } from "./operations";

const targetMap = new WeakMap();

let activeEffect: ReactiveEffect;
export function track(target: Target, type: TrackOpTypes, key: unknown) {
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
export function trigger(target: Target, key: unknown, value: any) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects: Set<ReactiveEffect> = new Set(depsMap.get(key));
  effects.forEach((effect) => {
    effect.run();
    // if (effect.scheduler) {
    //   effect.scheduler();
    // } else {
    //   effect.run();
    // }
  });
}

interface ReactiveEffectOptions {
  lazy?: boolean;
  scheduler?: Function;
}
export function effect(fn: Function, option: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn);
  if (!option || !option.lazy) {
    _effect.run();
  }

  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner;
  runner.effect = _effect;
  return runner;
}

export interface ReactiveEffectRunner<T = any> {
  (): T;
  effect: ReactiveEffect;
}

export class ReactiveEffect<T = any> {
  active = true;
  constructor(public fn: Function) {}
  run() {
    activeEffect = this;
    return this.fn();
  }
}
