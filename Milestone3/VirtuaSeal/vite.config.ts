import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis',
            },
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:4943',
                changeOrigin: true,
            },
        },
    },
    plugins: [
        vue(),
        environment('all', { prefix: 'CANISTER_' }),
        environment('all', { prefix: 'DFX_' }),
        environment({ BACKEND_CANISTER_ID: '' }),
    ],
});
