import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.spec.ts', '**/*.test.ts'],
    },
  },
  resolve: {
    alias: {
      '@zl-ui/utils': resolve(__dirname, '../utils/src/index.ts'),
      '@zl-ui/theme': resolve(__dirname, '../theme/index.css'),
    },
  },
})
