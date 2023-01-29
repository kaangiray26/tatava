import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path')
const fs = require('fs')

// https://vitejs.dev/config/
export default defineConfig({
    root: path.resolve(__dirname, 'src'),
    server: {
        host: '192.168.178.20',
        port: 8000,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, 'localhost.direct.key')),
            cert: fs.readFileSync(path.resolve(__dirname, 'localhost.direct.crt')),
        },
        hot: true,
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            'peerjs': path.resolve(__dirname, 'node_modules/peerjs'),
            'jsqr': path.resolve(__dirname, 'node_modules/jsqr'),
        }
    }
})
