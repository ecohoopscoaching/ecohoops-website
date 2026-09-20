import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Team, Player, ScheduleEvent, PaymentRecord, Message } from '../types'
import { TEAMS } from '../data/teams'
import { SCHEDULE } from '../data/schedule'
import { PAYMENTS, MESSAGES } from '../data/content'

interface DataContextType {
  teams: Team[]
  schedule: ScheduleEvent[]
  payments: PaymentRecord[]
  messages: Message[]
  addEvent: (event: ScheduleEvent) => void
  deleteEvent: (id: string) => void
  updateEvent: (updatedEvent: ScheduleEvent) => void
  updateTeamRecord: (teamId: string, record: string) => void
  addPlayerToTeam: (teamId: string, player: Player) => void
  updatePlayerStats: (teamId: string, playerId: string, stats: Player['stats']) => void
  updatePlayerDetails: (teamId: string, playerId: string, details: Partial<Omit<Player, 'id' | 'stats'>>) => void
  deletePlayerFromTeam: (teamId: string, playerId: string) => void
  uploadScoresheet: (teamId: string, csvContent: string, gameOutcome?: 'W' | 'L', gameScore?: string) => string
  recordAttendance: (eventId: string, playerId: string, status: 'going' | 'maybe' | 'notGoing', note?: string) => void
  checkInPlayer: (eventId: string, playerId: string, checkedIn: boolean) => void
  downloadCalendarIcs: (calendarTitle?: string) => void
  sendMessage: (channel: string, content: string, sender: string) => void
  updatePaymentStatus: (paymentId: string, status: PaymentRecord['status']) => void
  clearSchedule: () => void
  clearAllData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export function DataProvider({ children }: { children: ReactNode }) {
  // Clean state: Load user-saved state from localStorage or initialize clean
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('ecohoops_teams_v4')
    return saved ? JSON.parse(saved) : TEAMS
  })

  const [schedule, setSchedule] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('ecohoops_schedule_v4')
    if (!saved) return SCHEDULE
    try {
      const parsed: ScheduleEvent[] = JSON.parse(saved)
      return parsed.length > 0 ? parsed : SCHEDULE
    } catch {
      return SCHEDULE
    }
  })

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('ecohoops_payments')
    return saved ? JSON.parse(saved) : []
  })

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('ecohoops_messages')
    return saved ? JSON.parse(saved) : []
  })

  // One-time automated update to ensure Winter season, U16 Boys / U15 Girls, and confirmed schedule are synced
  useEffect(() => {
    const cleanFlagKey = 'ecohoops_clean_baseline_v12'
    if (!localStorage.getItem(cleanFlagKey)) {
      localStorage.setItem('ecohoops_teams_v4', JSON.stringify(TEAMS))
      localStorage.setItem('ecohoops_schedule', JSON.stringify(SCHEDULE))
      localStorage.setItem(cleanFlagKey, 'true')
      setTeams(TEAMS)
      setSchedule(SCHEDULE)
    }
  }, [])

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('ecohoops_teams_v4', JSON.stringify(teams))
  }, [teams])

  useEffect(() => {
    localStorage.setItem('ecohoops_schedule_v4', JSON.stringify(schedule))
  }, [schedule])

  useEffect(() => {
    localStorage.setItem('ecohoops_payments', JSON.stringify(payments))
  }, [payments])

  useEffect(() => {
    localStorage.setItem('ecohoops_messages', JSON.stringify(messages))
  }, [messages])

  const clearAllData = () => {
    localStorage.removeItem('ecohoops_schedule_v4')
    localStorage.removeItem('ecohoops_payments')
    localStorage.removeItem('ecohoops_messages')
    localStorage.removeItem('ecohoops_jr_waitlist')
    localStorage.removeItem('ecohoops_sent_notifications_v1')
    localStorage.setItem('ecohoops_teams_v4', JSON.stringify(TEAMS))
    setSchedule([])
    setPayments([])
    setMessages([])
    setTeams(TEAMS)
  }

  const clearSchedule = () => {
    localStorage.removeItem('ecohoops_schedule_v4')
    setSchedule([])
  }

  /* ─── SCHEDULE MODIFIERS ─── */
  const addEvent = (event: ScheduleEvent) => {
    setSchedule((prev) => [event, ...prev])
  }

  const deleteEvent = (id: string) => {
    setSchedule((prev) => prev.filter((e) => e.id !== id))
  }

  const updateEvent = (updatedEvent: ScheduleEvent) => {
    setSchedule((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
  }

  /* ─── TEAM MODIFIERS ─── */
  const updateTeamRecord = (teamId: string, record: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, record } : t))
    )
  }

  const addPlayerToTeam = (teamId: string, player: Player) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, roster: [...t.roster, player] } : t))
    )
  }

  const updatePlayerStats = (teamId: string, playerId: string, stats: Player['stats']) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t
        return {
          ...t,
          roster: t.roster.map((p) => (p.id === playerId ? { ...p, stats } : p)),
        }
      })
    )
  }

  const updatePlayerDetails = (
    teamId: string,
    playerId: string,
    details: Partial<Omit<Player, 'id' | 'stats'>>
  ) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t
        return {
          ...t,
          roster: t.roster.map((p) => (p.id === playerId ? { ...p, ...details } : p)),
        }
      })
    )
  }

  const deletePlayerFromTeam = (teamId: string, playerId: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t
        return {
          ...t,
          roster: t.roster.filter((p) => p.id !== playerId),
        }
      })
    )
  }

  /* ─── CSV scoresheet parser ─── */
  const uploadScoresheet = (
    teamId: string,
    csvContent: string,
    gameOutcome?: 'W' | 'L',
    gameScore?: string
  ): string => {
    const lines = csvContent
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
    if (lines.length < 2) {
      return 'Error: Empty or malformed CSV file. Needs at least header and one data row.'
    }

    // Header validation (Name, Number, PTS, REB, AST, STL, FG%)
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
    const nameIdx = headers.indexOf('player name') !== -1 ? headers.indexOf('player name') : headers.indexOf('name')
    const ptsIdx = headers.indexOf('pts') !== -1 ? headers.indexOf('pts') : headers.indexOf('points')
    const rebIdx = headers.indexOf('reb') !== -1 ? headers.indexOf('reb') : headers.indexOf('rebounds')
    const astIdx = headers.indexOf('ast') !== -1 ? headers.indexOf('ast') : headers.indexOf('assists')
    const stlIdx = headers.indexOf('stl') !== -1 ? headers.indexOf('stl') : headers.indexOf('steals')
    const fgIdx = headers.indexOf('fg%') !== -1 ? headers.indexOf('fg%') : headers.indexOf('fg_pct')

    if (nameIdx === -1) {
      return 'Error: CSV must contain a "Player Name" column.'
    }

    let updatedCount = 0
    const matchedTeam = teams.find((t) => t.id === teamId)
    if (!matchedTeam) {
      return 'Error: Selected team not found.'
    }

    // Process each line in box score
    const updatedRoster = matchedTeam.roster.map((p) => {
      const matchRow = lines.slice(1).find((line) => {
        const cols = line.split(',')
        return cols[nameIdx]?.trim().toLowerCase() === p.name.toLowerCase()
      })

      if (!matchRow) return p // No data in this box score, keep stats unchanged

      const cols = matchRow.split(',')
      const pts = ptsIdx !== -1 ? parseFloat(cols[ptsIdx]) || 0 : p.stats.ppg
      const reb = rebIdx !== -1 ? parseFloat(cols[rebIdx]) || 0 : p.stats.rpg
      const ast = astIdx !== -1 ? parseFloat(cols[astIdx]) || 0 : p.stats.apg
      const stl = stlIdx !== -1 ? parseFloat(cols[stlIdx]) || 0 : p.stats.spg
      const fg = fgIdx !== -1 ? parseFloat(cols[fgIdx]) || 0 : p.stats.fgPct

      updatedCount++

      // Weighted moving average: 90% season average, 10% new box score performance
      return {
        ...p,
        stats: {
          ppg: +((p.stats.ppg * 9 + pts) / 10).toFixed(1),
          rpg: +((p.stats.rpg * 9 + reb) / 10).toFixed(1),
          apg: +((p.stats.apg * 9 + ast) / 10).toFixed(1),
          spg: +((p.stats.spg * 9 + stl) / 10).toFixed(1),
          fgPct: +((p.stats.fgPct * 9 + fg) / 10).toFixed(1),
        },
      }
    })

    // Update Team Roster State
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t
        
        // Update W-L record if provided
        let newRecord = t.record
        if (gameOutcome) {
          const [wins, losses] = t.record.split('-').map(Number)
          if (gameOutcome === 'W') {
            newRecord = `${wins + 1}-${losses}`
          } else {
            newRecord = `${wins}-${losses + 1}`
          }
        }

        return { ...t, roster: updatedRoster, record: newRecord }
      })
    )

    // Add game event to calendar history if score and outcome are available
    if (gameOutcome && gameScore) {
      const newGameResult: ScheduleEvent = {
        id: 'result-' + Date.now(),
        type: 'game',
        title: `vs Box Score Opponent (${gameOutcome === 'W' ? 'Win' : 'Loss'})`,
        date: new Date().toISOString().split('T')[0],
        time: '7:00 PM',
        location: 'EcoHoops Arena',
        opponent: 'Box Score Opponent',
        rsvp: { going: 12, maybe: 0, notGoing: 0, total: 12 },
        result: {
          score: gameScore,
          outcome: gameOutcome
        }
      }
      addEvent(newGameResult)
    }

    return `Success: Processed scoresheet. Recalculated averages for ${updatedCount} players.`
  }

  /* ─── ATTENDANCE & RSVP MODIFIERS ─── */
  const recordAttendance = (
    eventId: string,
    playerId: string,
    status: 'going' | 'maybe' | 'notGoing',
    note?: string
  ) => {
    setSchedule((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e

        const currentAttendance = e.attendance || {}
        const prevRecord = currentAttendance[playerId]
        const prevStatus = prevRecord?.status

        // Recalculate RSVP counter numbers
        const rsvp = { ...e.rsvp }
        if (prevStatus === 'going') rsvp.going = Math.max(0, rsvp.going - 1)
        if (prevStatus === 'maybe') rsvp.maybe = Math.max(0, rsvp.maybe - 1)
        if (prevStatus === 'notGoing') rsvp.notGoing = Math.max(0, rsvp.notGoing - 1)

        if (status === 'going') rsvp.going++
        if (status === 'maybe') rsvp.maybe++
        if (status === 'notGoing') rsvp.notGoing++

        if (!prevStatus) {
          rsvp.total++
        }

        const newAttendance = {
          ...currentAttendance,
          [playerId]: {
            status,
            note: note ?? prevRecord?.note,
            checkedIn: prevRecord?.checkedIn ?? false,
            updatedAt: new Date().toISOString(),
          },
        }

        return {
          ...e,
          rsvp,
          attendance: newAttendance,
        }
      })
    )
  }

  const checkInPlayer = (eventId: string, playerId: string, checkedIn: boolean) => {
    setSchedule((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const currentAttendance = e.attendance || {}
        const existing = currentAttendance[playerId] || { status: 'going' }

        return {
          ...e,
          attendance: {
            ...currentAttendance,
            [playerId]: {
              ...existing,
              checkedIn,
              updatedAt: new Date().toISOString(),
            },
          },
        }
      })
    )
  }

  const downloadCalendarIcs = (calendarTitle = 'EcoHoops Schedule') => {
    const sanitize = (str: string) => (str || '').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EcoHoops Coaching//Team Calendar//EN',
      `X-WR-CALNAME:${calendarTitle}`,
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ]

    schedule.forEach((ev) => {
      const dt = ev.date.replace(/-/g, '')
      icsLines.push(
        'BEGIN:VEVENT',
        `UID:${ev.id}@ecohoops.ca`,
        `DTSTAMP:${dt}T120000Z`,
        `DTSTART:${dt}T180000Z`,
        `DTEND:${dt}T193000Z`,
        `SUMMARY:${sanitize(ev.title)}`,
        `LOCATION:${sanitize(ev.location)}`,
        `DESCRIPTION:${sanitize(`${ev.type.toUpperCase()} - ${ev.time} at ${ev.location}${ev.opponent ? ` vs ${ev.opponent}` : ''}`)}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      )
    })

    icsLines.push('END:VCALENDAR')
    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', 'ecohoops-team-schedule.ics')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /* ─── MESSAGING MODIFIERS ─── */
  const sendMessage = (channel: string, content: string, sender: string) => {
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      sender,
      content,
      timestamp: 'Just now',
      channel,
      unread: sender !== 'Coach Adrian'
    }
    setMessages((prev) => [...prev, newMsg])
  }

  /* ─── PAYMENT MODIFIERS ─── */
  const updatePaymentStatus = (paymentId: string, status: PaymentRecord['status']) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status } : p))
    )
  }

  const value = {
    teams,
    schedule,
    payments,
    messages,
    addEvent,
    deleteEvent,
    updateEvent,
    updateTeamRecord,
    addPlayerToTeam,
    updatePlayerStats,
    updatePlayerDetails,
    deletePlayerFromTeam,
    uploadScoresheet,
    recordAttendance,
    checkInPlayer,
    downloadCalendarIcs,
    sendMessage,
    updatePaymentStatus,
    clearSchedule,
    clearAllData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
