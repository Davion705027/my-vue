import { extend } from "./utils";

export let activceFffect:ReactiveEffect|null = null;
 // 默认执行一次
 // 执行fn 返回runner 执行runner执行fn  
export function effect(fn,options = {}){
    const _effect = new ReactiveEffect(fn);
    extend(_effect,options)
    _effect.run();
    const runner = _effect.run.bind(_effect)
    runner.effect = _effect // stop可以通过runnner
    return runner;
}

export class ReactiveEffect{
    constructor(public fn,public scheduler?){

    }

    run(){
        activceFffect = this;
        this.fn()
        activceFffect = null;
    }
}