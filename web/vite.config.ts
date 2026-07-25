import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  console.log(isProduction);

  return {
    root: __dirname,
    cacheDir: '../node_modules/.vite/apps/web',
    base: '/SkyLens',
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        isProduction ? 'https://skylens-proxy.ronishai416.workers.dev' : ''
      ),
    },
    server: {
      port: 4200,
      host: 'localhost',
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 4200,
      host: 'localhost',
    },
    plugins: [react()],
    build: {
      outDir: './build',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    css: {
      postcss: './postcss.config.js',
    },
  };
});
