import { SCHEDULE } from '../src/data/schedule.ts'
import { buildTeamCalendarIcs, parseEventDateTime } from '../src/lib/calendar-service.ts'
import type { ScheduleEvent } from '../src/types.ts'

interface ParsedVEvent {
  uid: string
  dtstart: string
  dtend: string
  summary: string
  location: string
  description: string
  categories: string
  status: string
}

function parseIcsIntoEvents(icsContent: string): { calendarName: string; timezone: string; events: ParsedVEvent[] } {
  // Unfold lines first
  const unfolded = icsContent.replace(/\r?\n[ \t]/g, '')
  const lines = unfolded.split(/\r?\n/)

  let calendarName = ''
  let timezone = ''
  const events: ParsedVEvent[] = []

  let currentEvent: Partial<ParsedVEvent> | null = null

  for (const line of lines) {
    if (line.startsWith('X-WR-CALNAME:')) {
      calendarName = line.replace('X-WR-CALNAME:', '').trim()
    }
    if (line.startsWith('X-WR-TIMEZONE:')) {
      timezone = line.replace('X-WR-TIMEZONE:', '').trim()
    }
    if (line === 'BEGIN:VEVENT') {
      currentEvent = {}
    } else if (line === 'END:VEVENT' && currentEvent) {
      events.push(currentEvent as ParsedVEvent)
      currentEvent = null
    } else if (currentEvent) {
      if (line.startsWith('UID:')) currentEvent.uid = line.substring(4)
      else if (line.startsWith('DTSTART')) currentEvent.dtstart = line.substring(line.indexOf(':') + 1)
      else if (line.startsWith('DTEND')) currentEvent.dtend = line.substring(line.indexOf(':') + 1)
      else if (line.startsWith('SUMMARY:')) currentEvent.summary = line.substring(8)
      else if (line.startsWith('LOCATION:')) currentEvent.location = line.substring(9)
      else if (line.startsWith('DESCRIPTION:')) currentEvent.description = line.substring(12)
      else if (line.startsWith('CATEGORIES:')) currentEvent.categories = line.substring(11)
      else if (line.startsWith('STATUS:')) currentEvent.status = line.substring(7)
    }
  }

  return { calendarName, timezone, events }
}

console.log('====================================================')
console.log('ECOHOOPS CALENDAR EXPORT THOROUGH VERIFICATION TEST')
console.log('====================================================\n')

// TEST 1: Generate U15 Girls .ics
console.log('>>> [1/7] Testing U15 Girls Calendar Generation & Event Parity...')
const girlsIcs = buildTeamCalendarIcs(SCHEDULE, 'u15-girls')
const parsedGirls = parseIcsIntoEvents(girlsIcs)

// Expected U15 Girls events from SCHEDULE
const expectedGirlsEvents = SCHEDULE.filter(e => e.teamId === 'u15-girls' || e.teamId === 'all' || !e.teamId)
console.log(`- Expected U15 Girls Team Hub events: ${expectedGirlsEvents.length}`)
console.log(`- Exported U15 Girls .ics events: ${parsedGirls.events.length}`)

if (expectedGirlsEvents.length !== parsedGirls.events.length) {
  console.error(`❌ MISMATCH in event count! Expected ${expectedGirlsEvents.length}, got ${parsedGirls.events.length}`)
  process.exit(1)
} else {
  console.log('✓ Event counts match perfectly!')
}

// TEST 2: Generate U16 Boys .ics
console.log('\n>>> [2/7] Testing U16 Boys Calendar Generation & Event Parity...')
const boysIcs = buildTeamCalendarIcs(SCHEDULE, 'u16-boys')
const parsedBoys = parseIcsIntoEvents(boysIcs)

// Expected U16 Boys events from SCHEDULE
const expectedBoysEvents = SCHEDULE.filter(e => e.teamId === 'u16-boys' || e.teamId === 'all' || !e.teamId)
console.log(`- Expected U16 Boys Team Hub events: ${expectedBoysEvents.length}`)
console.log(`- Exported U16 Boys .ics events: ${parsedBoys.events.length}`)

if (expectedBoysEvents.length !== parsedBoys.events.length) {
  console.error(`❌ MISMATCH in event count! Expected ${expectedBoysEvents.length}, got ${parsedBoys.events.length}`)
  process.exit(1)
} else {
  console.log('✓ Event counts match perfectly!')
}

