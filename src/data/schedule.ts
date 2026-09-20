import { ScheduleEvent } from '../types'

export interface LeagueWeekend {
  id: string
  teamId: 'u16-boys' | 'u15-girls'
  dateRange: string
  startDate: string
  endDate: string
  league: 'Coalition' | 'OBL'
  sessionType: string
  gamesCount?: string
  isPlayoffs?: boolean
  isAllStar?: boolean
}

export interface PracticeRule {
  id: string
  dayOfWeek: string
  time: string
  venue: string
  address: string
  firstDate: string
  finalDate: string
  permitNote?: string
  mapUrl?: string
}

export interface NoPracticeDate {
  date: string
  dayOfWeek: string
  venue: string
  reason: string
  category: 'holiday' | 'winter_break' | 'march_break' | 'permit' | 'pa_day'
}

export interface ApprovedSpecialNotice {
  date: string
  dayOfWeek: string
  venue: string
  note: string
  status: 'PRACTICE_ON' | 'PERMIT_APPROVED'
}

// ==========================================
// 1. AUTHORITATIVE PRACTICE RULES
// ==========================================

export const BOYS_PRACTICE_RULES: PracticeRule[] = [
  {
    id: 'boys-mon',
    dayOfWeek: 'Monday',
    time: '6:00 PM – 8:00 PM',
    venue: 'Green Glade Senior Public School',
    address: '1550 Green Glade, Mississauga, ON L5J 1B5',
    firstDate: '2026-09-21',
    finalDate: '2027-03-22',
    permitNote: 'Monday practices do NOT continue after March 22, 2027 because the Green Glade Monday permit ends on that date.',
    mapUrl: 'https://maps.google.com/?q=1550+Green+Glade+Mississauga+ON+L5J+1B5'
  },
  {
    id: 'boys-thu',
    dayOfWeek: 'Thursday',
    time: '8:15 PM – 10:00 PM',
    venue: 'Iona Catholic Secondary School',
    address: '2170 South Sheridan Way, Mississauga, ON L5J 2M4',
    firstDate: '2026-09-24',
    finalDate: '2027-04-29',
    permitNote: 'Final Boys Thursday practice is April 29, 2027.',
    mapUrl: 'https://maps.google.com/?q=2170+South+Sheridan+Way+Mississauga+ON+L5J+2M4'
  }
]

export const GIRLS_PRACTICE_RULES: PracticeRule[] = [
  {
    id: 'girls-tue',
    dayOfWeek: 'Tuesday',
    time: '8:15 PM – 10:00 PM',
    venue: 'Iona Catholic Secondary School',
    address: '2170 South Sheridan Way, Mississauga, ON L5J 2M4',
    firstDate: '2026-09-22',
    finalDate: '2027-04-27',
    permitNote: 'Final Girls Tuesday practice is April 27, 2027.',
    mapUrl: 'https://maps.google.com/?q=2170+South+Sheridan+Way+Mississauga+ON+L5J+2M4'
  },
  {
    id: 'girls-wed',
    dayOfWeek: 'Wednesday',
    time: '6:00 PM – 8:00 PM',
    venue: 'Green Glade Senior Public School',
    address: '1550 Green Glade, Mississauga, ON L5J 1B5',
    firstDate: '2026-09-23',
    finalDate: '2027-03-31',
    permitNote: 'After March 31, the Girls continue their Tuesday practices at Iona through April 27, but there are no more Wednesday Green Glade practices.',
    mapUrl: 'https://maps.google.com/?q=1550+Green+Glade+Mississauga+ON+L5J+1B5'
  }
]

