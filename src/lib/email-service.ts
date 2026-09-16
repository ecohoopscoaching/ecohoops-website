import { Team, ScheduleEvent, EmailNotification, ParentContact } from '../types'

const NOTIFICATIONS_STORAGE_KEY = 'ecohoops_sent_notifications'

export interface DispatchNotificationParams {
  team: Team
  event?: ScheduleEvent
  eventType: 'event_created' | 'event_updated' | 'event_cancelled' | 'coach_announcement'
  customSubject?: string
  customMessage?: string
  changesSummary?: string
}

export interface DispatchResult {
  success: boolean
  notification: EmailNotification
  message: string
}

/**
 * Retrieve all sent/simulated email notifications from local storage
 */
export function getSentNotifications(teamId?: string): EmailNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (!raw) return []
    const all: EmailNotification[] = JSON.parse(raw)
    if (teamId) {
      return all.filter((n) => n.teamId === teamId)
    }
    return all
  } catch (err) {
    console.error('Failed to parse notifications from storage', err)
    return []
  }
}

/**
 * Store a newly dispatched notification record
 */
export function recordNotification(notification: EmailNotification) {
  try {
    const existing = getSentNotifications()
    const updated = [notification, ...existing]
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save notification', err)
  }
}

/**
 * Generate formatted HTML template for EcoHoops team emails
 */
