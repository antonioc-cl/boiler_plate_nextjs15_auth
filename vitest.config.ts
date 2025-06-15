/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    pool: 'forks', // Use separate processes for tests to avoid shared state
    sequence: {
      hooks: 'stack',
    },
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/tests/**', // Exclude Playwright tests
      '**/*.spec.ts', // Exclude .spec.ts files (Playwright convention)
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
        '.next/',
        'dist/',
        'coverage/',
        'playwright-report/',
        'emails/components/**',
        'emails/examples/**',
        'emails/translations/**',
        'tests/**',
        'docs/**',
        'specs/**',
        '**/types/**',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/test-utils.tsx',
        '**/setup.ts',
        'lib/db/migrations/**',
        'lib/db/migrate*.ts',
        'app/api/auth/[...all]/route.ts', // Better Auth route handler
        'lib/auth/better-auth.ts', // Configuration file
        'lib/auth/config.ts', // Configuration file
        'sentry.*.config.ts',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
        // Specific thresholds for critical authentication components
        'lib/auth/utils.ts': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        'lib/auth/server.ts': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        'lib/auth/middleware-helpers.ts': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
        'lib/auth/email.ts': {
          branches: 75,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },
      reportsDirectory: './coverage',
      clean: true,
      all: true,
      skipFull: false,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '@/components': fileURLToPath(new URL('./components', import.meta.url)),
      '@/lib': fileURLToPath(new URL('./lib', import.meta.url)),
      '@/hooks': fileURLToPath(new URL('./hooks', import.meta.url)),
      '@/types': fileURLToPath(new URL('./types', import.meta.url)),
      '@/utils': fileURLToPath(new URL('./utils', import.meta.url)),
      '@/styles': fileURLToPath(new URL('./styles', import.meta.url)),
      '@/actions': fileURLToPath(new URL('./actions', import.meta.url)),
      '@/app': fileURLToPath(new URL('./app', import.meta.url)),
      '@/src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
