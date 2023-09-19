/*
 * @FilePath: /my-vue/rollup.config.js
 * @Description: 
 */
import process from 'node:process';
import json from '@rollup/plugin-json'
import ts from 'rollup-plugin-typescript2'
import path from 'node:path'
import resolveplugin from '@rollup/plugin-node-resolve'
import { fileURLToPath } from 'url';
import { createRequire } from 'node:module'


const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const __dirname2 = fileURLToPath(new URL('.', import.meta.url))


const target = process.env.TARGET

if (!target) {
    throw new Error('TARGET package must be specified via --environment flag.')
}
console.log('__dirname', __dirname)
const packgesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packgesDir, target)
const name = path.basename(packageDir) // shared reactivity
console.log('name', name)
// console.log('rollup', target)

const resolve = p => path.resolve(packageDir, p)

const pkg = require(`./packages/${target}/package.json`)
// console.log('pkg', pkg.name)

const packageOptions = pkg.buildOptions; // 打包的选项
const outputConfigs = {
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`), // webpack打包用的
        format: `es`
    },
    'cjs': {
        file: resolve(`dist/${name}.cjs.js`), // node使用的
        format: 'cjs'
    },
    'global': {
        file: resolve(`dist/${name}.global.js`), // 全局的
        format: 'iife'
    }
}

function createConfig(format, output) {
    output.name = packageOptions.name
    output.sourcemap = true
    return {
        input: resolve(`src/index.ts`),
        output,
        plugins: [
            json(),
            resolveplugin(),
            ts({
                tsconfig: path.resolve(__dirname, `tsconfig.json`)
            })
        ]
    }
}

export default packageOptions.formats.map(format => createConfig(format, outputConfigs[format]))