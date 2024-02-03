import { test, expect }  from "vitest";
import { reactive } from "../core/reactive";
import { effect } from "../core/effect";

test('receiver',()=>{
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