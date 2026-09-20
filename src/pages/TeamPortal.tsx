import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Calendar, Users, Shield, Clock, MapPin, CheckCircle2,
  AlertTriangle, Mail, Phone, ChevronDown, ChevronUp, Download, Send,
  ExternalLink, Lock, Trophy, Plus, X, Check, Dumbbell, Sparkles
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  getSentNotifications,
  dispatchTeamNotification
} from '../lib/email-service'
import type { ScheduleEvent, Player, CoachProfile } from '../types'
import {
  U16_BOYS_SCHEDULE,
  U15_GIRLS_SCHEDULE,
  BOYS_PRACTICE_RULES,
  GIRLS_PRACTICE_RULES,
  BOYS_NO_PRACTICE_DATES,
  GIRLS_NO_PRACTICE_DATES,
  FRIDAY_CONFIG,
  FRIDAY_NO_GYM_DATES,
  OBA_ONTARIO_CUP_STATUS
} from '../data/schedule'

type HubView = 'games' | 'practices' | 'roster'

export default function TeamPortal() {
  const { teamId: paramTeamId } = useParams<{ teamId?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { userProfile, isAdmin, isCoach, isParent, isTeamMember, scopedTeamId } = useAuth()
  const { teams, schedule, recordAttendance, downloadCalendarIcs, addEvent } = useData()

  // Determine active squad: U16 Boys or U15 Girls
  const resolvedParamTeamId = useMemo(() => {
    const path = location.pathname.toLowerCase()
    if (path.includes('girls') || paramTeamId?.includes('girls')) return 'u15-girls'
    if (path.includes('boys') || paramTeamId?.includes('boys')) return 'u16-boys'
    return null
  }, [paramTeamId, location.pathname])

  const [selectedTeamId, setSelectedTeamId] = useState<string>(() => {
    if (resolvedParamTeamId) return resolvedParamTeamId
    if (scopedTeamId) return scopedTeamId
    return 'u16-boys'
  })

  useEffect(() => {
    if (resolvedParamTeamId) {
      setSelectedTeamId(resolvedParamTeamId)
    } else if (scopedTeamId && !isAdmin && !isCoach) {
      setSelectedTeamId(scopedTeamId)
    }
  }, [resolvedParamTeamId, scopedTeamId, isAdmin, isCoach])

  // Active Team Object
  const currentTeam = useMemo(() => {
    return teams.find((t) => t.id === selectedTeamId) || teams[0]
  }, [teams, selectedTeamId])

  useDocumentTitle(currentTeam ? `${currentTeam.name} | Team Hub` : 'Team Hub', { noindex: true })

  // Active View Tab
  const [activeView, setActiveView] = useState<HubView>('games')
  const [showClosures, setShowClosures] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Coach Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [broadcastSubject, setBroadcastSubject] = useState('')
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [broadcastSending, setBroadcastSending] = useState(false)

  // Selected Player for RSVP
  const [selectedRsvpPlayerId, setSelectedRsvpPlayerId] = useState<string>(() => {
    return localStorage.getItem('ecohoops_parent_player_id') || ''
  })

  const effectivePlayerId = useMemo(() => {
    if (selectedRsvpPlayerId) return selectedRsvpPlayerId
    if (isParent && userProfile?.children?.[0]?.id) return userProfile.children[0].id
    if (userProfile?.playerId) return userProfile.playerId
    return currentTeam?.roster?.[0]?.id || 'player-1'
  }, [selectedRsvpPlayerId, isParent, userProfile, currentTeam])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleRsvp = (eventId: string, status: 'going' | 'maybe' | 'notGoing') => {
    recordAttendance(eventId, effectivePlayerId, status)
    const p = currentTeam?.roster?.find((r) => r.id === effectivePlayerId)
    const pLabel = p ? ` for ${p.name}` : ''
    showToast(`RSVP updated: ${status === 'going' ? 'Attending ✓' : status === 'maybe' ? 'Maybe ⏱️' : 'Can\'t Attend ✕'}${pLabel}`)
  }

  // Next Upcoming Event
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const nextTeamEvent = useMemo(() => {
    if (!currentTeam) return null
    const allForTeam = schedule
      .filter((e) => e.teamId === currentTeam.id || e.teamId === 'all' || !e.teamId)
      .sort((a, b) => a.date.localeCompare(b.date))
    return allForTeam.find((e) => e.date >= todayStr) || allForTeam[0] || null
  }, [schedule, currentTeam, todayStr])

  // Check if current week has a holiday closure
  const currentWeekClosure = useMemo(() => {
    const isBoys = selectedTeamId === 'u16-boys'
    const closures = isBoys ? BOYS_NO_PRACTICE_DATES : GIRLS_NO_PRACTICE_DATES
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now.setDate(diff))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    const monStr = monday.toISOString().split('T')[0]
    const sunStr = sunday.toISOString().split('T')[0]
    return closures.find((c) => c.date >= monStr && c.date <= sunStr) || null
  }, [selectedTeamId])

  // Handle Coach Announcement
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) return
    setBroadcastSending(true)

    const result = await dispatchTeamNotification({
      team: currentTeam,
      eventType: 'coach_announcement',
      customSubject: broadcastSubject.trim(),
      customMessage: broadcastMessage.trim()
    })

    setBroadcastSending(false)
    setShowBroadcastModal(false)
    setBroadcastSubject('')
    setBroadcastMessage('')
    showToast(`Sent email alert to ${result.notification.recipientCount} families!`)
  }

  // Lock screen if not authorized
  if (!isTeamMember) {
    return (
      <section className="pt-32 pb-24 min-h-screen bg-[#060A10] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-lg p-8 sm:p-12 text-center border-2 border-white/10 bg-[#0B131E] rounded-3xl shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-[#97B3D2]/10 border border-[#97B3D2]/30 flex items-center justify-center mx-auto mb-6 text-[#97B3D2]">
            <Lock size={36} />
          </div>
          <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#97B3D2] font-mono text-xs uppercase tracking-widest inline-block mb-3">
            Private Access
          </span>
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white mb-3">
            Team Members Only
          </h1>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            This hub is private for registered EcoHoops families. Please tap the secret link pinned in your team's WhatsApp group to enter.
          </p>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 font-mono">
            No password needed — simply tap the link from your WhatsApp group.
          </div>
        </div>
      </section>
    )
  }

  const isBoys = selectedTeamId === 'u16-boys'
  const currentSchedule = isBoys ? U16_BOYS_SCHEDULE : U15_GIRLS_SCHEDULE
  const practiceRules = isBoys ? BOYS_PRACTICE_RULES : GIRLS_PRACTICE_RULES
  const noPracticeDates = isBoys ? BOYS_NO_PRACTICE_DATES : GIRLS_NO_PRACTICE_DATES

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#060A10] text-white font-sans selection:bg-[#97B3D2] selection:text-[#060A10]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-[#97B3D2] text-[#060A10] font-heading font-extrabold text-sm uppercase tracking-wider shadow-2xl flex items-center gap-2.5"
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* TOP HEADER: Clean, Bold, Direct */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-heading font-extrabold uppercase tracking-wider border ${
                isBoys
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-pink-500/20 text-pink-300 border-pink-500/40'
              }`}>
                {isBoys ? '🏀 U16 Boys Squad' : '🌸 U15 Girls Squad'}
              </span>
              <span className="text-xs font-mono text-white/50">2026–2027 Season</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {currentTeam.name} <span className="text-[#97B3D2]">Team Hub</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Squad Switcher (if coach or admin) */}
            {(isAdmin || isCoach) && (
              <div className="flex items-center gap-1 bg-[#0B131E] p-1.5 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTeamId('u16-boys')
                    navigate('/hub/u16-boys', { replace: true })
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all ${
                    isBoys
                      ? 'bg-[#97B3D2] text-[#060A10] shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Boys
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTeamId('u15-girls')
                    navigate('/hub/u15-girls', { replace: true })
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all ${
                    !isBoys
                      ? 'bg-pink-400 text-[#060A10] shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Girls
                </button>
              </div>
            )}

            {/* Quick Calendar Sync Button */}
            <button
              type="button"
              onClick={() => downloadCalendarIcs(`${currentTeam.name} Schedule`)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
              title="Download calendar file for iPhone, Google, or Outlook"
            >
              <Download size={15} className="text-[#97B3D2]" />
              <span className="hidden sm:inline">Sync Calendar</span>
              <span className="sm:hidden">Calendar</span>
            </button>
          </div>
        </div>

        {/* HERO CARD: NEXT EVENT (High Priority, Instant Clarity) */}
        <div className="rounded-3xl border-2 border-white/15 bg-gradient-to-br from-[#0F1B2B] via-[#0B131E] to-[#060A10] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Holiday Alert if any this week */}
          {currentWeekClosure && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-start gap-3.5 text-amber-200">
              <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={22} />
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  NO PRACTICE THIS WEEK ({currentWeekClosure.dayOfWeek}, {currentWeekClosure.date})
                </div>
                <div className="text-sm font-medium text-white/90 mt-0.5">
                  {currentWeekClosure.reason} at {currentWeekClosure.venue}.
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-[#97B3D2] text-[#060A10]">
                  ⚡ NEXT UP
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-white/60">
                  {nextTeamEvent?.type === 'game' ? 'Game Session' : 'Team Practice'}
                </span>
              </div>

              {nextTeamEvent ? (
                <>
                  <div className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                    {new Date(nextTeamEvent.date + 'T12:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-base font-bold text-[#97B3D2]">
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span>{nextTeamEvent.time}</span>
                    </div>
                    <span className="text-white/30">&middot;</span>
                    <div className="flex items-center gap-2 text-white">
                      <MapPin size={18} className="text-[#97B3D2]" />
                      <span>{nextTeamEvent.location}</span>
                    </div>
                  </div>

                  {/* Map Link Button */}
                  <div className="pt-1">
                    <a
                      href={nextTeamEvent.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextTeamEvent.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#97B3D2] hover:text-white underline underline-offset-4 transition-colors"
                    >
                      <span>Get Directions on Maps</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-base text-white/70">No upcoming events scheduled right now.</p>
              )}
            </div>

            {/* BIG TACTILE RSVP BUTTONS */}
            {nextTeamEvent && (
              <div className="p-5 rounded-2xl bg-[#060A10]/70 border border-white/10 flex-shrink-0 space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs font-heading font-bold uppercase tracking-wider text-white/70">
                  <span>Quick RSVP</span>
                  {currentTeam.roster.length > 0 && (
                    <select
                      value={effectivePlayerId}
                      onChange={(e) => {
                        setSelectedRsvpPlayerId(e.target.value)
                        localStorage.setItem('ecohoops_parent_player_id', e.target.value)
                      }}
                      className="bg-transparent text-xs text-[#97B3D2] font-semibold focus:outline-none cursor-pointer text-right max-w-[140px] truncate"
                    >
                      {currentTeam.roster.map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#0B131E] text-white">
                          #{p.number} {p.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRsvp(nextTeamEvent.id, 'going')}
                    className={`py-3 px-4 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                      nextTeamEvent.attendance?.[effectivePlayerId]?.status === 'going'
                        ? 'bg-emerald-500 text-[#060A10] shadow-lg scale-105'
                        : 'bg-white/5 hover:bg-emerald-500/20 text-white/80 hover:text-emerald-300'
                    }`}
                  >
                    <Check size={16} />
                    <span>Going</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRsvp(nextTeamEvent.id, 'maybe')}
                    className={`py-3 px-4 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                      nextTeamEvent.attendance?.[effectivePlayerId]?.status === 'maybe'
                        ? 'bg-amber-400 text-[#060A10] shadow-lg scale-105'
                        : 'bg-white/5 hover:bg-amber-400/20 text-white/80 hover:text-amber-300'
                    }`}
                  >
                    <Clock size={16} />
                    <span>Maybe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRsvp(nextTeamEvent.id, 'notGoing')}
                    className={`py-3 px-4 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                      nextTeamEvent.attendance?.[effectivePlayerId]?.status === 'notGoing'
                        ? 'bg-rose-500 text-white shadow-lg scale-105'
                        : 'bg-white/5 hover:bg-rose-500/20 text-white/80 hover:text-rose-300'
                    }`}
                  >
                    <X size={16} />
                    <span>Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3 GIANT SEGMENTED TABS (Effortless Navigation) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 bg-[#0B131E] rounded-3xl border-2 border-white/10">
          <button
            type="button"
            onClick={() => setActiveView('games')}
            className={`py-3.5 sm:py-4 px-3 rounded-2xl text-xs sm:text-base font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeView === 'games'
                ? 'bg-[#97B3D2] text-[#060A10] shadow-lg scale-[1.02]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy size={18} />
            <span>Games</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('practices')}
            className={`py-3.5 sm:py-4 px-3 rounded-2xl text-xs sm:text-base font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeView === 'practices'
                ? 'bg-[#97B3D2] text-[#060A10] shadow-lg scale-[1.02]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Dumbbell size={18} />
            <span>Practices</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('roster')}
            className={`py-3.5 sm:py-4 px-3 rounded-2xl text-xs sm:text-base font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeView === 'roster'
                ? 'bg-[#97B3D2] text-[#060A10] shadow-lg scale-[1.02]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={18} />
            <span>Roster</span>
          </button>
        </div>

        {/* VIEW 1: GAME DATES (Bold, Scannable Cards) */}
        {activeView === 'games' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                Confirmed Season Game Weekends
              </h2>
              <span className="text-xs font-mono text-[#97B3D2]">
                {currentSchedule.length} Sessions
              </span>
            </div>

            <div className="space-y-3">
              {currentSchedule.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 sm:p-6 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    item.isPlayoffs
                      ? 'bg-gradient-to-r from-amber-500/20 via-[#0B131E] to-[#0B131E] border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.15)]'
                      : item.isAllStar
                      ? 'bg-gradient-to-r from-purple-500/20 via-[#0B131E] to-[#0B131E] border-purple-400/50'
                      : 'bg-[#0B131E] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border ${
                        item.league === 'Coalition'
                          ? 'bg-amber-500/15 text-amber-200 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-200 border-rose-500/30'
                      }`}>
                        <img
                          src={item.league === 'Coalition' ? '/images/branding/coalition-logo.png' : '/images/branding/obl-logo.jpg'}
                          alt={item.league}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{item.league}</span>
                      </span>

                      {item.isPlayoffs && (
                        <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-400 text-[#060A10] flex items-center gap-1">
                          <Trophy size={13} /> Playoffs
                        </span>
                      )}

                      {item.isAllStar && (
                        <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-purple-400/20 text-purple-200 border border-purple-400/40 flex items-center gap-1">
                          <Sparkles size={13} /> All-Star
                        </span>
                      )}
                    </div>

                    <div className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
                      {item.dateRange}
                    </div>

                    <div className="text-xs font-mono text-white/60">
                      {item.sessionType} &middot; Confirmed League Weekend
                    </div>
                  </div>

                  <div className="self-start sm:self-auto">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-[#97B3D2]">
                      Confirmed
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* OBA Ontario Cup Status Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/40 via-[#0B131E] to-[#0B131E] border-2 border-sky-500/30 mt-6 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/branding/obl-logo.jpg"
                    alt="OBA"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <h3 className="font-heading font-black text-lg uppercase text-white">
                    {OBA_ONTARIO_CUP_STATUS.title}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold">
                  {OBA_ONTARIO_CUP_STATUS.dateLabel}
                </span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {OBA_ONTARIO_CUP_STATUS.details}
              </p>
            </div>
          </div>
        )}

        {/* VIEW 2: PRACTICES & FRIDAYS (Minimal, Card-based) */}
        {activeView === 'practices' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                Weekly Practice Times
              </h2>
              <span className="text-xs font-mono text-emerald-400">
                ✓ Approved Gym Permits
              </span>
            </div>

            {/* 2 Main Weekly Practice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practiceRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-6 sm:p-7 rounded-3xl bg-[#0B131E] border-2 border-white/10 space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-xl bg-[#97B3D2]/15 text-[#97B3D2] border border-[#97B3D2]/30 text-xs font-black uppercase tracking-wider">
                      {rule.dayOfWeek}
                    </span>
                    <span className="text-xs font-mono text-white/50">Required</span>
                  </div>

                  <div>
                    <div className="text-3xl font-black text-white">
                      {rule.time}
                    </div>
                    <div className="text-base font-bold text-[#97B3D2] mt-1 flex items-center gap-1.5">
                      <MapPin size={16} />
                      <span>{rule.venue}</span>
                    </div>
                    <a
                      href={rule.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/60 hover:text-white underline underline-offset-2 block mt-1 transition-colors"
                    >
                      {rule.address}
                    </a>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs font-mono text-white/60 flex items-center justify-between">
                    <span>{new Date(rule.firstDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(rule.finalDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Friday Night Hoops Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0F1B2B] via-[#0B131E] to-[#060A10] border-2 border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-black uppercase tracking-wider">
                  FRIDAYS
                </span>
                <span className="text-xs font-mono text-cyan-300 font-bold">Both Teams</span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {FRIDAY_CONFIG.time}
                </div>
                <div className="text-base font-bold text-cyan-300 mt-1 flex items-center gap-1.5">
                  <MapPin size={16} />
                  <span>{FRIDAY_CONFIG.venue}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-xs font-black uppercase tracking-wider text-[#97B3D2]">
                    Phase 1 (Sept 25 – Nov 6)
                  </div>
                  <p className="text-xs text-white/80">
                    Mandatory joint technical practice before competitive games start.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Phase 2: Friday Night Hoops (Nov 13 – Apr 30)
                  </div>
                  <p className="text-xs text-white/80">
                    Optional drop-in shooting, reps, and extra court time.
                  </p>
                </div>
              </div>
            </div>

            {/* Collapsible No-Practice Dates Accordion */}
            <div className="rounded-3xl border-2 border-white/10 bg-[#0B131E] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowClosures(!showClosures)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div>
                  <h3 className="font-heading font-black text-base uppercase tracking-wider text-white flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-400" />
                    <span>View Holiday & No-Practice Dates ({noPracticeDates.length})</span>
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Tap to check school holidays and gym closures
                  </p>
                </div>
                {showClosures ? <ChevronUp size={20} className="text-white/60" /> : <ChevronDown size={20} className="text-white/60" />}
              </button>

              {showClosures && (
                <div className="p-5 sm:p-6 pt-0 border-t border-white/10 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
                    {noPracticeDates.map((np, idx) => (
                      <div
                        key={`${np.date}-${idx}`}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-white">
                          {new Date(np.date + 'T12:00:00').toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-rose-300 font-mono text-[11px] uppercase">{np.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: ROSTER & COACHES */}
        {activeView === 'roster' && (
          <div className="space-y-8">
            {/* Coaching Staff */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white px-1">
                Coaching Staff
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(currentTeam.coaches || []).map((coach: CoachProfile) => (
                  <div
                    key={coach.id}
                    className="p-6 rounded-3xl bg-[#0B131E] border-2 border-white/10 space-y-4"
                  >
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#97B3D2]/15 text-[#97B3D2] border border-[#97B3D2]/30">
                        {coach.role}
                      </span>
                      <h3 className="text-2xl font-black uppercase text-white mt-2">
                        {coach.name}
                      </h3>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      {coach.phone && (
                        <a
                          href={`tel:${coach.phone.replace(/[^0-9]/g, '')}`}
                          className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                        >
                          <Phone size={14} className="text-[#97B3D2]" />
                          <span>{coach.phone}</span>
                        </a>
                      )}
                      <a
                        href={`mailto:${coach.email}?subject=[EcoHoops ${currentTeam.name}] Inquiry`}
                        className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                      >
                        <Mail size={14} className="text-[#97B3D2]" />
                        <span>{coach.email}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Athlete Roster */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Team Roster
                </h2>
                <span className="text-xs font-mono text-white/50">
                  {currentTeam.roster.length} Players
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {currentTeam.roster.map((player: Player) => (
                  <div
                    key={player.id}
                    className="p-5 rounded-3xl bg-[#0B131E] border-2 border-white/10 flex flex-col items-center text-center space-y-2"
                  >
                    <span className="text-3xl font-black font-mono text-[#97B3D2]">
                      #{player.number}
                    </span>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                      {player.name}
                    </h4>
                    <span className="text-[11px] font-mono text-white/50 uppercase">
                      {player.position || 'G/F'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COACH ONLY QUICK ACTIONS (Discrete, Non-distracting) */}
        {(isAdmin || isCoach) && (
          <div className="p-5 rounded-3xl bg-[#0B131E] border border-white/10 flex flex-wrap items-center justify-between gap-4 mt-12">
            <span className="text-xs font-mono uppercase tracking-wider text-white/60">
              Staff Tools:
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 rounded-xl bg-[#97B3D2] text-[#060A10] text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Send size={13} /> Email Families
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Broadcast Modal for Coach Announcements */}
      <AnimatePresence>
        {showBroadcastModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B131E] border-2 border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-black text-xl text-white">
                  Email {currentTeam.name} Families
                </h3>
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`[EcoHoops ${currentTeam.name}] Schedule Notice`}
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    className="w-full bg-[#060A10] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#97B3D2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter update details..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full bg-[#060A10] border border-white/15 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#97B3D2]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={broadcastSending}
                    className="px-5 py-2.5 rounded-xl bg-[#97B3D2] text-[#060A10] font-heading font-extrabold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    {broadcastSending ? 'Sending...' : 'Send Alert'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
