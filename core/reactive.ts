import { activceFffect } from "./effect"

const targetMap = new WeakMap()
export function reactive(target){
    const proxy = new Proxy(target,{
        get(target,key,receiver){
            const res = Reflect.get(target,key,receiver)
            track(target,key)
            return res
        },
        set(target,key,value,receiver){
            const res = Reflect.set(target,key,value,receiver)
            trigger(target,key)
            return res
        },
    })
    return proxy;
}

export function track(target,key){
    let depsMap = targetMap.get(target)
    if(!depsMap){
        depsMap = new Map()
        targetMap.set(target,depsMap)
    }
    let dep = depsMap.get(key)
    if(!dep){
        dep = new Set()
        depsMap.set(key,dep)
    }
    if(!activceFffect)return
    dep.add(activceFffect)
}
export function trigger(target,key){
    const depsMap = targetMap.get(target)
    if(!depsMap) return
    const deps = depsMap.get(key)
    
    deps.forEach(fn=>{
        fn()
    })
}