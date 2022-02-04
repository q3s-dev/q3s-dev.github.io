import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// @ts-ignore
import cleanup from 'rollup-plugin-cleanup'
import { terser } from 'rollup-plugin-terser'


export default [{
  input: '@q3s/core/src/core.js',
  output: { file: '@q3s/core/core.js', format: 'esm' },
  external: ['./external.js'],
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    cleanup({ comments: 'none' })
  ]
}, {
  input: '@q3s/core/src/external.js',
  output: { file: '@q3s/core/external.js', format: 'esm', compact: true },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    commonjs({ include: 'node_modules/**' }),
    cleanup({ comments: 'none' }),
    terser()
  ]
}]