export function generateEmailHtml(params: DispatchNotificationParams): { subject: string; body: string } {
  const { team, event, eventType, customSubject, customMessage, changesSummary } = params

  const teamName = `${team.name} (${team.season})`
  let subject = customSubject || ''
  let headerBadge = 'Team Notification'
  let headerColor = '#97B3D2'

  if (eventType === 'event_created') {
    subject = subject || `[EcoHoops ${team.name}] New Event: ${event?.title} on ${event?.date}`
    headerBadge = 'NEW SCHEDULE ADDITION'
    headerColor = '#00D26A'
  } else if (eventType === 'event_updated') {
    subject = subject || `[EcoHoops ${team.name}] Schedule Change: ${event?.title} Updated`
    headerBadge = 'SCHEDULE UPDATE'
    headerColor = '#FFA800'
  } else if (eventType === 'event_cancelled') {
    subject = subject || `[EcoHoops ${team.name}] CANCELLED: ${event?.title}`
    headerBadge = 'CANCELLATION ALERT'
    headerColor = '#FF3B30'
  } else {
    subject = subject || `[EcoHoops ${team.name}] Message from Coach`
    headerBadge = 'TEAM ANNOUNCEMENT'
  }

  const formattedDate = event?.date
    ? new Date(event.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : ''

  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060A10; color: #FFFFFF; margin: 0; padding: 24px; }
        .container { max-width: 600px; margin: 0 auto; background: #0E1726; border-radius: 16px; border: 1px solid #1E293B; overflow: hidden; }
        .header { background: #060A10; padding: 24px; border-bottom: 1px solid #1E293B; text-align: center; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #060A10; background: ${headerColor}; }
        .title { font-size: 22px; font-weight: bold; margin: 12px 0 4px; color: #FFFFFF; }
        .subtitle { font-size: 13px; color: #97B3D2; text-transform: uppercase; letter-spacing: 0.5px; }
        .content { padding: 24px; }
        .alert-box { background: rgba(255, 168, 0, 0.1); border-left: 4px solid #FFA800; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; color: #FFD580; }
        .card { background: #162234; border: 1px solid #24354D; border-radius: 12px; padding: 18px; margin-bottom: 20px; }
        .card-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #24354D; font-size: 14px; }
        .card-row:last-child { border-bottom: none; }
        .label { color: #8A99AD; }
        .value { color: #FFFFFF; font-weight: 600; text-align: right; }
        .btn { display: inline-block; background: #97B3D2; color: #060A10; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; text-transform: uppercase; margin-top: 10px; }
        .footer { background: #060A10; padding: 20px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="badge">${headerBadge}</span>
          <div class="title">${teamName}</div>
          <div class="subtitle">EcoHoops Rep Basketball Program</div>
        </div>
        
        <div class="content">
          ${changesSummary ? `<div class="alert-box"><strong>Notice:</strong> ${changesSummary}</div>` : ''}

          ${customMessage ? `<p style="font-size: 15px; line-height: 1.6; color: #E2E8F0; margin-bottom: 20px;">${customMessage}</p>` : ''}

          ${event ? `
            <div class="card">
              <div style="font-size: 16px; font-weight: bold; color: #97B3D2; margin-bottom: 12px; text-transform: uppercase;">
                ${event.title}
              </div>
              <div class="card-row">
                <span class="label">Date</span>
                <span class="value">${formattedDate}</span>
              </div>
              <div class="card-row">
                <span class="label">Time</span>
                <span class="value">${event.time}</span>
              </div>
              <div class="card-row">
                <span class="label">Location</span>
                <span class="value">${event.location}</span>
              </div>
              ${event.arrivalNote ? `
              <div class="card-row">
                <span class="label">Arrival Instructions</span>
                <span class="value" style="color: #97B3D2;">${event.arrivalNote}</span>
              </div>` : ''}
              ${event.uniformColor ? `
              <div class="card-row">
                <span class="label">Jersey Color</span>
                <span class="value">${event.uniformColor}</span>
              </div>` : ''}
              ${event.notes ? `
              <div class="card-row">
                <span class="label">Coach's Notes</span>
                <span class="value" style="font-weight: normal; color: #CBD5E1;">${event.notes}</span>
              </div>` : ''}
            </div>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://ecohoops.ca/team-portal" class="btn">View in Team Portal & RSVP</a>
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 6px 0;">EcoHoops Basketball Club &middot; Player & Parent Team Section</p>
          <p style="margin: 0;">You are receiving this automated alert because your family is registered with the ${team.name} roster.</p>
        </div>
      </div>
    </body>
    </html>
  `.trim()

  return { subject, body }
}

/**
 * Dispatch notification to parents via serverless API or instant browser fallback
 */
export async function dispatchTeamNotification(
  params: DispatchNotificationParams
): Promise<DispatchResult> {
  const { team, event, eventType, customMessage } = params
  const { subject, body } = generateEmailHtml(params)

  const parentContacts = team.parentContacts || []
  let recipientEmails = parentContacts.map((p) => p.email)

  // Always include fallback parent emails if no parent contacts are listed yet
  if (recipientEmails.length === 0) {
    recipientEmails = ['sarah.jenkins@example.com', 'parents@ecohoops.ca']
  }

  const notificationRecord: EmailNotification = {
    id: 'email-' + Date.now(),
    teamId: team.id,
    teamName: team.name,
    recipientCount: recipientEmails.length,
    recipientEmails,
    subject,
    body,
    sentAt: new Date().toISOString(),
    eventType,
    eventTitle: event?.title || customMessage?.slice(0, 30) || 'Team Announcement',
    status: 'sent'
  }

  try {
    const response = await fetch('/api/send-team-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamId: team.id,
        teamName: team.name,
        recipients: recipientEmails,
        subject,
        html: body
      })
    })

    if (response.ok) {
      notificationRecord.status = 'sent'
    } else {
      notificationRecord.status = 'simulated'
    }
  } catch (err) {
    notificationRecord.status = 'simulated'
  }

  // Save to notification log for audit & parent portal view
  recordNotification(notificationRecord)

  return {
    success: true,
    notification: notificationRecord,
    message: `Notified ${recipientEmails.length} parents for ${team.name}`
  }
}

/**
 * Generate iCalendar (.ics) string for an event so parents can sync it to Google/Apple Calendar
 */
export function generateIcsForEvent(event: ScheduleEvent, teamName: string = 'EcoHoops'): string {
  const dateClean = event.date.replace(/-/g, '')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EcoHoops//Team Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:ecohoops-${event.id}@ecohoops.ca`,
    `DTSTAMP:${dateClean}T000000Z`,
    `DTSTART;VALUE=DATE:${dateClean}`,
    `SUMMARY:[${teamName}] ${event.title}`,
    `DESCRIPTION:${(event.notes || event.title).replace(/\n/g, '\\n')}\\nTime: ${event.time}\\nUniform: ${event.uniformColor || 'Standard'}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}

/**
 * Download an .ics file for a specific event
 */
export function downloadEventIcs(event: ScheduleEvent, teamName?: string) {
  const icsData = generateIcsForEvent(event, teamName)
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export interface WaitlistEmailPayload {
  parentName: string
  email: string
  phone?: string
  ageGroup: string
  groupPreference?: string
  daysAvailable?: string
  neighbourhood?: string
  childCount?: string
}

/**
 * Dispatches automated "We received your waitlist form" confirmation email to the parent
 */
export async function dispatchWaitlistConfirmationEmail(
  payload: WaitlistEmailPayload
): Promise<{ success: boolean; mode?: string }> {
  try {
    const response = await fetch('/api/send-waitlist-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    const auditRecord: EmailNotification = {
      id: 'email-waitlist-' + Date.now(),
      teamId: 'ecohoops-jr-waitlist',
      teamName: 'EcoHoops Jr. (Jr. NBA / WNBA)',
      recipientCount: 1,
      recipientEmails: [payload.email],
      subject: 'We received your waitlist form — EcoHoops Jr. NBA / Jr. WNBA',
      body: `Automated confirmation sent to ${payload.parentName} (${payload.email}) for ${payload.ageGroup}.`,
      sentAt: new Date().toISOString(),
      eventType: 'coach_announcement',
      eventTitle: `Waitlist Form Received: ${payload.parentName}`,
      status: response.ok ? 'sent' : 'simulated',
    }
    recordNotification(auditRecord)

    return { success: true, mode: data.mode || (response.ok ? 'sent' : 'simulated') }
  } catch (err) {
    console.warn('Could not reach /api/send-waitlist-confirmation, logging local audit:', err)
    const auditRecord: EmailNotification = {
      id: 'email-waitlist-' + Date.now(),
      teamId: 'ecohoops-jr-waitlist',
      teamName: 'EcoHoops Jr. (Jr. NBA / WNBA)',
      recipientCount: 1,
      recipientEmails: [payload.email],
      subject: 'We received your waitlist form — EcoHoops Jr. NBA / Jr. WNBA',
      body: `Automated confirmation queued for ${payload.parentName} (${payload.email}) for ${payload.ageGroup}.`,
      sentAt: new Date().toISOString(),
      eventType: 'coach_announcement',
      eventTitle: `Waitlist Form Received: ${payload.parentName}`,
      status: 'simulated',
    }
    recordNotification(auditRecord)
    return { success: true, mode: 'local_fallback' }
  }
}
