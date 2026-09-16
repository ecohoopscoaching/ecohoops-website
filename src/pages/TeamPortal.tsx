import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Calendar, Users, Shield, Clock, MapPin, CheckCircle2,
  AlertTriangle, Mail, Phone, ChevronRight, Download, Send,
  Sparkles, Bell, ExternalLink, Info, Filter, ArrowRight, UserCheck, X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  getSentNotifications,
  downloadEventIcs,
  dispatchTeamNotification
} from '../lib/email-service'
import type { ScheduleEvent, Player, CoachProfile, Team } from '../types'

type PortalTab = 'schedule' | 'roster' | 'coaches' | 'emails'

export default function TeamPortal() {
  const { teamId: paramTeamId } = useParams<{ teamId?: string }>()
  const navigate = useNavigate()
  const { currentUser, userProfile, userRole, isAdmin, isCoach, isParent, loginAsRole } = useAuth()
  const { teams, schedule, recordAttendance, downloadCalendarIcs } = useData()

  // Determine authorized teams for current user
  const userTeamIds = useMemo(() => {
    if (isAdmin || isCoach) {
      return teams.map((t) => t.id)
    }
    const ids: string[] = []
    if (userProfile?.teamId) ids.push(userProfile.teamId)
    if (userProfile?.children) {
      userProfile.children.forEach((c) => {
        if (c.teamId && !ids.includes(c.teamId)) ids.push(c.teamId)
      })
    }
    return ids
  }, [isAdmin, isCoach, userProfile, teams])

  // Active Team Selection
  const [selectedTeamId, setSelectedTeamId] = useState<string>(() => {
    if (paramTeamId && teams.some((t) => t.id === paramTeamId)) {
      return paramTeamId
    }
    if (userTeamIds.length > 0) {
      const match = teams.find((t) => userTeamIds.includes(t.id))
      return match ? match.id : teams[0]?.id || ''
    }
    return teams[0]?.id || ''
  })

  // Selected Team Object
  const currentTeam = useMemo(() => {
    return teams.find((t) => t.id === selectedTeamId) || teams[0]
  }, [teams, selectedTeamId])

  useDocumentTitle(currentTeam ? `${currentTeam.name} | Team Portal` : 'Team Portal')

  // Check access authorization
  const hasAccess = isAdmin || isCoach || userTeamIds.includes(selectedTeamId)

  // Active Tab State
  const [activeTab, setActiveTab] = useState<PortalTab>('schedule')

  // Schedule Filter State
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'game' | 'practice' | 'tournament'>('all')

  // Email Announcements State
  const [notifications, setNotifications] = useState(() => getSentNotifications(selectedTeamId))
  const [selectedEmailModal, setSelectedEmailModal] = useState<any>(null)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [broadcastSubject, setBroadcastSubject] = useState('')
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [broadcastSending, setBroadcastSending] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Refresh notifications when team changes
  const teamNotifications = useMemo(() => {
    return getSentNotifications(selectedTeamId)
  }, [selectedTeamId, notifications])

  // Team Events Filter
  const teamEvents = useMemo(() => {
    if (!currentTeam) return []
    return schedule
      .filter((e) => {
        const matchesTeam = e.teamId === currentTeam.id || e.teamId === 'all' || !e.teamId
        const matchesType = eventTypeFilter === 'all' || e.type === eventTypeFilter
        return matchesTeam && matchesType
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [schedule, currentTeam, eventTypeFilter])

  // Current user's player ID for RSVP
  const activePlayerId = useMemo(() => {
    if (isParent) {
      const matchedChild = userProfile?.children?.find((c) => c.teamId === currentTeam?.id)
      return matchedChild?.id || userProfile?.children?.[0]?.id || 'child-1'
    }
    return userProfile?.playerId || 'player-1'
  }, [isParent, userProfile, currentTeam])

  // Handle Parent RSVP
  const handleRsvp = (eventId: string, status: 'going' | 'maybe' | 'notGoing') => {
    recordAttendance(eventId, activePlayerId, status)
    showToast(`RSVP updated to: ${status === 'going' ? 'Attending' : status === 'maybe' ? 'Maybe' : 'Can\'t Attend'}`)
  }

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Handle Coach Broadcast Dispatch
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
    setNotifications(getSentNotifications(selectedTeamId))
    showToast(`Dispatched email alert to ${result.notification.recipientCount} parents!`)
  }

  if (!currentTeam) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center text-white">
        <p>No team data available.</p>
      </div>
    )
  }

  return (
    <section className="pt-28 pb-20 min-h-screen relative overflow-hidden bg-eco-black text-white">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#00D26A] text-[#060A10] font-heading font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm tracking-wide"
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Access Warning Card if visitor does not belong to team */}
        {!hasAccess && (
          <div className="mb-8 p-6 rounded-2xl bg-red-950/30 border border-red-500/40 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Restricted Rep Team Portal</h3>
                <p className="text-xs text-eco-muted-light">
                  This hub contains private gym locations, door codes, and parent logistics. You are currently viewing as a guest or another division.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => loginAsRole('parent')}
                className="px-4 py-2 rounded-xl bg-eco-blue text-eco-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-glow-sm"
              >
                Log In As Sarah Jenkins (Parent)
              </button>
              <button
                onClick={() => loginAsRole('coach')}
                className="px-4 py-2 rounded-xl bg-eco-surface border border-eco-border text-white font-heading text-xs uppercase tracking-wider hover:bg-eco-surface2 transition-all"
              >
                Log In As Coach
              </button>
            </div>
          </div>
        )}

        {/* Team Hero Header */}
        <div className="relative rounded-3xl overflow-hidden border border-eco-border bg-gradient-to-b from-eco-surface2 to-eco-surface p-6 sm:p-10 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#97B3D2]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar: Multi-child Switcher / Team Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-[#97B3D2]/20 text-[#97B3D2] border border-[#97B3D2]/30 flex items-center gap-1.5">
                <Shield size={12} /> Rep Team Hub
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30 flex items-center gap-1.5">
                <Bell size={12} className="animate-pulse" /> Email Alerts Active
              </span>
            </div>

            {/* Team or Child Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-eco-muted font-heading uppercase tracking-wider hidden sm:inline">
                Division:
              </span>
              <div className="flex items-center gap-1 bg-eco-black/60 p-1 rounded-xl border border-eco-border">
                {teams.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTeamId(t.id)
                      navigate(`/team-portal/${t.id}`, { replace: true })
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
                      selectedTeamId === t.id
                        ? 'bg-[#97B3D2] text-[#060A10] shadow-sm font-bold'
                        : 'text-eco-muted hover:text-white'
                    }`}
                  >
                    {t.name} ({t.gender === 'Girls' ? 'Girls' : 'Boys'})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Team Banner Content */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-[#97B3D2] font-semibold">{currentTeam.season}</span>
                <span className="text-eco-muted">&middot;</span>
                <span className="text-sm font-mono text-white/80">{currentTeam.ageGroup}</span>
                <span className="text-eco-muted">&middot;</span>
                <span className="text-sm font-mono text-emerald-400 font-bold">Record: {currentTeam.record}</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mb-3">
                {currentTeam.name} <span className="text-[#97B3D2]">{currentTeam.gender} Rep</span>
              </h1>
              <p className="text-sm text-eco-muted-light max-w-2xl leading-relaxed">
                Official private team command center for athletes, parents, and coaching staff. View real-time schedule adjustments, confirm attendance, review scouting reports, and access direct coach contacts.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
              <button
                onClick={() => downloadCalendarIcs(`${currentTeam.name} Schedule`)}
                className="px-4 py-2.5 rounded-xl bg-eco-surface border border-eco-border hover:border-[#97B3D2] text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-eco-surface2"
              >
                <Download size={14} className="text-[#97B3D2]" /> Sync Schedule (.ics)
              </button>

              {(isAdmin || isCoach) && (
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#97B3D2] text-[#060A10] text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-white shadow-glow-sm"
                >
                  <Send size={14} /> Send Parent Email Alert
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="bg-eco-black/40 rounded-xl p-3 border border-white/5">
              <span className="text-[10px] font-mono uppercase text-eco-muted">Roster Size</span>
              <p className="text-xl font-display text-white mt-0.5">{currentTeam.roster.length} Athletes</p>
            </div>
            <div className="bg-eco-black/40 rounded-xl p-3 border border-white/5">
              <span className="text-[10px] font-mono uppercase text-eco-muted">Upcoming Events</span>
              <p className="text-xl font-display text-[#97B3D2] mt-0.5">{teamEvents.length} Scheduled</p>
            </div>
            <div className="bg-eco-black/40 rounded-xl p-3 border border-white/5">
              <span className="text-[10px] font-mono uppercase text-eco-muted">Head Coach</span>
              <p className="text-xl font-display text-white mt-0.5 truncate">
                {currentTeam.coaches?.[0]?.name || 'Coach Adrian'}
              </p>
            </div>
            <div className="bg-eco-black/40 rounded-xl p-3 border border-white/5">
              <span className="text-[10px] font-mono uppercase text-eco-muted">Parents Subscribed</span>
              <p className="text-xl font-display text-emerald-400 mt-0.5">
                {currentTeam.parentContacts?.length || currentTeam.roster.length} Verified
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-eco-border pb-4 mb-8 overflow-x-auto scrollbar-hide">
          {[
            { id: 'schedule' as PortalTab, label: 'Schedule & Upcoming Events', icon: Calendar, count: teamEvents.length },
            { id: 'roster' as PortalTab, label: 'Team Roster', icon: Users, count: currentTeam.roster.length },
            { id: 'coaches' as PortalTab, label: 'Coaching Staff & Contacts', icon: Shield, count: currentTeam.coaches?.length || 2 },
            { id: 'emails' as PortalTab, label: 'Email Notifications & Alerts', icon: Mail, count: teamNotifications.length }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-heading font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#97B3D2] text-[#060A10] font-bold shadow-glow-sm'
                    : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white'
                }`}
              >
                <Icon size={16} />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-[#060A10] text-[#97B3D2]' : 'bg-white/10 text-white'
                }`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Tab 1: Schedule & Events */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-eco-muted" />
                {(['all', 'game', 'practice', 'tournament'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setEventTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
                      eventTypeFilter === type
                        ? 'bg-[#97B3D2]/20 border border-[#97B3D2] text-[#97B3D2]'
                        : 'bg-eco-surface border border-eco-border text-eco-muted hover:text-white'
                    }`}
                  >
                    {type === 'all' ? 'All Events' : type === 'game' ? 'Games' : type === 'practice' ? 'Practices' : 'Tournaments'}
                  </button>
                ))}
              </div>

              <div className="text-xs text-eco-muted font-mono">
                Showing {teamEvents.length} events for {currentTeam.name}
              </div>
            </div>

            {/* Event List Cards */}
            {teamEvents.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-eco-surface border border-eco-border">
                <Calendar size={32} className="mx-auto text-eco-muted mb-3 opacity-50" />
                <h3 className="font-heading font-bold text-base text-white mb-1">No Events Found</h3>
                <p className="text-xs text-eco-muted">There are no upcoming events matching this filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {teamEvents.map((evt) => {
                  const myRsvp = evt.attendance?.[activePlayerId]?.status
                  const eventDate = new Date(evt.date + 'T12:00:00').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })

                  const typeColor =
                    evt.type === 'game'
                      ? 'bg-eco-blue/20 text-eco-blue border-eco-blue/30'
                      : evt.type === 'practice'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/30'

                  return (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-eco-surface border border-eco-border hover:border-eco-border-light transition-all shadow-lg"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Event Details */}
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${typeColor}`}>
                              {evt.type}
                            </span>
                            {evt.opponent && (
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-white border border-white/10">
                                {evt.homeAway === 'home' ? 'Home' : 'Away'} vs {evt.opponent}
                              </span>
                            )}
                            {evt.uniformColor && (
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30">
                                Jersey: {evt.uniformColor}
                              </span>
                            )}
                          </div>

                          <h3 className="font-heading font-bold text-xl text-white">
                            {evt.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-eco-muted font-mono">
                            <div className="flex items-center gap-1.5 text-white">
                              <Calendar size={14} className="text-[#97B3D2]" />
                              <span>{eventDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white">
                              <Clock size={14} className="text-[#97B3D2]" />
                              <span>{evt.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white">
                              <MapPin size={14} className="text-[#97B3D2]" />
                              <span>{evt.location}</span>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evt.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#97B3D2] hover:underline flex items-center gap-0.5 ml-1"
                              >
                                Maps <ExternalLink size={10} />
                              </a>
                            </div>
                          </div>

                          {evt.arrivalNote && (
                            <div className="p-2.5 rounded-xl bg-eco-surface2 border border-[#97B3D2]/20 text-xs text-[#97B3D2] flex items-center gap-2">
                              <Info size={14} className="flex-shrink-0" />
                              <span><strong>Arrival:</strong> {evt.arrivalNote}</span>
                            </div>
                          )}

                          {evt.notes && (
                            <p className="text-xs text-eco-muted-light leading-relaxed">
                              <strong>Notes:</strong> {evt.notes}
                            </p>
                          )}
                        </div>

                        {/* Interactive RSVP & Calendar Actions */}
                        <div className="lg:w-72 flex flex-col gap-3 p-4 rounded-xl bg-eco-surface2 border border-white/5 flex-shrink-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-eco-muted">
                              Attendance RSVP
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">
                              {evt.rsvp?.going || 0} Attending
                            </span>
                          </div>

                          {/* RSVP Buttons */}
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              onClick={() => handleRsvp(evt.id, 'going')}
                              className={`py-2 px-1 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                                myRsvp === 'going'
                                  ? 'bg-[#00D26A] text-[#060A10] shadow-glow-sm'
                                  : 'bg-eco-surface hover:bg-[#00D26A]/20 text-white'
                              }`}
                            >
                              <CheckCircle2 size={14} />
                              <span>Going</span>
                            </button>
                            <button
                              onClick={() => handleRsvp(evt.id, 'maybe')}
                              className={`py-2 px-1 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                                myRsvp === 'maybe'
                                  ? 'bg-amber-400 text-[#060A10]'
                                  : 'bg-eco-surface hover:bg-amber-400/20 text-white'
                              }`}
                            >
                              <Clock size={14} />
                              <span>Maybe</span>
                            </button>
                            <button
                              onClick={() => handleRsvp(evt.id, 'notGoing')}
                              className={`py-2 px-1 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                                myRsvp === 'notGoing'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-eco-surface hover:bg-red-500/20 text-white'
                              }`}
                            >
                              <X size={14} />
                              <span>Out</span>
                            </button>
                          </div>

                          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                            <button
                              onClick={() => downloadEventIcs(evt, currentTeam.name)}
                              className="text-[11px] font-mono text-[#97B3D2] hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <Download size={12} /> Add to Calendar (.ics)
                            </button>
                            <span className="text-[10px] text-eco-muted font-mono">
                              Total: {evt.rsvp?.total || currentTeam.roster.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Roster */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-xl text-white">
                Official {currentTeam.name} Roster ({currentTeam.roster.length} Players)
              </h3>
              <span className="text-xs font-mono text-[#97B3D2]">
                {currentTeam.gender} &middot; {currentTeam.season}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentTeam.roster.map((player: Player) => (
                <div
                  key={player.id}
                  className="group rounded-2xl bg-eco-surface border border-eco-border hover:border-[#97B3D2]/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="font-mono font-bold text-2xl text-[#97B3D2] bg-[#97B3D2]/10 px-3 py-1 rounded-xl border border-[#97B3D2]/20">
                      #{player.number}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-eco-surface2 text-eco-muted border border-eco-border">
                      {player.position || 'G/F'}
                    </span>
                  </div>

                  {/* Player Photo or Avatar */}
                  <div className="w-20 h-20 rounded-full bg-eco-surface2 border-2 border-eco-border mx-auto mb-4 overflow-hidden flex items-center justify-center">
                    {player.avatar ? (
                      <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display text-2xl text-[#97B3D2]">
                        {player.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="text-center">
                    <h4 className="font-heading font-bold text-base text-white group-hover:text-[#97B3D2] transition-colors">
                      {player.name}
                    </h4>
                    <p className="text-xs text-eco-muted mt-1 font-mono">
                      {player.height ? `${player.height} • ` : ''}{player.age > 0 ? `${player.age} yrs` : 'Athlete'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-eco-muted">
                    <span>EcoHoops Rep</span>
                    <Link
                      to={`/player/${currentTeam.id}/${player.id}`}
                      className="text-[#97B3D2] hover:text-white flex items-center gap-0.5"
                    >
                      Profile <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Coaching Staff & Team Manager */}
        {activeTab === 'coaches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-white">Coaching Staff & Contacts</h3>
                <p className="text-xs text-eco-muted mt-1">Direct contact points for team inquiries, logistics, and emergency coordination.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(currentTeam.coaches || []).map((coach: CoachProfile) => (
                <div
                  key={coach.id}
                  className="rounded-2xl bg-eco-surface border border-eco-border p-6 flex flex-col justify-between space-y-4 hover:border-[#97B3D2]/40 transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#97B3D2]/15 border border-[#97B3D2]/30 flex items-center justify-center text-[#97B3D2] font-display text-2xl overflow-hidden flex-shrink-0">
                        {coach.avatar ? (
                          <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                        ) : (
                          coach.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#97B3D2] bg-[#97B3D2]/10 px-2.5 py-0.5 rounded-full">
                          {coach.role}
                        </span>
                        <h4 className="font-heading font-bold text-lg text-white mt-1">{coach.name}</h4>
                      </div>
                    </div>

                    {coach.bio && (
                      <p className="text-xs text-eco-muted-light leading-relaxed mb-4">
                        {coach.bio}
                      </p>
                    )}

                    {coach.certifications && coach.certifications.length > 0 && (
                      <div className="space-y-1.5 mb-4">
                        <span className="text-[10px] font-mono uppercase text-eco-muted tracking-wider">Certifications</span>
                        <div className="flex flex-wrap gap-1.5">
                          {coach.certifications.map((c, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-eco-surface2 text-emerald-300 border border-emerald-500/20">
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <a
                      href={`mailto:${coach.email}?subject=[EcoHoops ${currentTeam.name}] Parent Inquiry`}
                      className="w-full py-2 px-3 rounded-xl bg-eco-surface2 hover:bg-[#97B3D2] hover:text-[#060A10] text-white text-xs font-heading font-semibold flex items-center justify-center gap-2 transition-all border border-white/5"
                    >
                      <Mail size={14} /> {coach.email}
                    </a>
                    {coach.phone && (
                      <a
                        href={`tel:${coach.phone.replace(/[^0-9]/g, '')}`}
                        className="w-full py-2 px-3 rounded-xl bg-eco-surface2 hover:bg-white/10 text-eco-muted-light hover:text-white text-xs font-heading font-semibold flex items-center justify-center gap-2 transition-all border border-white/5"
                      >
                        <Phone size={14} /> {coach.phone}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Parent Rep Contact Directory */}
            {currentTeam.parentContacts && currentTeam.parentContacts.length > 0 && (
              <div className="mt-10 p-6 rounded-2xl bg-eco-surface border border-eco-border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                    <UserCheck className="text-[#97B3D2]" size={18} />
                    Verified Team Parent Directory
                  </h4>
                  <span className="text-xs text-eco-muted font-mono">
                    {currentTeam.parentContacts.length} registered families
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentTeam.parentContacts.map((pc) => (
                    <div key={pc.id} className="p-3 rounded-xl bg-eco-surface2 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white">{pc.name}</span>
                        <div className="text-[10px] text-[#97B3D2] font-mono">
                          Parent of {pc.linkedPlayerName} {pc.linkedPlayerNumber ? `(#${pc.linkedPlayerNumber})` : ''}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-eco-muted">{pc.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Email Notifications & Alert Log */}
        {activeTab === 'emails' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-white">
                  Automated Email Alerts & Dispatch Log
                </h3>
                <p className="text-xs text-eco-muted mt-1">
                  History of all schedule updates, venue notices, and coach alerts dispatched to team parents.
                </p>
              </div>

              {(isAdmin || isCoach) && (
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#97B3D2] text-[#060A10] text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-white self-start sm:self-auto shadow-glow-sm"
                >
                  <Send size={14} /> Send Team Announcement
                </button>
              )}
            </div>

            {teamNotifications.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-eco-surface border border-eco-border">
                <Mail size={32} className="mx-auto text-eco-muted mb-3 opacity-50" />
                <h3 className="font-heading font-bold text-base text-white mb-1">No Alerts Dispatched Yet</h3>
                <p className="text-xs text-eco-muted max-w-md mx-auto">
                  When a coach or admin updates the schedule, changes gym locations, or adds an event, all parents on this team will automatically receive an email alert, and it will be logged here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {teamNotifications.map((notif) => {
                  const sentDate = new Date(notif.sentAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })

                  return (
                    <div
                      key={notif.id}
                      className="p-5 rounded-2xl bg-eco-surface border border-eco-border hover:border-eco-border-light transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30">
                            Delivered to {notif.recipientCount} Parents
                          </span>
                          <span className="text-xs text-eco-muted font-mono">{sentDate}</span>
                        </div>
                        <h4 className="font-heading font-bold text-base text-white">{notif.subject}</h4>
                        <p className="text-xs text-eco-muted font-mono truncate max-w-xl">
                          Recipients: {notif.recipientEmails.slice(0, 3).join(', ')}
                          {notif.recipientEmails.length > 3 ? ` +${notif.recipientEmails.length - 3} more` : ''}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedEmailModal(notif)}
                        className="px-3 py-1.5 rounded-lg bg-eco-surface2 border border-white/10 hover:border-[#97B3D2] text-[#97B3D2] text-xs font-heading font-bold uppercase tracking-wider transition-all self-start sm:self-auto"
                      >
                        Preview Email HTML
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Broadcast Modal for Coaches/Admins */}
      <AnimatePresence>
        {showBroadcastModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-eco-surface border border-[#97B3D2]/40 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                  <Mail className="text-[#97B3D2]" size={18} />
                  Send Email Alert to {currentTeam.name} Parents
                </h3>
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="text-eco-muted hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-eco-muted-light mb-4">
                This will immediately dispatch an EcoHoops-branded email update to all registered parent email addresses for {currentTeam.name} ({currentTeam.parentContacts?.length || 12} recipients).
              </p>

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-eco-muted mb-1">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. [EcoHoops ${currentTeam.name}] Saturday Schedule Update`}
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    className="w-full bg-eco-surface2 border border-eco-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#97B3D2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-eco-muted mb-1">
                    Announcement / Message Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide full details: gym changes, tournament hotel info, uniform reminders, or weather adjustments..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full bg-eco-surface2 border border-eco-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#97B3D2]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-eco-surface2 border border-white/5 flex items-center justify-between text-xs font-mono text-eco-muted">
                  <span>Recipients:</span>
                  <span className="text-[#97B3D2] font-bold">
                    {currentTeam.parentContacts?.length || 12} verified parent emails
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="px-4 py-2 rounded-xl border border-eco-border text-xs text-eco-muted hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={broadcastSending}
                    className="px-5 py-2 rounded-xl bg-[#97B3D2] text-[#060A10] font-heading font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-glow-sm flex items-center gap-2"
                  >
                    {broadcastSending ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send size={14} /> Send Email Blast
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email Preview Modal */}
      <AnimatePresence>
        {selectedEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-eco-surface border border-eco-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#97B3D2] uppercase tracking-widest">
                    Dispatched Email Preview
                  </span>
                  <h3 className="font-heading font-bold text-lg text-white">
                    {selectedEmailModal.subject}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEmailModal(null)}
                  className="text-eco-muted hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="text-xs text-eco-muted font-mono mb-4 pb-3 border-b border-white/5 space-y-1">
                <div><strong>Sent:</strong> {new Date(selectedEmailModal.sentAt).toLocaleString()}</div>
                <div><strong>Delivered To:</strong> {selectedEmailModal.recipientEmails.join(', ')}</div>
              </div>

              <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-[#060A10] p-4">
                <div
                  dangerouslySetInnerHTML={{ __html: selectedEmailModal.body }}
                  className="prose prose-invert max-w-none text-sm"
                />
              </div>

              <div className="flex justify-end pt-4 mt-2">
                <button
                  onClick={() => setSelectedEmailModal(null)}
                  className="px-4 py-2 rounded-xl bg-eco-surface2 border border-white/10 text-white text-xs font-heading font-bold uppercase tracking-wider"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
