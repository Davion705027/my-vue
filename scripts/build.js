/*
 * @FilePath: /my-vue/scripts/build.js
 * @Description: 
 */
import { execa } from 'execa'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

// 获取到当前目录
const targets = fs.readdirSync('packages').filter(target => {
    return fs.statSync(`packages/${target}`).isDirectory
})

function runParallel(source, build) {
    const ret = []
    for (const item of source) {
        const p = Promise.resolve().then(() => build(item))
        ret.push(p)
    }
    return Promise.all(ret)
}
runParallel(targets, build)

async function build(target) {
    const pkgDir = path.resolve(`packages/${target}`)
    // const pkg = createRequire(`${pkgDir}/package.json`)
    await execa('rollup', ['-c', '--environment', `TARGET:${target}`], { stdio: 'inherit' })
}