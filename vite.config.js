import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    // This adds a global process.env object which prevents errors
    'process.env': {},
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.jsx'),
      name: 'BlueskyComments',
      formats: ['es', 'umd'],
      fileName: (format) => `bluesky-comments.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css')
            return 'bluesky-comments.css';
          return assetInfo.name;
        }
      }
    },
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      './CommentSection': path.resolve(__dirname, 'src/CommentSection.jsx')
    }
  }
})