export const FRIDAY_CONFIG = {
  venue: 'Iona Catholic Secondary School',
  address: '2170 South Sheridan Way, Mississauga, ON L5J 2M4',
  time: '8:15 PM – 10:00 PM',
  firstDate: '2026-09-25',
  finalDate: '2027-04-30',
  mapUrl: 'https://maps.google.com/?q=2170+South+Sheridan+Way+Mississauga+ON+L5J+2M4',
  phase1: {
    title: 'Phase 1: Joint Team Practices',
    startDate: '2026-09-25',
    endDate: '2026-11-06',
    isOptional: false,
    label: 'MANDATORY TEAM PROGRAM',
    description: 'Regular joint team practice for U16 Boys and U15 Girls during the early part of the season before game sessions start. Not optional yet.'
  },
  phase2: {
    title: 'Phase 2: Friday Night Hoops',
    startDate: '2026-11-13',
    endDate: '2027-04-30',
    isOptional: true,
    label: 'OPTIONAL EXTRA GYM TIME',
    tagline: 'The gym is open. Come play. Come work. Get better at what YOU want to work on.',
    description: 'Relaxed, player-driven extra gym time. NOT a third mandatory weekly team practice. Players can get extra reps, shoot, play, work on individual goals, ask coaches for help, or bring a friend.'
  }
}

// ==========================================
// 2. AUTHORITATIVE NO PRACTICE DATES
// ==========================================

export const BOYS_NO_PRACTICE_DATES: NoPracticeDate[] = [
  // Monday - Green Glade
  { date: '2026-10-12', dayOfWeek: 'Monday', venue: 'Green Glade Senior PS', reason: 'Thanksgiving', category: 'holiday' },
  { date: '2026-10-26', dayOfWeek: 'Monday', venue: 'Green Glade Senior PS', reason: 'School PA Day / no approved gym permit', category: 'permit' },
  { date: '2026-12-21', dayOfWeek: 'Monday', venue: 'Green Glade Senior PS', reason: 'Winter Break', category: 'winter_break' },
  { date: '2026-12-28', dayOfWeek: 'Monday', venue: 'Green Glade Senior PS', reason: 'Winter Break', category: 'winter_break' },
  { date: '2027-02-15', dayOfWeek: 'Monday', venue: 'Green Glade Senior PS', reason: 'Family Day', category: 'holiday' },
  { date: '2027-03-15', dayOfWeek: 'Monday', venue: 'Green Glade Senior PS', reason: 'March Break', category: 'march_break' },

  // Thursday - Iona
  { date: '2026-10-22', dayOfWeek: 'Thursday', venue: 'Iona Catholic SS', reason: 'Gym not included on approved permit', category: 'permit' },
  { date: '2026-12-24', dayOfWeek: 'Thursday', venue: 'Iona Catholic SS', reason: 'Winter Break', category: 'winter_break' },
  { date: '2026-12-31', dayOfWeek: 'Thursday', venue: 'Iona Catholic SS', reason: 'Winter Break', category: 'winter_break' },
  { date: '2027-03-18', dayOfWeek: 'Thursday', venue: 'Iona Catholic SS', reason: 'March Break', category: 'march_break' },
  { date: '2027-03-25', dayOfWeek: 'Thursday', venue: 'Iona Catholic SS', reason: 'Gym not included on approved permit', category: 'permit' }
]

export const GIRLS_NO_PRACTICE_DATES: NoPracticeDate[] = [
  // Tuesday - Iona
  { date: '2026-12-22', dayOfWeek: 'Tuesday', venue: 'Iona Catholic SS', reason: 'Winter Break', category: 'winter_break' },
  { date: '2026-12-29', dayOfWeek: 'Tuesday', venue: 'Iona Catholic SS', reason: 'Winter Break', category: 'winter_break' },
  { date: '2027-03-16', dayOfWeek: 'Tuesday', venue: 'Iona Catholic SS', reason: 'March Break', category: 'march_break' },
  { date: '2027-03-23', dayOfWeek: 'Tuesday', venue: 'Iona Catholic SS', reason: 'Gym not included on approved permit', category: 'permit' },

  // Wednesday - Green Glade
  { date: '2026-12-23', dayOfWeek: 'Wednesday', venue: 'Green Glade Senior PS', reason: 'Winter Break', category: 'winter_break' },
  { date: '2026-12-30', dayOfWeek: 'Wednesday', venue: 'Green Glade Senior PS', reason: 'Winter Break', category: 'winter_break' },
  { date: '2027-01-06', dayOfWeek: 'Wednesday', venue: 'Green Glade Senior PS', reason: 'Gym not included on approved permit', category: 'permit' },
  { date: '2027-02-10', dayOfWeek: 'Wednesday', venue: 'Green Glade Senior PS', reason: 'Gym not included on approved permit', category: 'permit' },
  { date: '2027-03-17', dayOfWeek: 'Wednesday', venue: 'Green Glade Senior PS', reason: 'March Break', category: 'march_break' }
]