// TEST 3: Verify Team Separation
console.log('\n>>> [3/7] Verifying Strict Team Separation...')
// Girls calendar must have ZERO boys-only events
const boysInGirlsCal = parsedGirls.events.filter(e => e.uid.startsWith('b-'))
console.log(`- Boys-specific events found in Girls calendar: ${boysInGirlsCal.length}`)
if (boysInGirlsCal.length > 0) {
  console.error('❌ LEAK: Boys events leaked into Girls calendar!', boysInGirlsCal.map(b => b.summary))
  process.exit(1)
}
console.log('✓ Zero Boys events leaked into Girls calendar.')

// Boys calendar must have ZERO girls-only events
const girlsInBoysCal = parsedBoys.events.filter(e => e.uid.startsWith('g-'))
console.log(`- Girls-specific events found in Boys calendar: ${girlsInBoysCal.length}`)
if (girlsInBoysCal.length > 0) {
  console.error('❌ LEAK: Girls events leaked into Boys calendar!', girlsInBoysCal.map(g => g.summary))
  process.exit(1)
}
console.log('✓ Zero Girls events leaked into Boys calendar.')

// Shared events (e.g. Friday Joint Practices / Friday Night Hoops) must be in BOTH
const sharedGirls = parsedGirls.events.filter(e => e.uid.startsWith('friday-'))
const sharedBoys = parsedBoys.events.filter(e => e.uid.startsWith('friday-'))
console.log(`- Shared Friday events in Girls calendar: ${sharedGirls.length}`)
console.log(`- Shared Friday events in Boys calendar: ${sharedBoys.length}`)
if (sharedGirls.length !== sharedBoys.length || sharedGirls.length === 0) {
  console.error('❌ Shared Friday events mismatch between squads!')
  process.exit(1)
}
console.log('✓ Shared Friday events are correctly included in both calendars.')

// TEST 4: Verify Every Single Event Field One by One
console.log('\n>>> [4/7] Verifying Event Details One by One (Date, Time, Location, Title, UID)...')

function verifyAllEventsInCal(expectedEvents: ScheduleEvent[], parsedEvents: ParsedVEvent[], teamName: string) {
  const uidMap = new Map<string, ParsedVEvent>()
  for (const pe of parsedEvents) {
    if (uidMap.has(pe.uid)) {
      console.error(`❌ DUPLICATE UID found in ${teamName}: ${pe.uid}`)
      process.exit(1)
    }
    uidMap.set(pe.uid, pe)
  }

  for (const exp of expectedEvents) {
    const expectedUid = `${exp.id}@ecohoops.ca`
    const pe = uidMap.get(expectedUid)
    if (!pe) {
      console.error(`❌ Missing event in ${teamName} .ics: ${exp.title} (${exp.date}) with UID: ${expectedUid}`)
      process.exit(1)
    }

    const timeResult = parseEventDateTime(exp)

    // Verify Start Time
    if (timeResult.isAllDay) {
      const expStart = exp.date.replace(/-/g, '')
      if (pe.dtstart !== expStart) {
        console.error(`❌ All-day start mismatch for ${exp.title}: expected ${expStart}, got ${pe.dtstart}`)
        process.exit(1)
      }
    } else {
      const expStartTime = timeResult.dtStartLine.split(':')[1]
      if (pe.dtstart !== expStartTime) {
        console.error(`❌ Timed start mismatch for ${exp.title}: expected ${expStartTime}, got ${pe.dtstart}`)
        process.exit(1)
      }
    }

    // Verify Location includes address
    if (exp.venueDetails && !pe.location.includes(exp.venueDetails.replace(/,/g, '\\,'))) {
      console.error(`❌ Location missing venueDetails for ${exp.title}: location was "${pe.location}"`)
      process.exit(1)
    }

    // Verify Title / Summary
    if (!pe.summary.includes(exp.title.replace(/,/g, '\\,')) && !(exp.opponent && pe.summary.includes(exp.opponent))) {
      console.error(`❌ Summary mismatch for event ${exp.id}: expected title "${exp.title}", got "${pe.summary}"`)
      process.exit(1)
    }

    // Verify Status
    if (pe.status !== 'CONFIRMED') {
      console.error(`❌ Status not CONFIRMED for event ${exp.id}: ${pe.status}`)
      process.exit(1)
    }
  }
}

verifyAllEventsInCal(expectedGirlsEvents, parsedGirls.events, 'U15 Girls')
console.log(`✓ All ${expectedGirlsEvents.length} U15 Girls events verified 1-by-1 against Team Hub!`)

