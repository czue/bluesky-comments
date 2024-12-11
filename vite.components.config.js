import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// this is a duplicate of the main vite config that is necessary to build the components
// for ES modules because they don't allow multiple entry points.

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  build: {
    lib: {
      entry: {
        'CommentSection': path.resolve(__dirname, 'src/CommentSection.tsx'),
        'CommentFilters': path.resolve(__dirname, 'src/CommentFilters.tsx')
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    outDir: 'dist/components',
    sourcemap: true
  }
})
