import 'reflect-metadata';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// biome-ignore lint/style/noDefaultExport: <required>
export default defineConfig({
  esbuild: false,
  plugins: [
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: false,
          dynamicImport: true,
          decorators: true,
        },
        target: 'es2022',
        transform: {
          decoratorMetadata: true,
          legacyDecorator: false,
        },
        keepClassNames: true,
        externalHelpers: false,
      },
      module: {
        type: 'es6',
      },
      sourceMaps: true,
      isModule: true,
    }),
  ],
  test: {
    environment: 'node',
    globals: true,
    silent: 'passed-only',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./vitest.setEnvvars.ts', './vitest.setup.ts'],
    clearMocks: true,
    testTimeout: 30000,
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.d.ts'],
    },
  },
});
