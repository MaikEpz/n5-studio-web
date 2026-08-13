import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: './src/test/setup.ts' },
  resolve: {
    alias: {
      '@app': '/src/app',
      '@domain': '/src/domain',
      '@application': '/src/application',
      '@infrastructure': '/src/infrastructure',
      '@features': '/src/features',
      '@shared': '/src/shared',
    },
  },
})
