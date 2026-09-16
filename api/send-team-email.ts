// Vercel Serverless Function: /api/send-team-email
// Dispatches automated HTML emails to parents via Resend API or logs simulation

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { teamId, teamName, recipients, subject, html } = req.body || {}

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid recipients array' })
    }

    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      // Live production dispatch via Resend REST API
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'EcoHoops Coaching <notifications@ecohoops.ca>',
          to: recipients,
          subject: subject || `[EcoHoops ${teamName}] Schedule Notification`,
          html: html
        })
      })

      const data = await resendResponse.json()
      if (!resendResponse.ok) {
        console.error('Resend API returned error:', data)
        return res.status(502).json({ error: 'Failed sending via Resend', details: data })
      }

      return res.status(200).json({
        success: true,
        mode: 'live',
        provider: 'resend',
        deliveryId: data.id,
        recipientCount: recipients.length
      })
    }

    // Transparent simulation fallback when RESEND_API_KEY is not yet added in Vercel
    console.log(`[SIMULATED EMAIL DISPATCH] To: ${recipients.join(', ')} | Subject: ${subject}`)
    return res.status(200).json({
      success: true,
      mode: 'simulated',
      message: `Simulated dispatch to ${recipients.length} recipients for team ${teamName || teamId}`,
      recipients
    })
  } catch (err: any) {
    console.error('Error handling /api/send-team-email:', err)
    return res.status(500).json({ error: 'Internal server error', message: err.message })
  }
}
