import { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const GIRLS_TOKEN = (process.env.GIRLS_HUB_TOKEN || 'G_7mA2qX9bV4cK8hP3nF6t').trim()
  const BOYS_TOKEN = (process.env.BOYS_HUB_TOKEN || 'B_3xY9k2Lp5vQ8rN4jC7zW').trim()
  const ADMIN_TOKEN = (process.env.ADMIN_HUB_TOKEN || 'A_9kE7mX2vQ5pL8rN4jC3zW').trim()

  const GIRLS_PASSCODE = (process.env.GIRLS_HUB_PASSCODE || 'ECOGIRLS').trim().toUpperCase()
  const BOYS_PASSCODE = (process.env.BOYS_HUB_PASSCODE || 'ECOBOYS').trim().toUpperCase()

  const hostHeader = String(req.headers.host || '').split(':')[0].toLowerCase()
  const isHttps = req.headers['x-forwarded-proto'] === 'https' || (!hostHeader.includes('localhost') && hostHeader !== '127.0.0.1')
  const domainAttr = hostHeader === 'ecohoops.ca' || hostHeader.endsWith('.ecohoops.ca') ? '; Domain=.ecohoops.ca' : ''
  const secureAttr = isHttps ? '; Secure' : ''
  const cookieFlags = `Path=/; Max-Age=2592000; SameSite=Lax${domainAttr}${secureAttr}`

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')

  if (req.method === 'POST') {
    let parsedBody: Record<string, unknown> = {}
    if (typeof req.body === 'string') {
      try {
        parsedBody = JSON.parse(req.body) as Record<string, unknown>
      } catch {
        parsedBody = {}
      }
    } else if (req.body && typeof req.body === 'object') {
      parsedBody = req.body as Record<string, unknown>
    }

    const rawInput = String(parsedBody.passcode ?? parsedBody.code ?? '').trim()
    const normalizedPasscode = rawInput.toUpperCase()

    if (normalizedPasscode === GIRLS_PASSCODE || rawInput === GIRLS_TOKEN) {
      res.setHeader('Set-Cookie', `ecohoops_hub_access=girls; ${cookieFlags}`)
      res.status(200).json({ success: true, teamId: 'u15-girls', redirectTo: '/hub/u15-girls' })
      return
    }

    if (normalizedPasscode === BOYS_PASSCODE || rawInput === BOYS_TOKEN) {
      res.setHeader('Set-Cookie', `ecohoops_hub_access=boys; ${cookieFlags}`)
      res.status(200).json({ success: true, teamId: 'u16-boys', redirectTo: '/hub/u16-boys' })
      return
    }

    if (rawInput === ADMIN_TOKEN) {
      res.setHeader('Set-Cookie', `ecohoops_admin_access=true; ${cookieFlags}`)
      res.status(200).json({ success: true, teamId: 'admin', redirectTo: '/admin' })
      return
    }

    res.status(401).json({
      success: false,
      error: 'Invalid team passcode. Please double-check your code or use your team WhatsApp link.',
    })
    return
  }

  const rawToken = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token
  const rawCode = Array.isArray(req.query.code) ? req.query.code[0] : req.query.code
  const token = typeof rawToken === 'string' ? rawToken.trim() : ''
  const code = typeof rawCode === 'string' ? rawCode.trim().toUpperCase() : ''

  if (token === GIRLS_TOKEN || (code && code === GIRLS_PASSCODE)) {
    res.setHeader('Set-Cookie', `ecohoops_hub_access=girls; ${cookieFlags}`)
    res.redirect(302, '/hub/u15-girls')
    return
  }

  if (token === BOYS_TOKEN || (code && code === BOYS_PASSCODE)) {
    res.setHeader('Set-Cookie', `ecohoops_hub_access=boys; ${cookieFlags}`)
    res.redirect(302, '/hub/u16-boys')
    return
  }

  if (token === ADMIN_TOKEN) {
    res.setHeader('Set-Cookie', `ecohoops_admin_access=true; ${cookieFlags}`)
    res.redirect(302, '/admin')
    return
  }

  // Redirect to an unauthorized view (which triggers the client-side Access Denied state)
  res.redirect(302, '/hub?error=unauthorized')
}
