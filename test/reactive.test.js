import { test, expect }  from "vitest";
import { reactive } from "../core/reactive";
import { effect } from "../core/effect";

test('reactive',()=>{
    let x ;
    let obj = reactive({count:1});
    effect(()=>{
        x = obj.count + 1;
    })
    // reactive
    expect(x).toBe(2);
    obj.count = 5;
    expect(x).toBe(6);
})

test.skip('computed',()=>{
    let d ;
    let obj = reactive({count:1});
    const count = computed(()=>{
        return obj.count + 1;
    })
    effect(()=>{
        d = count.value;
    })
    // reactive
    expect(d).toBe(2);
    obj.count = 5;
    expect(d).toBe(6);
    count.value = 10;
    expect(obj.count).toBe(10);
})