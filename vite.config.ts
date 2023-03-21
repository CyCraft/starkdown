import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  build: {
    lib: {
      formats: ['cjs','es','iife','umd'],
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'starkdown',
      // the proper extensions will be added
      fileName: 'starkdown',
    },
    rollupOptions: {
      treeshake: true,
    },
  },
  test: {
  }
})
