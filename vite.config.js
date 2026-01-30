import { defineConfig } from 'vite'

export default defineConfig({
  base: '/PDFMerger/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
})
