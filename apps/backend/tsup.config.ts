import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/router.ts'],
  format: ['esm'],
  dts: {
    compilerOptions: {
      composite: false,
    },
    exclude: ['src/generated/**'],
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  outDir: 'dist',
});