export const FRIDAY_NO_GYM_DATES: NoPracticeDate[] = [
  { date: '2026-12-25', dayOfWeek: 'Friday', venue: 'Iona Catholic SS', reason: 'Winter Break / Christmas Day', category: 'winter_break' },
  { date: '2027-01-01', dayOfWeek: 'Friday', venue: 'Iona Catholic SS', reason: 'Winter Break / New Year\'s Day', category: 'winter_break' },
  { date: '2027-03-19', dayOfWeek: 'Friday', venue: 'Iona Catholic SS', reason: 'March Break', category: 'march_break' },
  { date: '2027-03-26', dayOfWeek: 'Friday', venue: 'Iona Catholic SS', reason: 'Good Friday', category: 'holiday' }
]

// Approved PA Day confirmations (Do NOT cancel)
export const APPROVED_PA_DAYS: ApprovedSpecialNotice[] = [
  {
    date: '2027-01-18',
    dayOfWeek: 'Monday',
    venue: 'Green Glade Senior Public School',
    note: 'Monday, January 18, 2027 IS an approved practice date. Even though it is a school PA Day, EcoHoops has an approved gym permit for that evening. Practice is ON.',
    status: 'PRACTICE_ON'
  },
  {
    date: '2027-02-12',
    dayOfWeek: 'Friday',
    venue: 'Iona Catholic Secondary School',
    note: 'Friday, February 12, 2027 IS an approved Friday Night Hoops date. Even though Dufferin-Peel Catholic District School Board has a secondary PA Day, the approved EcoHoops permit includes the Iona gym that evening. Practice is ON.',
    status: 'PRACTICE_ON'
  }
]

// ==========================================
// 3. OBA ONTARIO CUP & SCHEDULE NOTICES
// ==========================================

export const OBA_ONTARIO_CUP_STATUS = {
  title: 'OBA ONTARIO CUP',
  status: 'AWAITING OFFICIAL OBA DATE',
  dateLabel: 'DATE: TBD',
  details: 'Ontario Basketball has not yet released the official 2027 Ontario Cup date for this age group.',
  notice: 'OBA Ontario Cup dates for the 2026-27 season have not yet been released. The Hub will be updated when Ontario Basketball announces the official dates.'
}

export const SCHEDULE_NOTICES = {
  practice: 'Practice dates follow our approved school gym permits. School holidays, breaks, facility closures and school events may affect individual dates. Always check the Team Hub for the current schedule.',
  game: 'Session dates are confirmed league competition weekends. Exact game times, opponents and game venues will be added as they are released.',
  ontarioCup: 'OBA Ontario Cup dates for the 2026-27 season have not yet been released. The Hub will be updated when Ontario Basketball announces the official dates.'
}

// ==========================================
// 4. CONFIRMED SEASON COMPETITION SESSIONS
// ==========================================

