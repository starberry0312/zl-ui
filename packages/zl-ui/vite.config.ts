import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ZlUi',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', '@zl-ui/components', '@zl-ui/utils', '@zl-ui/theme'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    sourcemap: true,
  },
})
