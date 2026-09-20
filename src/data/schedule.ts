import { ScheduleEvent } from '../types'

export interface LeagueWeekend {
  id: string
  teamId: 'u15-boys-ss26' | 'u14-girls-ss26'
  dateRange: string
  startDate: string
  endDate: string
  league: 'Coalition' | 'OBL'
  sessionType: string
  gamesCount?: string
  isPlayoffs?: boolean
  isAllStar?: boolean
}

// ECOHOOPS U16 BOYS (Birth Year: 2011) - Chronological Schedule
export const U16_BOYS_SCHEDULE: LeagueWeekend[] = [
  {
    id: 'b-coalition-1',
    teamId: 'u15-boys-ss26',
    dateRange: 'October 31 – November 1, 2026',
    startDate: '2026-10-31',
    endDate: '2026-11-01',
    league: 'Coalition',
    sessionType: 'Alignment Weekend',
    gamesCount: '3 Games'
  },
  {
    id: 'b-obl-1',
    teamId: 'u15-boys-ss26',
    dateRange: 'November 21–22, 2026',
    startDate: '2026-11-21',
    endDate: '2026-11-22',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'b-coalition-2',
    teamId: 'u15-boys-ss26',
    dateRange: 'December 5–6, 2026',
    startDate: '2026-12-05',
    endDate: '2026-12-06',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'b-coalition-3',
    teamId: 'u15-boys-ss26',
    dateRange: 'January 9–10, 2027',
    startDate: '2027-01-09',
    endDate: '2027-01-10',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'b-coalition-4',
    teamId: 'u15-boys-ss26',
    dateRange: 'January 30–31, 2027',
    startDate: '2027-01-30',
    endDate: '2027-01-31',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'b-obl-2',
    teamId: 'u15-boys-ss26',
    dateRange: 'February 6–7, 2027',
    startDate: '2027-02-06',
    endDate: '2027-02-07',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'b-coalition-5',
    teamId: 'u15-boys-ss26',
    dateRange: 'February 13–14, 2027',
    startDate: '2027-02-13',
    endDate: '2027-02-14',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'b-obl-3',
    teamId: 'u15-boys-ss26',
    dateRange: 'February 20–21, 2027',
    startDate: '2027-02-20',
    endDate: '2027-02-21',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'b-coalition-playoffs',
    teamId: 'u15-boys-ss26',
    dateRange: 'March 6–7, 2027',
    startDate: '2027-03-06',
    endDate: '2027-03-07',
    league: 'Coalition',
    sessionType: 'PLAYOFFS',
    isPlayoffs: true
  },
  {
    id: 'b-coalition-allstar',
    teamId: 'u15-boys-ss26',
    dateRange: 'March 20–21, 2027',
    startDate: '2027-03-20',
    endDate: '2027-03-21',
    league: 'Coalition',
    sessionType: 'All-Star Weekend',
    isAllStar: true
  },
  {
    id: 'b-obl-4game',
    teamId: 'u15-boys-ss26',
    dateRange: 'April 10–11, 2027',
    startDate: '2027-04-10',
    endDate: '2027-04-11',
    league: 'OBL',
    sessionType: '4-Game Weekend',
    gamesCount: '4 Games'
  },
  {
    id: 'b-obl-5',
    teamId: 'u15-boys-ss26',
    dateRange: 'April 17–18, 2027',
    startDate: '2027-04-17',
    endDate: '2027-04-18',
    league: 'OBL',
    sessionType: 'League Session'
  }
]