verifyAllEventsInCal(expectedBoysEvents, parsedBoys.events, 'U16 Boys')
console.log(`✓ All ${expectedBoysEvents.length} U16 Boys events verified 1-by-1 against Team Hub!`)

// TEST 5: Timezone Validation (America/Toronto / Zero Shifts)
console.log('\n>>> [5/7] Verifying Timezone (America/Toronto, No UTC Shifts)...')

// Verify VTIMEZONE block is present and properly defined
if (!girlsIcs.includes('TZID:America/Toronto') || !boysIcs.includes('TZID:America/Toronto')) {
  console.error('❌ America/Toronto TZID missing in VCALENDAR!')
  process.exit(1)
}
if (!girlsIcs.includes('X-WR-TIMEZONE:America/Toronto') || !boysIcs.includes('X-WR-TIMEZONE:America/Toronto')) {
  console.error('❌ X-WR-TIMEZONE missing in VCALENDAR!')
  process.exit(1)
}

// Sample specific times:
// Boys Monday Practice: 6:00 PM – 8:00 PM
const boysMon = parsedBoys.events.find(e => e.uid === 'b-mon-2026-09-21@ecohoops.ca')
if (!boysMon || boysMon.dtstart !== '20260921T180000' || boysMon.dtend !== '20260921T200000') {
  console.error(`❌ TIMEZONE SHIFT ERROR on Boys Monday Practice: expected 180000-200000, got ${boysMon?.dtstart} - ${boysMon?.dtend}`)
  process.exit(1)
}
console.log(`✓ Boys Monday practice parsed to exact local 18:00:00 – 20:00:00: ${boysMon.dtstart} to ${boysMon.dtend}`)

// Boys Thursday Practice: 8:15 PM – 10:00 PM
const boysThu = parsedBoys.events.find(e => e.uid === 'b-thu-2026-09-24@ecohoops.ca')
if (!boysThu || boysThu.dtstart !== '20260924T201500' || boysThu.dtend !== '20260924T220000') {
  console.error(`❌ TIMEZONE SHIFT ERROR on Boys Thursday Practice: expected 201500-220000, got ${boysThu?.dtstart} - ${boysThu?.dtend}`)
  process.exit(1)
}
console.log(`✓ Boys Thursday practice parsed to exact local 20:15:00 – 22:00:00: ${boysThu.dtstart} to ${boysThu.dtend}`)

// Girls Tuesday Practice: 8:15 PM – 10:00 PM
const girlsTue = parsedGirls.events.find(e => e.uid === 'g-tue-2026-09-22@ecohoops.ca')
if (!girlsTue || girlsTue.dtstart !== '20260922T201500' || girlsTue.dtend !== '20260922T220000') {
  console.error(`❌ TIMEZONE SHIFT ERROR on Girls Tuesday Practice: expected 201500-220000, got ${girlsTue?.dtstart} - ${girlsTue?.dtend}`)
  process.exit(1)
}
console.log(`✓ Girls Tuesday practice parsed to exact local 20:15:00 – 22:00:00: ${girlsTue.dtstart} to ${girlsTue.dtend}`)

// Girls Wednesday Practice: 6:00 PM – 8:00 PM
const girlsWed = parsedGirls.events.find(e => e.uid === 'g-wed-2026-09-23@ecohoops.ca')
if (!girlsWed || girlsWed.dtstart !== '20260923T180000' || girlsWed.dtend !== '20260923T200000') {
  console.error(`❌ TIMEZONE SHIFT ERROR on Girls Wednesday Practice: expected 180000-200000, got ${girlsWed?.dtstart} - ${girlsWed?.dtend}`)
  process.exit(1)
}
console.log(`✓ Girls Wednesday practice parsed to exact local 18:00:00 – 20:00:00: ${girlsWed.dtstart} to ${girlsWed.dtend}`)

// TEST 6: Test Dynamic Mutability (Add, Edit, Delete)
console.log('\n>>> [6/7] Testing Live Mutability (Add, Edit, Delete from Coach Console)...')