export const U16_BOYS_SCHEDULE: LeagueWeekend[] = [
  {
    id: 'b-coalition-1',
    teamId: 'u16-boys',
    dateRange: 'October 31 – November 1, 2026',
    startDate: '2026-10-31',
    endDate: '2026-11-01',
    league: 'Coalition',
    sessionType: 'Alignment Weekend',
    gamesCount: '3 Games'
  },
  {
    id: 'b-obl-1',
    teamId: 'u16-boys',
    dateRange: 'November 21–22, 2026',
    startDate: '2026-11-21',
    endDate: '2026-11-22',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'b-coalition-2',
    teamId: 'u16-boys',
    dateRange: 'December 5–6, 2026',
    startDate: '2026-12-05',
    endDate: '2026-12-06',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'b-coalition-3',
    teamId: 'u16-boys',
    dateRange: 'January 9–10, 2027',
    startDate: '2027-01-09',
    endDate: '2027-01-10',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'b-coalition-4',
    teamId: 'u16-boys',
    dateRange: 'January 30–31, 2027',
    startDate: '2027-01-30',
    endDate: '2027-01-31',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'b-obl-2',
    teamId: 'u16-boys',
    dateRange: 'February 6–7, 2027',
    startDate: '2027-02-06',
    endDate: '2027-02-07',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'b-coalition-5',
    teamId: 'u16-boys',
    dateRange: 'February 13–14, 2027',
    startDate: '2027-02-13',
    endDate: '2027-02-14',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'b-obl-3',
    teamId: 'u16-boys',
    dateRange: 'February 20–21, 2027',
    startDate: '2027-02-20',
    endDate: '2027-02-21',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'b-coalition-playoffs',
    teamId: 'u16-boys',
    dateRange: 'March 6–7, 2027',
    startDate: '2027-03-06',
    endDate: '2027-03-07',
    league: 'Coalition',
    sessionType: 'PLAYOFFS',
    isPlayoffs: true
  },
  {
    id: 'b-coalition-allstar',
    teamId: 'u16-boys',
    dateRange: 'March 20–21, 2027',
    startDate: '2027-03-20',
    endDate: '2027-03-21',
    league: 'Coalition',
    sessionType: 'All-Star Weekend',
    isAllStar: true
  },
  {
    id: 'b-obl-4game',
    teamId: 'u16-boys',
    dateRange: 'April 10–11, 2027',
    startDate: '2027-04-10',
    endDate: '2027-04-11',
    league: 'OBL',
    sessionType: '4-Game Weekend',
    gamesCount: '4 Games'
  },
  {
    id: 'b-obl-final',
    teamId: 'u16-boys',
    dateRange: 'April 17–18, 2027',
    startDate: '2027-04-17',
    endDate: '2027-04-18',
    league: 'OBL',
    sessionType: 'League Session'
  }
]

export const U15_GIRLS_SCHEDULE: LeagueWeekend[] = [
  {
    id: 'g-obl-1',
    teamId: 'u15-girls',
    dateRange: 'November 7–8, 2026',
    startDate: '2026-11-07',
    endDate: '2026-11-08',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'g-coalition-1',
    teamId: 'u15-girls',
    dateRange: 'December 5–6, 2026',
    startDate: '2026-12-05',
    endDate: '2026-12-06',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'g-obl-2',
    teamId: 'u15-girls',
    dateRange: 'December 12–13, 2026',
    startDate: '2026-12-12',
    endDate: '2026-12-13',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'g-coalition-2',
    teamId: 'u15-girls',
    dateRange: 'January 9–10, 2027',
    startDate: '2027-01-09',
    endDate: '2027-01-10',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'g-obl-3',
    teamId: 'u15-girls',
    dateRange: 'January 16–17, 2027',
    startDate: '2027-01-16',
    endDate: '2027-01-17',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'g-coalition-3',
    teamId: 'u15-girls',
    dateRange: 'February 20–21, 2027',
    startDate: '2027-02-20',
    endDate: '2027-02-21',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'g-obl-4',
    teamId: 'u15-girls',
    dateRange: 'February 27–28, 2027',
    startDate: '2027-02-27',
    endDate: '2027-02-28',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'g-coalition-4',
    teamId: 'u15-girls',
    dateRange: 'March 6–7, 2027',
    startDate: '2027-03-06',
    endDate: '2027-03-07',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'g-coalition-allstar',
    teamId: 'u15-girls',
    dateRange: 'March 13–14, 2027',
    startDate: '2027-03-13',
    endDate: '2027-03-14',
    league: 'Coalition',
    sessionType: 'All-Star Weekend',
    isAllStar: true
  },
  {
    id: 'g-obl-4game',
    teamId: 'u15-girls',
    dateRange: 'April 3–4, 2027',
    startDate: '2027-04-03',
    endDate: '2027-04-04',
    league: 'OBL',
    sessionType: '4-Game Weekend',
    gamesCount: '4 Games'
  },
  {
    id: 'g-coalition-playoffs',
    teamId: 'u15-girls',
    dateRange: 'April 10–11, 2027',
    startDate: '2027-04-10',
    endDate: '2027-04-11',
    league: 'Coalition',
    sessionType: 'PLAYOFFS',
    isPlayoffs: true
  }
]

