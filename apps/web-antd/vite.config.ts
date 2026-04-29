import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from '@vben/vite-config';

const appRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      resolve: {
        alias: {
          'relation-graph/vue3': resolve(
            appRoot,
            'node_modules/relation-graph/lib/vue3/relation-graph.mjs',
          ),
        },
      },
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
