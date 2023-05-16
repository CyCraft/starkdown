/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'
export default defineConfig({
  build: {
    minify: false,
    lib: {
      formats: ['cjs', 'es'],
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        parsers: resolve(__dirname, 'src/parsers/index.ts'),
      },
    },
    rollupOptions: {
      // treeshake: 'smallest',
      output: {
        generatedCode: { constBindings: true },
        chunkFileNames: 'chunks/[format]/[name].js',
        manualChunks: (id) =>
          id.includes('/types.ts')
            ? 'index'
            : id.includes('parsers')
            ? 'parsers'
            : id.split(/[/\\]/g).at(-1).split('.')[0],
      },
    },
  },
  test: {},
  plugins: [dts()],
})
