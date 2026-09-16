import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api-endpoints',
      configureServer(server) {
        server.middlewares.use('/api/send-waitlist-confirmation', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end(JSON.stringify({ error: 'Method Not Allowed' }))
            return
          }
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')
              console.log(`[EcoHoops Dev Server] 🏀 Waitlist confirmation email sent to: ${data.email || 'unknown'} (${data.parentName || 'Parent'})`)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({
                success: true,
                mode: 'local_dev_simulation',
                recipient: data.email,
                message: `Dev confirmation successfully dispatched to ${data.email}`
              }))
            } catch (err: any) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON', message: err.message }))
            }
          })
        })
        server.middlewares.use('/api/send-team-email', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end(JSON.stringify({ error: 'Method Not Allowed' }))
            return
          }
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')
              console.log(`[EcoHoops Dev Server] ✉️ Team email dispatched: ${data.subject} to ${data.recipients?.length || 0} recipients`)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({
                success: true,
                mode: 'local_dev_simulation',
                message: 'Simulated team dispatch'
              }))
            } catch (err: any) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON', message: err.message }))
            }
          })
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})

