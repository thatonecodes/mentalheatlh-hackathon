// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        info: resolve(__dirname, 'info/index.html'),
        games: resolve(__dirname, 'games/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        utilities: resolve(__dirname, 'utilities/index.html')
      },
    },
  },
})