// ==========================================
// 5. ACCURATE PERMIT-BASED EVENT GENERATOR
// ==========================================

const DAY_INDEX_MAP: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
}

function generatePracticeEvents(
  rule: PracticeRule,
  teamId: string,
  prefix: string,
  noPracticeList: NoPracticeDate[],
  title: string
): ScheduleEvent[] {
  const events: ScheduleEvent[] = []
  const targetDay = DAY_INDEX_MAP[rule.dayOfWeek]
  const noPracticeSet = new Set(noPracticeList.map(np => np.date))
  const start = new Date(rule.firstDate + 'T12:00:00Z')
  const end = new Date(rule.finalDate + 'T12:00:00Z')

  let curr = new Date(start)
  while (curr <= end) {
    if (curr.getUTCDay() === targetDay) {
      const iso = curr.toISOString().split('T')[0]
      if (!noPracticeSet.has(iso)) {
        events.push({
          id: `${prefix}-${iso}`,
          type: 'practice',
          title,
          date: iso,
          time: rule.time,
          location: rule.venue,
          venueDetails: rule.address,
          mapUrl: rule.mapUrl,
          teamId,
          notes: rule.permitNote || `Weekly team practice at ${rule.venue}.`,
          uniformColor: 'Practice Reversible',
          category: 'practice',
          rsvp: { going: 0, maybe: 0, notGoing: 0, total: 0 }
        })
      }
    }
    curr.setUTCDate(curr.getUTCDate() + 1)
  }
  return events
}

function generateFridayEvents(): ScheduleEvent[] {
  const events: ScheduleEvent[] = []
  const noPracticeSet = new Set(FRIDAY_NO_GYM_DATES.map(np => np.date))
  const start = new Date(FRIDAY_CONFIG.firstDate + 'T12:00:00Z')
  const end = new Date(FRIDAY_CONFIG.finalDate + 'T12:00:00Z')

  let curr = new Date(start)
  while (curr <= end) {
    if (curr.getUTCDay() === 5) {
      const iso = curr.toISOString().split('T')[0]
      if (!noPracticeSet.has(iso)) {
        const isPhase1 = iso <= FRIDAY_CONFIG.phase1.endDate
        events.push({
          id: `friday-${iso}`,
          type: 'practice',
          title: isPhase1 ? 'Joint Team Practice (Boys & Girls)' : 'Friday Night Hoops',
          date: iso,
          time: FRIDAY_CONFIG.time,
          location: FRIDAY_CONFIG.venue,
          venueDetails: FRIDAY_CONFIG.address,
          mapUrl: FRIDAY_CONFIG.mapUrl,
          teamId: 'all', // shared by both U16 Boys and U15 Girls
          isOptional: !isPhase1,
          isPhase1,
          isPhase2: !isPhase1,
          category: isPhase1 ? 'practice' : 'friday_night_hoops',
          notes: isPhase1
            ? 'Phase 1: Mandatory joint team practice for U16 Boys and U15 Girls.'
            : 'Phase 2: OPTIONAL Friday Night Hoops. The gym is open. Come play, work on individual goals, or get extra reps.',
          uniformColor: 'Practice Reversible',
          rsvp: { going: 0, maybe: 0, notGoing: 0, total: 0 }
        })
      }
    }
    curr.setUTCDate(curr.getUTCDate() + 1)
  }
  return events
}

