import { ScheduleEvent } from '../types'

/**
 * Authoritative RFC 5545 iCalendar (.ics) Generator for EcoHoops Team Hubs.
 * 
 * Strict Standards:
 * - Timezone: America/Toronto (Eastern Time)
 * - Explicit VTIMEZONE definitions for both Eastern Standard Time (EST) and Eastern Daylight Time (EDT)
 * - Zero UTC shift — event wall-clock times are strictly preserved in America/Toronto
 * - Strict team separation (U15 Girls vs U16 Boys with shared events in both)
 * - Stable, unique UIDs (editing updates the same event, deleted events are omitted)
 */

interface TimeParseResult {
  isAllDay: boolean
  dtStartLine: string
  dtEndLine: string
  formattedStart: string
  formattedEnd: string
}

/**
 * Escapes characters according to RFC 5545 specification.
 */
function escapeIcsText(text: string): string {
  if (!text) return ''
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/**
 * Folds lines longer than 75 bytes according to RFC 5545 section 3.1.
 */
function foldLine(line: string): string {
  const MAX_BYTES = 75
  const encoder = new TextEncoder()
  const bytes = encoder.encode(line)
  
  if (bytes.length <= MAX_BYTES) {
    return line
  }

  const chunks: string[] = []
  let currentChunk = ''
  let currentByteLen = 0

  for (const char of line) {
    const charBytes = encoder.encode(char).length
    if (currentByteLen + charBytes > (chunks.length === 0 ? MAX_BYTES : MAX_BYTES - 1)) {
      chunks.push(currentChunk)
      currentChunk = ' ' + char
      currentByteLen = 1 + charBytes
    } else {
      currentChunk += char
      currentByteLen += charBytes
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk)
  }

  return chunks.join('\r\n')
}

/**
 * Helper to parse a single time token, e.g. "6:00 PM", "8:15 PM", "10 AM", "14:00"
 */
function parseTimeToken(token: string): { hour: number; minute: number; ampm: string | null } | null {
  const cleaned = token.trim()
  const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i)
  if (!match) return null

  let hour = parseInt(match[1], 10)
  const minute = match[2] ? parseInt(match[2], 10) : 0
  const ampm = match[3] ? match[3].toLowerCase() : null

  return { hour, minute, ampm }
}

/**
 * Formats a 24-hour hour/minute to HHMMSS.
 */
