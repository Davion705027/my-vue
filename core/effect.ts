export let activceFffect = null;
export function effect(fn,options = {}){
    activceFffect = fn;
    fn();
    activceFffect = null;
}