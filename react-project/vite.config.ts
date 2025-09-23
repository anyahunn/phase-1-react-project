/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { v8Coverage } from '@vitest/coverage-v8'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        'src/main.tsx',
        '**/*.d.ts',
        'vite.config.ts',
        'vitest.config.ts'
      ]
    }
  },
})