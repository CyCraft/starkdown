/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  build: {
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      formats: ['cjs', 'es'],
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'starkdown',
      // the proper extensions will be added
      fileName: (type, name) =>
        `${name.includes('parsers') ? 'parsers' : name}.${type === 'cjs' ? 'cjs' : 'js'}`,
    },
    rollupOptions: {
      treeshake: 'smallest',
      output: {
        chunkFileNames: '[format]/[name].js',
        inlineDynamicImports: false,
        compact: true,
        // preserveModules: true,
        manualChunks: (id) => {
          return id.includes('parsers') ? 'parsers' : id.split(/[/\\]/g).at(-1).split('.')[0]
        },
      },
    },
  },
  test: {},
})