// Generate the complete authoritative schedule
export const SCHEDULE: ScheduleEvent[] = [
  // 1. U16 Boys Regular Practices
  ...generatePracticeEvents(
    BOYS_PRACTICE_RULES[0],
    'u16-boys',
    'b-mon',
    BOYS_NO_PRACTICE_DATES,
    'U16 Boys Practice'
  ),
  ...generatePracticeEvents(
    BOYS_PRACTICE_RULES[1],
    'u16-boys',
    'b-thu',
    BOYS_NO_PRACTICE_DATES,
    'U16 Boys Practice'
  ),

  // 2. U15 Girls Regular Practices
  ...generatePracticeEvents(
    GIRLS_PRACTICE_RULES[0],
    'u15-girls',
    'g-tue',
    GIRLS_NO_PRACTICE_DATES,
    'U15 Girls Practice'
  ),
  ...generatePracticeEvents(
    GIRLS_PRACTICE_RULES[1],
    'u15-girls',
    'g-wed',
    GIRLS_NO_PRACTICE_DATES,
    'U15 Girls Practice'
  ),

  // 3. Shared Friday Sessions (Phase 1 Joint Practices & Phase 2 Friday Night Hoops)
  ...generateFridayEvents(),

  // 4. U16 Boys Confirmed League Sessions
  ...U16_BOYS_SCHEDULE.map((w): ScheduleEvent => ({
    id: w.id,
    type: w.isPlayoffs || w.isAllStar ? 'tournament' : 'game',
    title: `${w.league} – ${w.sessionType}${w.gamesCount ? ` (${w.gamesCount})` : ''}`,
    date: w.startDate,
    time: 'Confirmed Weekend',
    location: `${w.league} Competition Venue`,
    teamId: w.teamId,
    league: w.league,
    sessionType: w.sessionType,
    isPlayoffs: w.isPlayoffs,
    isAllStar: w.isAllStar,
    category: w.isPlayoffs ? 'playoffs' : w.isAllStar ? 'all_star' : 'league_session',
    notes: `Confirmed ${w.league} session dates: ${w.dateRange}. Exact game times and matchups released prior to weekend.`,
    rsvp: { going: 0, maybe: 0, notGoing: 0, total: 0 }
  })),

  // 5. U15 Girls Confirmed League Sessions
  ...U15_GIRLS_SCHEDULE.map((w): ScheduleEvent => ({
    id: w.id,
    type: w.isPlayoffs || w.isAllStar ? 'tournament' : 'game',
    title: `${w.league} – ${w.sessionType}${w.gamesCount ? ` (${w.gamesCount})` : ''}`,
    date: w.startDate,
    time: 'Confirmed Weekend',
    location: `${w.league} Competition Venue`,
    teamId: w.teamId,
    league: w.league,
    sessionType: w.sessionType,
    isPlayoffs: w.isPlayoffs,
    isAllStar: w.isAllStar,
    category: w.isPlayoffs ? 'playoffs' : w.isAllStar ? 'all_star' : 'league_session',
    notes: `Confirmed ${w.league} session dates: ${w.dateRange}. Exact game times and matchups released prior to weekend.`,
    rsvp: { going: 0, maybe: 0, notGoing: 0, total: 0 }
  }))
].sort((a, b) => a.date.localeCompare(b.date))
