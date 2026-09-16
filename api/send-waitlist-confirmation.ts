// Vercel Serverless Function: /api/send-waitlist-confirmation
// Dispatches automated confirmation HTML email to the parent upon waitlist submission

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const {
      parentName = 'Parent / Guardian',
      email,
      phone = 'Not provided',
      ageGroup = 'Ages 5–6',
      groupPreference = 'Co-ed',
      daysAvailable = 'Flexible',
      neighbourhood = 'Not provided',
      childCount = '1',
    } = req.body || {}

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' })
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanParentName = parentName.trim() || 'Parent / Guardian'
    const cleanAgeGroup = ageGroup.trim()
    const cleanGroupPref = groupPreference.trim()
    const cleanDays = daysAvailable.trim()
    const cleanNeighbourhood = neighbourhood.trim() || 'Not specified'

    const emailSubject = `We received your waitlist form — EcoHoops Jr. NBA / Jr. WNBA`

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background-color: #060A10;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #0E1726;
      border: 1px solid #1E293B;
      border-radius: 20px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #001c52 0%, #003366 100%);
      padding: 32px 24px;
      text-align: center;
      border-bottom: 1px solid #2A3B54;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(151, 179, 210, 0.2);
      border: 1px solid rgba(151, 179, 210, 0.4);
      border-radius: 9999px;
      color: #97B3D2;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
    }
    .title {
      font-size: 26px;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0 0 6px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .subtitle {
      font-size: 14px;
      color: #97B3D2;
      margin: 0;
    }
    .content {
      padding: 32px 24px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 14px;
    }
    .text {
      font-size: 15px;
      line-height: 1.65;
      color: #CBD5E1;
      margin-bottom: 20px;
    }
    .recap-card {
      background: #162234;
      border: 1px solid #24354D;
      border-radius: 14px;
      padding: 20px;
      margin: 24px 0;
    }
    .recap-title {
      font-size: 12px;
      font-weight: 700;
      color: #97B3D2;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 14px;
      border-bottom: 1px solid #24354D;
      padding-bottom: 8px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 9px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 14px;
    }
    .row:last-child {
      border-bottom: none;
    }
    .label {
      color: #8A99AD;
    }
    .value {
      color: #FFFFFF;
      font-weight: 600;
      text-align: right;
    }
    .highlight-box {
      background: rgba(0, 51, 102, 0.35);
      border-left: 4px solid #97B3D2;
      padding: 16px 18px;
      border-radius: 10px;
      margin: 24px 0;
      font-size: 14px;
      line-height: 1.6;
      color: #E2E8F0;
    }
    .signoff {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #1E293B;
    }
    .motto {
      font-size: 17px;
      font-weight: 800;
      color: #FFFFFF;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .team {
      font-size: 13px;
      color: #8A99AD;
      line-height: 1.5;
    }
    .footer {
      background: #060A10;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #64748B;
      border-top: 1px solid #1E293B;
    }
    .footer a {
      color: #97B3D2;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">🏀 EcoHoops Jr. • Jr. NBA & Jr. WNBA</div>
      <h1 class="title">You're On The Waitlist!</h1>
      <p class="subtitle">Confirmation of Waitlist Submission</p>
    </div>

    <div class="content">
      <div class="greeting">Hi ${cleanParentName},</div>
      
      <p class="text">
        Thanks! We received your submission for the <strong>EcoHoops Jr. NBA / Jr. WNBA</strong> program in Southwest Mississauga.
      </p>

      <div class="recap-card">
        <div class="recap-title">Your Submission Details</div>
        <div class="row">
          <span class="label">Parent / Guardian:</span>
          <span class="value">${cleanParentName}</span>
        </div>
        <div class="row">
          <span class="label">Player Age Group:</span>
          <span class="value">${cleanAgeGroup}</span>
        </div>
        <div class="row">
          <span class="label">Group Preference:</span>
          <span class="value">${cleanGroupPref}</span>
        </div>
        <div class="row">
          <span class="label">Days That Could Work:</span>
          <span class="value">${cleanDays}</span>
        </div>
        ${cleanNeighbourhood !== 'Not specified' ? `
        <div class="row">
          <span class="label">Neighbourhood:</span>
          <span class="value">${cleanNeighbourhood}</span>
        </div>` : ''}
        <div class="row">
          <span class="label">Number of Children:</span>
          <span class="value">${childCount}</span>
        </div>
      </div>

      <div class="highlight-box">
        <strong>What happens next?</strong><br>
        We are targeting a mid-October 2026 start in Southwest Mississauga. We will contact you at this email address as soon as program dates, venue permits, and registration officially open so your family gets first priority.
      </div>

      <p class="text">
        Every registered player will receive an official Jr. NBA reversible uniform, Wilson basketball, and full insurance/membership through Canada Basketball and Ontario Basketball.
      </p>

      <p class="text" style="font-weight: 600; color: #FFFFFF;">
        Keep an eye on your email for updates.
      </p>

      <div class="signoff">
        <div class="motto">Kids First, Always.</div>
        <div class="team">
          Coach Adrian & The EcoHoops Coaching Team<br>
          <a href="mailto:ecohoopscoaching@gmail.com" style="color: #97B3D2;">ecohoopscoaching@gmail.com</a> &middot; <a href="https://ecohoops.ca" style="color: #97B3D2;">ecohoops.ca</a>
        </div>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">EcoHoops Basketball Club &middot; Southwest Mississauga, ON</p>
      <p style="margin: 0;">Joining the waitlist provides priority registration updates and does not reserve a confirmed spot until registration completes.</p>
    </div>
  </div>
</body>
</html>
    `.trim()

    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      // 1. Dispatch confirmation to parent
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'EcoHoops Coaching <notifications@ecohoops.ca>',
          to: [cleanEmail],
          reply_to: 'ecohoopscoaching@gmail.com',
          bcc: ['ecohoopscoaching@gmail.com'],
          subject: emailSubject,
          html: htmlContent,
        }),
      })

      const data = await resendResponse.json()
      if (!resendResponse.ok) {
        console.error('Resend API returned error for waitlist confirmation:', data)
        return res.status(200).json({
          success: true,
          mode: 'resend_partial_error',
          details: data,
          recipient: cleanEmail,
        })
      }

      return res.status(200).json({
        success: true,
        mode: 'live',
        provider: 'resend',
        deliveryId: data.id,
        recipient: cleanEmail,
      })
    }

    // Transparent simulation fallback when RESEND_API_KEY is not configured in Vercel
    console.log(`[SIMULATED WAITLIST EMAIL DISPATCH] To: ${cleanEmail} | Subject: ${emailSubject}`)
    return res.status(200).json({
      success: true,
      mode: 'simulated',
      message: `Simulated waitlist confirmation dispatched to ${cleanEmail}`,
      recipient: cleanEmail,
    })
  } catch (err: any) {
    console.error('Error in /api/send-waitlist-confirmation:', err)
    return res.status(500).json({ error: 'Internal server error', message: err.message })
  }
}
