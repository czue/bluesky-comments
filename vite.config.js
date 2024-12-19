import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],
      root: path.resolve(__dirname, 'dev'),
      build: {
        outDir: path.resolve(__dirname, 'dist'),
      },
    };
  } else {
    return {
      plugins: [react(), dts()],
      define: {
        // This adds a global process.env object which prevents errors
        'process.env': {},
      },
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/main.tsx'),
          formats: ['es', 'umd'],
          name: 'BlueskyComments',
          fileName: (format) => `bluesky-comments.${format}.js`,
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'style.css') return 'bluesky-comments.css';
              return assetInfo.name;
            },
          },
        },
        outDir: 'dist',
        sourcemap: true,
      },
    };
  }
});
