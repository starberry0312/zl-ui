import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        button: resolve(__dirname, 'src/button/index.ts'),
        message: resolve(__dirname, 'src/message/index.ts'),
        upload: resolve(__dirname, 'src/upload/index.ts'),
        autocomplete: resolve(__dirname, 'src/autocomplete/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@zl-ui/utils', '@zl-ui/theme', '@vueuse/core'],
      output: {
        globals: {
          vue: 'Vue',
        },
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'styles/[name][extname]',
      },
    },
    sourcemap: true,
  },
})
