import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  build: {
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      formats: ['cjs','es'],
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'starkdown',
      // the proper extensions will be added
      fileName: (type,name) => `${name}.${type === 'cjs' ? 'cjs' : 'js'}`,
    },
    rollupOptions: {
      treeshake: 'smallest',
      output: {
        inlineDynamicImports: false,
        compact: true,
        preserveModules: true,
      }
    },
  },
  test: {
  }
})