// ECOHOOPS U15 GIRLS (Birth Year: 2012) - Chronological Schedule
export const U15_GIRLS_SCHEDULE: LeagueWeekend[] = [
  {
    id: 'g-obl-1',
    teamId: 'u14-girls-ss26',
    dateRange: 'November 7–8, 2026',
    startDate: '2026-11-07',
    endDate: '2026-11-08',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'g-coalition-1',
    teamId: 'u14-girls-ss26',
    dateRange: 'December 5–6, 2026',
    startDate: '2026-12-05',
    endDate: '2026-12-06',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'g-obl-2',
    teamId: 'u14-girls-ss26',
    dateRange: 'December 12–13, 2026',
    startDate: '2026-12-12',
    endDate: '2026-12-13',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'g-coalition-2',
    teamId: 'u14-girls-ss26',
    dateRange: 'January 9–10, 2027',
    startDate: '2027-01-09',
    endDate: '2027-01-10',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'g-obl-3',
    teamId: 'u14-girls-ss26',
    dateRange: 'January 16–17, 2027',
    startDate: '2027-01-16',
    endDate: '2027-01-17',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'g-coalition-3',
    teamId: 'u14-girls-ss26',
    dateRange: 'February 20–21, 2027',
    startDate: '2027-02-20',
    endDate: '2027-02-21',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'g-obl-4',
    teamId: 'u14-girls-ss26',
    dateRange: 'February 27–28, 2027',
    startDate: '2027-02-27',
    endDate: '2027-02-28',
    league: 'OBL',
    sessionType: 'League Session'
  },
  {
    id: 'g-coalition-4',
    teamId: 'u14-girls-ss26',
    dateRange: 'March 6–7, 2027',
    startDate: '2027-03-06',
    endDate: '2027-03-07',
    league: 'Coalition',
    sessionType: 'League Session'
  },
  {
    id: 'g-coalition-allstar',
    teamId: 'u14-girls-ss26',
    dateRange: 'March 13–14, 2027',
    startDate: '2027-03-13',
    endDate: '2027-03-14',
    league: 'Coalition',
    sessionType: 'All-Star Weekend',
    isAllStar: true
  },
  {
    id: 'g-obl-4game',
    teamId: 'u14-girls-ss26',
    dateRange: 'April 3–4, 2027',
    startDate: '2027-04-03',
    endDate: '2027-04-04',
    league: 'OBL',
    sessionType: '4-Game Weekend',
    gamesCount: '4 Games'
  },
  {
    id: 'g-coalition-playoffs',
    teamId: 'u14-girls-ss26',
    dateRange: 'April 10–11, 2027',
    startDate: '2027-04-10',
    endDate: '2027-04-11',
    league: 'Coalition',
    sessionType: 'PLAYOFFS',
    isPlayoffs: true
  }
]

// Convert to ScheduleEvent array for calendar sync and standard platform integration
export const SCHEDULE: ScheduleEvent[] = [
  ...U16_BOYS_SCHEDULE.map((w): ScheduleEvent => ({
    id: w.id,
    type: w.isPlayoffs || w.isAllStar ? 'tournament' : 'game',
    title: `${w.league} - ${w.sessionType}${w.gamesCount ? ` (${w.gamesCount})` : ''}`,
    date: w.startDate,
    time: 'Confirmed Weekend',
    location: `${w.league} Competition Venue`,
    teamId: w.teamId,
    notes: `Confirmed ${w.league} session dates: ${w.dateRange}. Exact game times and matchups released prior to weekend.`,
    rsvp: { going: 0, maybe: 0, notGoing: 0, total: 0 }
  })),
  ...U15_GIRLS_SCHEDULE.map((w): ScheduleEvent => ({
    id: w.id,
    type: w.isPlayoffs || w.isAllStar ? 'tournament' : 'game',
    title: `${w.league} - ${w.sessionType}${w.gamesCount ? ` (${w.gamesCount})` : ''}`,
    date: w.startDate,
    time: 'Confirmed Weekend',
    location: `${w.league} Competition Venue`,
    teamId: w.teamId,
    notes: `Confirmed ${w.league} session dates: ${w.dateRange}. Exact game times and matchups released prior to weekend.`,
    rsvp: { going: 0, maybe: 0, notGoing: 0, total: 0 }
  }))
]
