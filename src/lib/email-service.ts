import { Team, ScheduleEvent, EmailNotification, ParentContact } from '../types'

const NOTIFICATIONS_STORAGE_KEY = 'ecohoops_sent_notifications'

export interface DispatchNotificationParams {
  team: Team
  event?: ScheduleEvent
  eventType: 'event_created' | 'event_updated' | 'event_cancelled' | 'coach_announcement' | 'pre_game_reminder' | 'weather_cancellation' | 'rsvp_nudge'
  customSubject?: string
  customMessage?: string
  changesSummary?: string
  cancellationReason?: string
}

export interface DispatchResult {
  success: boolean
  notification: EmailNotification
  message: string
}

/**
 * Retrieve all sent/simulated email notifications from local storage
 */
export function getSentNotifications(teamId?: string, eventId?: string): EmailNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (!raw) return []
    const all: EmailNotification[] = JSON.parse(raw)
    return all.filter((n) => {
      const matchTeam = !teamId || n.teamId === teamId
      const matchEvent = !eventId || n.eventId === eventId
      return matchTeam && matchEvent
    })
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
 * Completely clear dispatched notification history
 */
export function clearSentNotifications() {
  try {
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY)
  } catch (err) {
    console.error('Failed to clear notifications', err)
  }
}

/**
 * Generate formatted HTML template for EcoHoops team emails
 */