function toHHMMSS(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}00`
}

/**
 * Adds one day to an ISO YYYY-MM-DD date and returns compact YYYYMMDD.
 * Required for RFC 5545 exclusive DTEND on full-day events.
 */
function addOneDayCompact(dateIso: string): string {
  const [y, m, d] = dateIso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + 1))
  const yyyy = dt.getUTCFullYear()
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(dt.getUTCDate()).padStart(2, '0')
  return `${yyyy}${mm}${dd}`
}

/**
 * Parses event time and date into accurate RFC 5545 DTSTART and DTEND lines in America/Toronto.
 */
export function parseEventDateTime(event: ScheduleEvent): TimeParseResult {
  const dateIso = event.date.trim()
  const dateCompact = dateIso.replace(/-/g, '')
  const timeStr = (event.time || '').trim()

  // Detect All-Day Events: "Confirmed Weekend", "TBD", or empty time
  const isExplicitWeekend = timeStr.toLowerCase().includes('weekend') || timeStr.toLowerCase().includes('tbd') || !timeStr
  if (isExplicitWeekend) {
    const endIso = event.endDate ? event.endDate.trim() : dateIso
    const dtEndCompact = addOneDayCompact(endIso)

    return {
      isAllDay: true,
      dtStartLine: `DTSTART;VALUE=DATE:${dateCompact}`,
      dtEndLine: `DTEND;VALUE=DATE:${dtEndCompact}`,
      formattedStart: `${dateIso} (All Day)`,
      formattedEnd: `${endIso} (All Day)`
    }
  }

  // Split time range by en-dash, em-dash, or hyphen
  const parts = timeStr.split(/[–—\-]/).map(s => s.trim())
  const p1 = parseTimeToken(parts[0])
  const p2 = parts[1] ? parseTimeToken(parts[1]) : null

  if (!p1) {
    // Fallback to all-day event if time string cannot be parsed
    const dtEndCompact = addOneDayCompact(dateIso)
    return {
      isAllDay: true,
      dtStartLine: `DTSTART;VALUE=DATE:${dateCompact}`,
      dtEndLine: `DTEND;VALUE=DATE:${dtEndCompact}`,
      formattedStart: dateIso,
      formattedEnd: dateIso
    }
  }

  // Handle AM/PM logic
  let startHour = p1.hour
  let startMinute = p1.minute
  let endHour: number
  let endMinute: number

  if (p2) {
    endHour = p2.hour
    endMinute = p2.minute

    // If start ampm is omitted but end is specified, infer start ampm
    const effectiveStartAmpm = p1.ampm || (p2.ampm && p1.hour <= p2.hour ? p2.ampm : 'pm')
    const effectiveEndAmpm = p2.ampm || (effectiveStartAmpm === 'pm' ? 'pm' : 'pm')

    if (effectiveStartAmpm === 'pm' && startHour < 12) startHour += 12
    if (effectiveStartAmpm === 'am' && startHour === 12) startHour = 0

    if (effectiveEndAmpm === 'pm' && endHour < 12) endHour += 12
    if (effectiveEndAmpm === 'am' && endHour === 12) endHour = 0
  } else {
    // Single time specified: default to 1 hour 45 minutes duration
    if (p1.ampm === 'pm' && startHour < 12) startHour += 12
    if (p1.ampm === 'am' && startHour === 12) startHour = 0

    endHour = (startHour + 1) % 24
    endMinute = (startMinute + 45) % 60
    if (startMinute + 45 >= 60) endHour = (endHour + 1) % 24
  }

  const startHHMMSS = toHHMMSS(startHour, startMinute)
  const endHHMMSS = toHHMMSS(endHour, endMinute)

  return {
    isAllDay: false,
    dtStartLine: `DTSTART;TZID=America/Toronto:${dateCompact}T${startHHMMSS}`,
    dtEndLine: `DTEND;TZID=America/Toronto:${dateCompact}T${endHHMMSS}`,
    formattedStart: `${dateIso} ${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`,
    formattedEnd: `${dateIso} ${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`
  }
}

/**
 * Builds the complete, compliant RFC 5545 .ics calendar content.
 */
export function buildTeamCalendarIcs(
  allEvents: ScheduleEvent[],
  teamId: 'u15-girls' | 'u16-boys',
  customTitle?: string
): string {
  const isGirls = teamId === 'u15-girls'
  const teamName = isGirls ? 'U15 Girls' : 'U16 Boys'
  const calendarName = customTitle || `EcoHoops ${teamName} Schedule`

  // 1. Strict Squad Filtering: Only include events assigned to this team OR shared ('all')
  const teamEvents = allEvents.filter((ev) => {
    if (ev.teamId === 'all' || !ev.teamId) return true
    return ev.teamId === teamId
  }).sort((a, b) => a.date.localeCompare(b.date))

  const nowUtc = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EcoHoops Basketball Inc.//Team Hub Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
    'X-WR-TIMEZONE:America/Toronto',
    'X-PUBLISHED-TTL:PT1H',
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H',

    // Authoritative America/Toronto VTIMEZONE Component
    'BEGIN:VTIMEZONE',
    'TZID:America/Toronto',
    'X-LIC-LOCATION:America/Toronto',
    'BEGIN:DAYLIGHT',
    'TZNAME:EDT',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0400',
    'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZNAME:EST',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'END:STANDARD',
    'END:VTIMEZONE'
  ]

  teamEvents.forEach((ev) => {
    const timeParsed = parseEventDateTime(ev)

    // Location & Full Address
    let fullLocation = ev.location || 'Mississauga, ON'
    if (ev.venueDetails && !fullLocation.includes(ev.venueDetails)) {
      fullLocation = `${fullLocation}, ${ev.venueDetails}`
    }

    // Title / Summary
    let summary = ev.title
    if (!summary.toLowerCase().includes('ecohoops')) {
      if (ev.type === 'game' && ev.opponent) {
        summary = `EcoHoops ${teamName} vs ${ev.opponent}`
      } else {
        summary = `EcoHoops ${teamName}: ${ev.title}`
      }
    }

    // Rich Description
    const descParts: string[] = [
      `🏀 EcoHoops Rep Basketball – ${teamName}`,
      `Event: ${ev.title}`,
      `Type: ${ev.type.toUpperCase()}`
    ]

    if (ev.opponent) descParts.push(`Opponent: ${ev.opponent}`)
    if (ev.homeAway) descParts.push(`Designation: ${ev.homeAway === 'home' ? 'Home (White Uniform)' : 'Away (Black Uniform)'}`)
    if (ev.uniformColor) descParts.push(`Uniform: ${ev.uniformColor}`)
    descParts.push(`Date: ${ev.date}`)
    descParts.push(`Time: ${ev.time} (America/Toronto Local Time)`)
    descParts.push(`Gym: ${ev.location}`)
    if (ev.venueDetails) descParts.push(`Address: ${ev.venueDetails}`)
    if (ev.arrivalNote) descParts.push(`Arrival: ${ev.arrivalNote}`)
    if (ev.notes) descParts.push(`Notes: ${ev.notes}`)
    if (ev.mapUrl) descParts.push(`Maps Directions: ${ev.mapUrl}`)

    const hubUrl = isGirls ? 'https://www.ecohoops.ca/hub/u15-girls' : 'https://www.ecohoops.ca/hub/u16-boys'
    descParts.push(`Team Hub: ${hubUrl}`)

    const eventLines = [
      'BEGIN:VEVENT',
      `UID:${ev.id}@ecohoops.ca`,
      `DTSTAMP:${nowUtc}`,
      `SEQUENCE:0`,
      timeParsed.dtStartLine,
      timeParsed.dtEndLine,
      `SUMMARY:${escapeIcsText(summary)}`,
      `LOCATION:${escapeIcsText(fullLocation)}`,
      `DESCRIPTION:${escapeIcsText(descParts.join('\n'))}`,
      `CATEGORIES:${teamName.toUpperCase()},BASKETBALL,ECOHOOPS`,
      `STATUS:CONFIRMED`,
      `URL:${hubUrl}`,
      'END:VEVENT'
    ]

    lines.push(...eventLines)
  })

  lines.push('END:VCALENDAR')

  // Fold and join lines with standard CRLF
  return lines.map(foldLine).join('\r\n')
}

/**
 * Triggers a browser download of the generated .ics file.
 */
export function downloadTeamIcsFile(
  allEvents: ScheduleEvent[],
  teamId: 'u15-girls' | 'u16-boys',
  customTitle?: string
): void {
  const icsContent = buildTeamCalendarIcs(allEvents, teamId, customTitle)
  const isGirls = teamId === 'u15-girls'
  const filename = isGirls ? 'ecohoops-u15-girls-schedule.ics' : 'ecohoops-u16-boys-schedule.ics'

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
