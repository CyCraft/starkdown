/* eslint-disable */

// npm i -D rollup typescript rollup-plugin-dts rollup-plugin-esbuild
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import pkg from './package.json' assert { type: 'json' }

// ------------------------------------------------------------------------------------------
// Builds
// ------------------------------------------------------------------------------------------
/**
 * @param {{ input: string; output: { esm: string; cjs: string } }} options
 */
function esbuildAndDts(options) {
  const { input, output } = options

  if (!output.cjs.endsWith('.cjs')) throw new Error('output.cjs must end with .cjs')
  if (!output.esm.endsWith('.js')) throw new Error('output.esm must end with .js')

  return [
    {
      input,
      output: [
        { file: output.esm, format: 'esm', generatedCode: { constBindings: true } },
        { file: output.cjs, format: 'cjs', generatedCode: { constBindings: true } },
      ],
      plugins: [
        esbuild({
          sourceMap: false,
          target: 'esnext',
          loaders: { '.json': 'json' },
        }),
      ],
    },
    {
      input,
      output: [
        {
          file: output.esm.replace('.js', '.d.ts'),
          format: 'esm',
          generatedCode: { constBindings: true },
        },
        {
          file: output.cjs.replace('.cjs', '.d.cts'),
          format: 'cjs',
          generatedCode: { constBindings: true },
        },
      ],
      plugins: [dts()],
    },
  ]
}

export default [
  ...esbuildAndDts({
    input: 'src/index.ts',
    output: {
      esm: pkg.exports['.'].import.default,
      cjs: pkg.exports['.'].require.default,
    },
  }),
  ...esbuildAndDts({
    input: 'src/parsers/index.ts',
    output: {
      esm: pkg.exports['./parsers'].import.default,
      cjs: pkg.exports['./parsers'].require.default,
    },
  }),
]
