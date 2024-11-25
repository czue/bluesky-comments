import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // This adds a global process.env object
    'process.env': {},
  },
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'BlueskyComments',
      formats: ['iife'],
      fileName: () => 'bluesky-comments.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css')
            return 'bluesky-comments.css';
          return assetInfo.name;
        },
      },
    },
    outDir: '../assets/js/comments',
  },
})
