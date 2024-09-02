import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api/v1/':'localhost:5000'
    }
  },
  plugins: [react()],
  alias: {
    '/pdf.worker.min.js': 'node_modules/pdfjs-dist/build/pdf.worker.min.js',
  }
})