// 1. Add custom game
const testCustomGame: ScheduleEvent = {
  id: 'custom-event-test-999',
  type: 'game',
  title: 'Exhibition vs Mississauga Monarchs',
  date: '2026-10-24',
  time: '3:00 PM – 5:00 PM',
  location: 'Iona Catholic Secondary School',
  venueDetails: '2170 South Sheridan Way, Mississauga, ON L5J 2M4',
  opponent: 'Mississauga Monarchs',
  homeAway: 'home',
  uniformColor: 'White (Home)',
  teamId: 'u16-boys',
  arrivalNote: 'Arrive 30 minutes prior for warmups',
  notes: 'Bring warmup bands and water bottles',
  rsvp: { going: 0, maybe: 0, notGoing: 0, total: 0 }
}

const updatedScheduleWithAdd = [...SCHEDULE, testCustomGame]
const boysIcsWithAdd = buildTeamCalendarIcs(updatedScheduleWithAdd, 'u16-boys')
const parsedBoysWithAdd = parseIcsIntoEvents(boysIcsWithAdd)
const customFound = parsedBoysWithAdd.events.find(e => e.uid === 'custom-event-test-999@ecohoops.ca')

if (!customFound) {
  console.error('❌ Added custom event failed to appear in .ics!')
  process.exit(1)
}
if (customFound.dtstart !== '20261024T150000' || customFound.dtend !== '20261024T170000') {
  console.error(`❌ Custom game time parsed incorrectly: ${customFound.dtstart} to ${customFound.dtend}`)
  process.exit(1)
}
console.log('✓ Adding event immediately reflects in .ics with 15:00:00 – 17:00:00!')

// 2. Edit custom game
const editedCustomGame: ScheduleEvent = {
  ...testCustomGame,
  time: '4:00 PM – 6:00 PM',
  opponent: 'Brampton Warriors'
}
const updatedScheduleWithEdit = updatedScheduleWithAdd.map(e => e.id === testCustomGame.id ? editedCustomGame : e)
const boysIcsWithEdit = buildTeamCalendarIcs(updatedScheduleWithEdit, 'u16-boys')
const parsedBoysWithEdit = parseIcsIntoEvents(boysIcsWithEdit)
const editedFound = parsedBoysWithEdit.events.find(e => e.uid === 'custom-event-test-999@ecohoops.ca')

if (!editedFound) {
  console.error('❌ Edited event UID lost!')
  process.exit(1)
}
if (editedFound.dtstart !== '20261024T160000' || editedFound.dtend !== '20261024T180000' || !editedFound.summary.includes('Brampton Warriors')) {
  console.error('❌ Edited event did not update existing UID cleanly!')
  process.exit(1)
}
console.log('✓ Editing event preserves stable UID and updates time & opponent smoothly!')

// 3. Delete custom game
const updatedScheduleWithDelete = updatedScheduleWithEdit.filter(e => e.id !== testCustomGame.id)
const boysIcsWithDelete = buildTeamCalendarIcs(updatedScheduleWithDelete, 'u16-boys')
const parsedBoysWithDelete = parseIcsIntoEvents(boysIcsWithDelete)
const deletedFound = parsedBoysWithDelete.events.find(e => e.uid === 'custom-event-test-999@ecohoops.ca')

if (deletedFound) {
  console.error('❌ Deleted event still remained in .ics!')
  process.exit(1)
}
console.log('✓ Deleted event is completely purged from .ics!')

// TEST 7: Apple Calendar and Google Calendar Compatibility (RFC 5545 Syntax)
console.log('\n>>> [7/7] Verifying RFC 5545 Syntax for Apple & Google Calendar...')

// Check CRLF line endings
const crlfMatch = girlsIcs.includes('\r\n')
if (!crlfMatch) {
  console.error('❌ Missing RFC 5545 standard CRLF line endings!')
  process.exit(1)
}
console.log('✓ Strict RFC 5545 CRLF line breaks verified.')

// Check line lengths (folded <= 75 bytes)
const rawLines = girlsIcs.split('\r\n')
let maxLineLen = 0
for (const line of rawLines) {
  const byteLen = Buffer.byteLength(line, 'utf8')
  if (byteLen > maxLineLen) maxLineLen = byteLen
  if (byteLen > 75) {
    console.error(`❌ RFC 5545 violation: Line exceeded 75 bytes (${byteLen} bytes): "${line}"`)
    process.exit(1)
  }
}
console.log(`✓ Maximum folded line length is ${maxLineLen} bytes (strictly <= 75 bytes limit).`)

console.log('\n====================================================')
console.log('ALL 7 VERIFICATION CHECKS PASSED WITH 100% SUCCESS!')
console.log('====================================================')
