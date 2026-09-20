import { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { token } = req.query

  const GIRLS_TOKEN = process.env.GIRLS_HUB_TOKEN || 'G_7mA2qX9bV4cK8hP3nF6t'
  const BOYS_TOKEN = process.env.BOYS_HUB_TOKEN || 'B_3xY9k2Lp5vQ8rN4jC7zW'
  const ADMIN_TOKEN = process.env.ADMIN_HUB_TOKEN || 'A_9kE7mX2vQ5pL8rN4jC3zW'

  if (token === GIRLS_TOKEN) {
    res.setHeader('Set-Cookie', 'ecohoops_hub_access=girls; Path=/; Max-Age=2592000; Secure; SameSite=Lax')
    res.redirect(302, '/hub/u15-girls')
    return
  }

  if (token === BOYS_TOKEN) {
    res.setHeader('Set-Cookie', 'ecohoops_hub_access=boys; Path=/; Max-Age=2592000; Secure; SameSite=Lax')
    res.redirect(302, '/hub/u16-boys')
    return
  }

  if (token === ADMIN_TOKEN) {
    res.setHeader('Set-Cookie', 'ecohoops_admin_access=true; Path=/; Max-Age=2592000; Secure; SameSite=Lax')
    res.redirect(302, '/admin')
    return
  }

  // Redirect to an unauthorized view (which triggers the client-side Access Denied state)
  res.redirect(302, '/admin?error=unauthorized')
}
