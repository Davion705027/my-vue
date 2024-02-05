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
    active = true;
    deps:Set<ReactiveEffect>[] = [];
    public onStop?:()=>void;
    constructor(public fn,public scheduler?){
    }

    run(){
        activceFffect = this;
        this.fn()
        activceFffect = null;
    }
    
    // 停止收集依赖 需要找到当前effect的deps遍历删除this
    stop(){
        if(!this.active)return
        this.deps.forEach(dep=>{
            dep.delete(this)
        })
        if(this.onStop){
            this.onStop()
        }
        this.active = true
    }
}

export function stop(runner){
    runner.effect.stop(runner)
}