export function generateEmailHtml(params: DispatchNotificationParams): { subject: string; body: string } {
  const { team, event, eventType, customSubject, customMessage, changesSummary, cancellationReason } = params

  const teamName = `${team.name} (${team.season})`
  let subject = customSubject || ''
  let headerBadge = 'Team Notification'
  let headerColor = '#97B3D2'

  if (eventType === 'pre_game_reminder') {
    subject = subject || `[EcoHoops ${team.name}] Game Day Prep: ${event?.title} (${event?.date})`
    headerBadge = '🏀 GAME DAY PREPARATION'
    headerColor = '#00D26A'
  } else if (eventType === 'weather_cancellation') {
    subject = subject || `[URGENT - EcoHoops ${team.name}] CANCELLED: ${event?.title} on ${event?.date}`
    headerBadge = '⚠️ URGENT CANCELLATION / WEATHER ALERT'
    headerColor = '#FF3B30'
  } else if (eventType === 'rsvp_nudge') {
    subject = subject || `[EcoHoops ${team.name}] Attendance Check: ${event?.title} (${event?.date})`
    headerBadge = 'RSVP CONFIRMATION NEEDED'
    headerColor = '#FFA800'
  } else if (eventType === 'event_created') {
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

  const mapsUrl = event?.location 
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
    : ''

  const body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060A10; color: #FFFFFF; margin: 0; padding: 24px; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 0 auto; background: #0E1726; border-radius: 18px; border: 1px solid #1E293B; overflow: hidden; }
        .header { background: linear-gradient(135deg, #001c52 0%, #003366 100%); padding: 28px 24px; border-bottom: 1px solid #24354D; text-align: center; }
        .badge { display: inline-block; padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: #060A10; background: ${headerColor}; }
        .title { font-size: 24px; font-weight: 800; margin: 12px 0 4px; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.5px; }
        .subtitle { font-size: 13px; color: #97B3D2; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
        .content { padding: 28px 24px; }
        .alert-box { background: rgba(255, 168, 0, 0.12); border-left: 4px solid #FFA800; padding: 14px 18px; border-radius: 10px; margin-bottom: 22px; font-size: 14px; color: #FFD580; line-height: 1.5; }
        .danger-box { background: rgba(255, 59, 48, 0.15); border-left: 4px solid #FF3B30; padding: 16px 18px; border-radius: 10px; margin-bottom: 22px; font-size: 14px; color: #FFA39E; line-height: 1.5; }
        .card { background: #162234; border: 1px solid #24354D; border-radius: 14px; padding: 20px; margin-bottom: 22px; }
        .card-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 14px; }
        .card-row:last-child { border-bottom: none; }
        .label { color: #8A99AD; }
        .value { color: #FFFFFF; font-weight: 600; text-align: right; }
        .uniform-banner { background: rgba(0, 210, 106, 0.12); border: 1px solid rgba(0, 210, 106, 0.35); border-radius: 12px; padding: 16px; margin-bottom: 20px; }
        .checklist-box { background: #111C2D; border: 1px solid #1E2D44; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 13px; color: #CBD5E1; }
        .btn { display: inline-block; background: #97B3D2; color: #060A10; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(151, 179, 210, 0.3); }
        .footer { background: #060A10; padding: 22px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="badge">${headerBadge}</span>
          <div class="title">${teamName}</div>
          <div class="subtitle">EcoHoops Basketball Club &middot; Player & Parent Notice</div>
        </div>
        
        <div class="content">
          ${eventType === 'weather_cancellation' ? `
            <div class="danger-box">
              <strong style="color: #FF6B6B; font-size: 15px; display: block; margin-bottom: 6px;">⚠️ CANCELLATION NOTICE</strong>
              ${cancellationReason || customMessage || `Due to severe weather / facility permit closure, this event is cancelled for player safety.`}
              <div style="margin-top: 10px; font-size: 12px; color: #E2E8F0;">
                We will inform you as soon as gym availability and makeup schedule options are confirmed.
              </div>
            </div>
          ` : ''}

          ${eventType === 'pre_game_reminder' && event?.uniformColor ? `
            <div class="uniform-banner">
              <div style="font-size: 11px; font-weight: 800; color: #00D26A; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">REQUIRED JERSEY COLOR</div>
              <div style="font-size: 17px; font-weight: 800; color: #FFFFFF;">${event.uniformColor}</div>
              ${event.arrivalNote ? `
                <div style="font-size: 13px; color: #E2E8F0; margin-top: 6px;">
                  ⏱️ <strong>Arrival Buffer:</strong> ${event.arrivalNote}
                </div>
              ` : ''}
            </div>
          ` : ''}

          ${changesSummary ? `<div class="alert-box"><strong>Schedule Change Notice:</strong><br>${changesSummary}</div>` : ''}

          ${customMessage && eventType !== 'weather_cancellation' ? `
            <p style="font-size: 15px; line-height: 1.65; color: #E2E8F0; margin-bottom: 22px;">${customMessage}</p>
          ` : ''}

          ${event ? `
            <div class="card">
              <div style="font-size: 17px; font-weight: 800; color: #97B3D2; margin-bottom: 14px; text-transform: uppercase; border-bottom: 1px solid #24354D; padding-bottom: 8px;">
                ${event.title}
              </div>
              <div class="card-row">
                <span class="label">Date</span>
                <span class="value">${formattedDate}</span>
              </div>
              <div class="card-row">
                <span class="label">Event Time</span>
                <span class="value">${event.time}</span>
              </div>
              <div class="card-row">
                <span class="label">Location</span>
                <span class="value">
                  ${event.location}
                  ${mapsUrl ? `<br><a href="${mapsUrl}" target="_blank" style="color: #97B3D2; font-size: 11px; text-decoration: underline;">Open Google Maps &rarr;</a>` : ''}
                </span>
              </div>
              ${event.arrivalNote && eventType !== 'pre_game_reminder' ? `
              <div class="card-row">
                <span class="label">Arrival Instructions</span>
                <span class="value" style="color: #97B3D2;">${event.arrivalNote}</span>
              </div>` : ''}
              ${event.uniformColor && eventType !== 'pre_game_reminder' ? `
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

            ${eventType === 'pre_game_reminder' ? `
              <div class="checklist-box">
                <div style="font-weight: 800; color: #97B3D2; text-transform: uppercase; font-size: 11px; margin-bottom: 8px;">PLAYER CHECKLIST FOR TIP-OFF</div>
                <div style="margin-bottom: 5px;">✓ Wilson basketball, water bottle & athletic bag</div>
                <div style="margin-bottom: 5px;">✓ Both jerseys (in case of opponent color clashes)</div>
                <div>✓ Arrive energized, stretched, and ready to compete!</div>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 26px 0 10px;">
              <a href="https://ecohoops.ca/team-portal" class="btn">
                ${eventType === 'rsvp_nudge' ? 'Confirm Player RSVP Now' : 'Open Team Portal & View Schedule'}
              </a>
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 6px 0;"><strong>EcoHoops Basketball Club</strong> &middot; Southwest Mississauga, ON</p>
          <p style="margin: 0;">You are receiving this automated alert because your family is active with the ${team.name} roster.</p>
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
    eventId: event?.id,
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
 * Dispatch a 24-hour pre-game prep digest to parents
 */
export async function dispatchPreGameReminder(
  team: Team,
  event: ScheduleEvent,
  customNote?: string
): Promise<DispatchResult> {
  return dispatchTeamNotification({
    team,
    event,
    eventType: 'pre_game_reminder',
    customMessage: customNote,
  })
}

/**
 * Dispatch an urgent weather or gym cancellation notice to parents
 */
export async function dispatchWeatherCancellation(
  team: Team,
  event: ScheduleEvent,
  cancellationReason: string
): Promise<DispatchResult> {
  return dispatchTeamNotification({
    team,
    event,
    eventType: 'weather_cancellation',
    cancellationReason,
  })
}

/**
 * Dispatch an attendance RSVP confirmation nudge to parents
 */
export async function dispatchRsvpNudge(
  team: Team,
  event: ScheduleEvent,
  customNote?: string
): Promise<DispatchResult> {
  return dispatchTeamNotification({
    team,
    event,
    eventType: 'rsvp_nudge',
    customMessage: customNote,
  })
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
