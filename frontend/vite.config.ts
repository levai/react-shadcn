import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // 资源公共路径
    base: env.VITE_PUBLIC_BASE || '/',
    plugins: [
      react(),
      tailwindcss(),
      // HTML 环境变量替换插件
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(/%VITE_APP_TITLE%/g, env.VITE_APP_TITLE || 'App')
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5178,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true, // 改变请求头中的 origin，解决跨域问题
          // 后端 API 路径是 /api/v1/xxx，不需要重写路径
          // rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-state': ['zustand'],
            'vendor-utils': ['axios', 'clsx', 'tailwind-merge'],
          },
        },
      },
    },
  }
})
