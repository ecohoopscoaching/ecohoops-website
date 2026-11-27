import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api-endpoints',
      configureServer(server) {
        server.middlewares.use('/api/auth', (req, res) => {
          const GIRLS_TOKEN = (process.env.GIRLS_HUB_TOKEN || 'G_7mA2qX9bV4cK8hP3nF6t').trim()
          const BOYS_TOKEN = (process.env.BOYS_HUB_TOKEN || 'B_3xY9k2Lp5vQ8rN4jC7zW').trim()
          const ADMIN_TOKEN = (process.env.ADMIN_HUB_TOKEN || 'A_9kE7mX2vQ5pL8rN4jC3zW').trim()

          const GIRLS_PASSCODE = (process.env.GIRLS_HUB_PASSCODE || 'ECOGIRLS').trim().toUpperCase()
          const BOYS_PASSCODE = (process.env.BOYS_HUB_PASSCODE || 'ECOBOYS').trim().toUpperCase()

          res.setHeader('Cache-Control', 'no-store')

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })
            req.on('end', () => {
              let parsedBody: Record<string, unknown> = {}
              try {
                parsedBody = body ? (JSON.parse(body) as Record<string, unknown>) : {}
              } catch {
                parsedBody = {}
              }

              const rawInput = String(parsedBody.passcode ?? parsedBody.code ?? '').trim()
              const normalizedPasscode = rawInput.toUpperCase()

              res.setHeader('Content-Type', 'application/json')

              if (normalizedPasscode === GIRLS_PASSCODE || rawInput === GIRLS_TOKEN) {
                res.setHeader('Set-Cookie', 'ecohoops_hub_access=girls; Path=/; Max-Age=2592000; SameSite=Lax')
                res.statusCode = 200
                res.end(JSON.stringify({ success: true, teamId: 'u15-girls', redirectTo: '/hub/u15-girls' }))
                return
              }

              if (normalizedPasscode === BOYS_PASSCODE || rawInput === BOYS_TOKEN) {
                res.setHeader('Set-Cookie', 'ecohoops_hub_access=boys; Path=/; Max-Age=2592000; SameSite=Lax')
                res.statusCode = 200
                res.end(JSON.stringify({ success: true, teamId: 'u16-boys', redirectTo: '/hub/u16-boys' }))
                return
              }

              if (rawInput === ADMIN_TOKEN) {
                res.setHeader('Set-Cookie', 'ecohoops_admin_access=true; Path=/; Max-Age=2592000; SameSite=Lax')
                res.statusCode = 200
                res.end(JSON.stringify({ success: true, teamId: 'admin', redirectTo: '/admin' }))
                return
              }

              res.statusCode = 401
              res.end(JSON.stringify({
                success: false,
                error: 'Invalid team passcode. Please double-check your code or use your team WhatsApp link.',
              }))
            })
            return
          }

          const url = new URL(req.url || '/', 'http://127.0.0.1')
          const token = (url.searchParams.get('token') || '').trim()
          const code = (url.searchParams.get('code') || '').trim().toUpperCase()

          if (token === GIRLS_TOKEN || (code && code === GIRLS_PASSCODE)) {
            res.setHeader('Set-Cookie', 'ecohoops_hub_access=girls; Path=/; Max-Age=2592000; SameSite=Lax')
            res.statusCode = 302
            res.setHeader('Location', '/hub/u15-girls')
            res.end()
            return
          }

          if (token === BOYS_TOKEN || (code && code === BOYS_PASSCODE)) {
            res.setHeader('Set-Cookie', 'ecohoops_hub_access=boys; Path=/; Max-Age=2592000; SameSite=Lax')
            res.statusCode = 302
            res.setHeader('Location', '/hub/u16-boys')
            res.end()
            return
          }

          if (token === ADMIN_TOKEN) {
            res.setHeader('Set-Cookie', 'ecohoops_admin_access=true; Path=/; Max-Age=2592000; SameSite=Lax')
            res.statusCode = 302
            res.setHeader('Location', '/admin')
            res.end()
            return
          }

          res.statusCode = 302
          res.setHeader('Location', '/hub?error=unauthorized')
          res.end()
        })
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
    host: '127.0.0.1',
    port: parseInt(process.env.PORT || '3000'),
    open: false,
    allowedHosts: true,
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

