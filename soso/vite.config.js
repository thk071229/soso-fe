import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. /api로 시작하는 요청 처리
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // 2. /cert로 시작하는 요청 처리 (이게 없으면 404가 뜹니다)
      '/cert': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    }
  }
})