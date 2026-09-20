import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Calendar, Users, Shield, Clock, MapPin, CheckCircle2,
  AlertTriangle, Mail, Phone, ChevronRight, Download, Send,
  Sparkles, Bell, ExternalLink, Info, Filter, ArrowRight, UserCheck, X, Plus,
  Copy, Check, Share2, Trophy, Lock
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
import EventNotificationModal from '../components/schedule/EventNotificationModal'
import EmergencyBroadcastModal from '../components/schedule/EmergencyBroadcastModal'

type PortalTab = 'schedule' | 'roster' | 'coaches' | 'emails'

export default function TeamPortal() {
  const { teamId: paramTeamId } = useParams<{ teamId?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, userProfile, userRole, isAdmin, isCoach, isParent, isTeamMember, loginAsRole } = useAuth()
  const { teams, schedule, recordAttendance, downloadCalendarIcs, updateEvent, addEvent, deleteEvent } = useData()

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

  useEffect(() => {
    if (paramTeamId && teams.some((t) => t.id === paramTeamId)) {
      setSelectedTeamId(paramTeamId)
    }
  }, [paramTeamId, teams])

  // Selected Team Object
  const currentTeam = useMemo(() => {
    return teams.find((t) => t.id === selectedTeamId) || teams[0]
  }, [teams, selectedTeamId])

  useDocumentTitle(currentTeam ? `${currentTeam.name} | EcoHoops Team Hub` : 'EcoHoops Team Hub')

  // Check access authorization
  const hasAccess = isAdmin || isCoach || userTeamIds.includes(selectedTeamId)

  // Active Tab State
  const [activeTab, setActiveTab] = useState<PortalTab>('schedule')

  // Schedule Filter State
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'game' | 'practice' | 'tournament'>('all')

  // Email Announcements & Automated Alert Modals State
  const [notifications, setNotifications] = useState(() => getSentNotifications(selectedTeamId))
  const [selectedEmailModal, setSelectedEmailModal] = useState<any>(null)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [broadcastSubject, setBroadcastSubject] = useState('')
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [broadcastSending, setBroadcastSending] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Specific Event Alerts & Emergency Broadcast
  const [activeAlertEvent, setActiveAlertEvent] = useState<ScheduleEvent | null>(null)
  const [activeAlertType, setActiveAlertType] = useState<'pre_game_reminder' | 'weather_cancellation' | 'rsvp_nudge'>('pre_game_reminder')
  const [showEmergencyBroadcast, setShowEmergencyBroadcast] = useState(false)

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

  // Selected Player for RSVP (persisted for parents on their device)
  const [selectedRsvpPlayerId, setSelectedRsvpPlayerId] = useState<string>(() => {
    return localStorage.getItem('ecohoops_parent_player_id') || ''
  })
  const [copiedLink, setCopiedLink] = useState(false)
  const [showAddEventModal, setShowAddEventModal] = useState(false)

  const effectivePlayerId = useMemo(() => {
    if (selectedRsvpPlayerId) return selectedRsvpPlayerId
    if (isParent && userProfile?.children?.[0]?.id) return userProfile.children[0].id
    if (userProfile?.playerId) return userProfile.playerId
    return currentTeam?.roster?.[0]?.id || 'player-1'
  }, [selectedRsvpPlayerId, isParent, userProfile, currentTeam])

  const handleSelectRsvpPlayer = (playerId: string) => {
    setSelectedRsvpPlayerId(playerId)
    localStorage.setItem('ecohoops_parent_player_id', playerId)
    const p = currentTeam?.roster?.find(r => r.id === playerId)
    if (p) showToast(`RSVP set for ${p.name} (#${p.number})`)
  }

  // Handle Parent RSVP
  const handleRsvp = (eventId: string, status: 'going' | 'maybe' | 'notGoing', targetPlayerId?: string) => {
    const pId = targetPlayerId || effectivePlayerId
    recordAttendance(eventId, pId, status)
    const p = currentTeam?.roster?.find(r => r.id === pId)
    const pLabel = p ? ` for ${p.name}` : ''
    showToast(`RSVP updated: ${status === 'going' ? 'Attending ✓' : status === 'maybe' ? 'Maybe ⏱️' : 'Can\'t Attend ✕'}${pLabel}`)
  }

  const handleCopyLink = () => {
    const hubUrl = `${window.location.origin}/hub`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hubUrl)
    }
    setCopiedLink(true)
    showToast(`✓ Link copied: ${hubUrl}`)
    setTimeout(() => setCopiedLink(false), 3000)
  }

  // Split events into upcoming and past
  const todayStr = new Date().toISOString().split('T')[0]
  const upcomingEvents = useMemo(() => {
    return teamEvents.filter((e) => e.date >= todayStr)
  }, [teamEvents, todayStr])

  const pastEvents = useMemo(() => {
    return teamEvents.filter((e) => e.date < todayStr).reverse()
  }, [teamEvents, todayStr])

  const handleAddEvent = async (newEventData: ScheduleEvent, sendEmail: boolean) => {
    addEvent(newEventData)
    setShowAddEventModal(false)

    if (sendEmail && currentTeam) {
      try {
        const result = await dispatchTeamNotification({
          team: currentTeam,
          event: newEventData,
          eventType: 'event_created'
        })
        showToast(`✓ Event added & emailed ${result.notification.recipientCount} parents!`)
        setNotifications(getSentNotifications(selectedTeamId))
      } catch (err) {
        console.error('Email dispatch error', err)
      }
    } else {
      showToast('✓ Event added to schedule.')
    }
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

  if (!isTeamMember) {
    return (
      <section className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-eco-black text-white flex items-center justify-center px-4">
        {/* Ambient glow effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#97B3D2]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="glow-card w-full max-w-xl p-8 sm:p-12 relative z-10 text-center border border-white/10 bg-eco-surface2/90 backdrop-blur-xl rounded-3xl shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-[#97B3D2]/10 border border-[#97B3D2]/30 flex items-center justify-center mx-auto mb-6 text-[#97B3D2] shadow-[0_0_30px_rgba(151,179,210,0.15)]">
            <Lock size={36} />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#97B3D2] font-mono text-xs uppercase tracking-widest inline-block mb-3">
            Private Team Hub
          </span>

          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white mb-3">
            Team Members Only
          </h1>

          <p className="text-eco-muted-light text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
            The EcoHoops Team Hub is a private portal reserved exclusively for registered players, parents, and coaching staff. Rosters, game schedules, attendance, and team communications are protected to safeguard athlete privacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#97B3D2] text-[#060A10] font-heading font-bold text-sm uppercase tracking-wider hover:bg-[#B0C8E0] hover:shadow-[0_0_25px_rgba(151,179,210,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Team Hub</span>
              <ArrowRight size={16} />
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-eco-muted-light hover:text-white font-heading font-semibold text-sm uppercase tracking-wider transition-all"
            >
              Back to Home
            </Link>
          </div>

          {/* Quick Member Access */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-xs font-mono uppercase tracking-wider text-eco-muted mb-3">
              Quick Member Sign-In
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loginAsRole('player')}
                className="py-2.5 px-2 bg-white/5 border border-white/10 hover:border-[#97B3D2]/50 hover:bg-[#97B3D2]/10 text-eco-muted-light hover:text-white rounded-xl text-xs font-heading font-semibold transition-all"
              >
                🏀 Player
              </button>
              <button
                type="button"
                onClick={() => loginAsRole('parent')}
                className="py-2.5 px-2 bg-white/5 border border-white/10 hover:border-[#97B3D2]/50 hover:bg-[#97B3D2]/10 text-eco-muted-light hover:text-white rounded-xl text-xs font-heading font-semibold transition-all"
              >
                👪 Parent
              </button>
              <button
                type="button"
                onClick={() => loginAsRole('coach')}
                className="py-2.5 px-2 bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-purple-400/10 text-eco-muted-light hover:text-white rounded-xl text-xs font-heading font-semibold transition-all"
              >
                👑 Coach
              </button>
            </div>
          </div>
        </div>
      </section>
    )
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
        {/* Team Hero Header */}
        <div className="relative rounded-3xl overflow-hidden border border-eco-border bg-gradient-to-b from-eco-surface2 to-eco-surface p-6 sm:p-10 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#97B3D2]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar: Team Selector & Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-[#97B3D2]/20 text-[#97B3D2] border border-[#97B3D2]/30 flex items-center gap-1.5">
                <Shield size={12} /> Team Hub
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30 flex items-center gap-1.5">
                <Bell size={12} className="animate-pulse" /> Live Team Feed
              </span>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-eco-muted bg-white/5 border border-white/10">
                One Link for Parents, Players & Coaches
              </span>
            </div>

            {/* Team Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-eco-muted font-heading uppercase tracking-wider hidden sm:inline">
                Squad:
              </span>
              <div className="flex items-center gap-1 bg-eco-black/60 p-1 rounded-xl border border-eco-border">
                {teams.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTeamId(t.id)
                      navigate(`/hub/${t.id}`, { replace: true })
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all cursor-pointer ${
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
                {currentTeam.name} <span className="text-[#97B3D2]">{currentTeam.gender} Rep Hub</span>
              </h1>
              <p className="text-sm text-eco-muted-light max-w-2xl leading-relaxed">
                One unified link for athletes, parents, and coaching staff. View real-time schedule adjustments, 1-tap attendance RSVP, jersey requirements, team rosters, and direct coach contacts.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-eco-surface border border-eco-border hover:border-[#97B3D2] text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-eco-surface2 cursor-pointer shadow-sm"
                title="Copy shareable link for WhatsApp, SMS or email"
              >
                {copiedLink ? <Check size={14} className="text-[#00D26A]" /> : <Copy size={14} className="text-[#97B3D2]" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
              </button>

              <button
                onClick={() => downloadCalendarIcs(`${currentTeam.name} Schedule`)}
                className="px-4 py-2.5 rounded-xl bg-eco-surface border border-eco-border hover:border-[#97B3D2] text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-eco-surface2 cursor-pointer"
                title="Download .ics file to sync with iPhone, Google, or Outlook calendar"
              >
                <Download size={14} className="text-[#97B3D2]" /> Sync to Phone (.ics)
              </button>

              {(isAdmin || isCoach) && (
                <>
                  <button
                    onClick={() => setShowAddEventModal(true)}
                    className="btn-glow text-xs !px-4 !py-2.5 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> Add Event
                  </button>
                  <button
                    onClick={() => setShowBroadcastModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-eco-surface2 border border-[#97B3D2]/40 text-[#97B3D2] hover:text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Send size={14} /> Email Parents
                  </button>
                </>
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

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {(isAdmin || isCoach) && (
                  <>
                    <button
                      onClick={() => setShowAddEventModal(true)}
                      className="btn-glow text-xs !px-3.5 !py-1.5 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={13} /> Add Event
                    </button>
                    <button
                      onClick={() => setShowEmergencyBroadcast(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/35 text-red-300 text-xs font-heading font-bold uppercase tracking-wider hover:bg-red-500/25 transition-all cursor-pointer shadow-glow-sm"
                      title="Broadcast urgent gym closure or inclement weather notice"
                    >
                      <AlertTriangle size={13} className="text-red-400" />
                      <span>Weather Alert</span>
                    </button>
                  </>
                )}
                <div className="text-xs text-eco-muted font-mono">
                  Showing {teamEvents.length} events for {currentTeam.name}
                </div>
              </div>
            </div>

            {/* Event List Cards */}
            {teamEvents.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-eco-surface border border-eco-border">
                <Calendar size={32} className="mx-auto text-eco-muted mb-3 opacity-50" />
                <h3 className="font-heading font-bold text-base text-white mb-1">No Events Scheduled</h3>
                <p className="text-xs text-eco-muted-light mb-4">There are no upcoming games or practices on the calendar for {currentTeam.name}.</p>
                {(isAdmin || isCoach) && (
                  <button
                    onClick={() => setShowAddEventModal(true)}
                    className="btn-glow inline-flex items-center gap-2 text-xs !px-4 !py-2 cursor-pointer"
                  >
                    <Plus size={14} /> Schedule First Event & Notify Parents
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {upcomingEvents.map((evt) => {
                    const myRsvp = evt.attendance?.[effectivePlayerId]?.status
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

                            <div>
                              <h4 className="font-heading font-bold text-xl text-white mb-1">
                                {evt.title}
                              </h4>
                            </div>

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

                            {/* Coach / Admin Parent Alert Actions */}
                            {(isAdmin || isCoach) && (
                              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
                                <span className="text-[10px] font-mono text-eco-muted uppercase tracking-wider">
                                  Parent Alert:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveAlertEvent(evt)
                                    setActiveAlertType('pre_game_reminder')
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-eco-blue/15 hover:bg-eco-blue/25 border border-eco-blue/30 text-eco-blue hover:text-white text-[10px] font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Sparkles size={11} /> 24h Game Prep
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveAlertEvent(evt)
                                    setActiveAlertType('weather_cancellation')
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-white text-[10px] font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <AlertTriangle size={11} /> Weather / Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveAlertEvent(evt)
                                    setActiveAlertType('rsvp_nudge')
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-white text-[10px] font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Bell size={11} /> Nudge RSVPs
                                </button>
                                {evt.lastAlertType && (
                                  <span className="text-[10px] font-mono text-[#00D26A] ml-auto">
                                    ✓ Alert: {evt.lastAlertType === 'weather_cancellation' ? 'Weather Alert' : evt.lastAlertType === 'rsvp_nudge' ? 'RSVP Nudge' : 'Game Prep'}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Interactive RSVP & Calendar Actions */}
                          <div className="lg:w-72 flex flex-col gap-2.5 p-4 rounded-xl bg-eco-surface2 border border-white/5 flex-shrink-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-eco-muted">
                                Attendance RSVP
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400">
                                {evt.rsvp?.going || 0} Attending
                              </span>
                            </div>

                            {/* Quick Player Profile Selector for Parent/Athlete */}
                            <div className="flex items-center justify-between gap-1.5 bg-eco-black/40 px-2 py-1.5 rounded-lg border border-white/5 text-[11px]">
                              <span className="text-[10px] font-mono text-eco-muted uppercase tracking-wider">Player:</span>
                              <select
                                value={effectivePlayerId}
                                onChange={(e) => handleSelectRsvpPlayer(e.target.value)}
                                className="bg-transparent text-[11px] font-heading font-semibold text-[#97B3D2] focus:outline-none cursor-pointer text-right max-w-[170px] truncate"
                              >
                                {currentTeam.roster.map((p) => (
                                  <option key={p.id} value={p.id} className="bg-eco-surface text-white">
                                    #{p.number} {p.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* RSVP Buttons */}
                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                onClick={() => handleRsvp(evt.id, 'going')}
                                className={`py-2 px-1 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                  myRsvp === 'going'
                                    ? 'bg-[#00D26A] text-[#060A10] shadow-glow-sm font-black'
                                    : 'bg-eco-surface hover:bg-[#00D26A]/20 text-white'
                                }`}
                              >
                                <CheckCircle2 size={14} />
                                <span>Going</span>
                              </button>
                              <button
                                onClick={() => handleRsvp(evt.id, 'maybe')}
                                className={`py-2 px-1 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                  myRsvp === 'maybe'
                                    ? 'bg-amber-400 text-[#060A10] font-black'
                                    : 'bg-eco-surface hover:bg-amber-400/20 text-white'
                                }`}
                              >
                                <Clock size={14} />
                                <span>Maybe</span>
                              </button>
                              <button
                                onClick={() => handleRsvp(evt.id, 'notGoing')}
                                className={`py-2 px-1 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                  myRsvp === 'notGoing'
                                    ? 'bg-red-500 text-white font-black'
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
                                className="text-[11px] font-mono text-[#97B3D2] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
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

                {/* Past Results Section */}
                {pastEvents.length > 0 && (
                  <div className="pt-6 border-t border-white/10">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-eco-muted mb-4 flex items-center gap-2">
                      <Trophy size={14} className="text-[#97B3D2]" />
                      Past Results & Completed Games ({pastEvents.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {pastEvents.map((evt) => (
                        <div
                          key={evt.id}
                          className="p-4 rounded-xl bg-eco-surface/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-eco-muted font-mono">{evt.date}</span>
                            <span className="font-heading font-bold text-white">{evt.title}</span>
                            {evt.opponent && (
                              <span className="text-eco-muted">vs {evt.opponent}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-eco-muted font-mono">
                            <span>{evt.location}</span>
                            <span>&middot;</span>
                            <span>{evt.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

        {activeAlertEvent && currentTeam && (
          <EventNotificationModal
            isOpen={true}
            event={activeAlertEvent}
            team={currentTeam}
            initialType={activeAlertType}
            onClose={() => setActiveAlertEvent(null)}
            onSuccess={(msg: string) => {
              updateEvent({
                ...activeAlertEvent,
                lastAlertSent: new Date().toISOString(),
                lastAlertType: activeAlertType
              })
              setNotifications(getSentNotifications(selectedTeamId))
              showToast(msg)
            }}
          />
        )}

        <EmergencyBroadcastModal
          isOpen={showEmergencyBroadcast}
          teams={teams}
          onClose={() => setShowEmergencyBroadcast(false)}
          onSuccess={(msg: string) => {
            setNotifications(getSentNotifications(selectedTeamId))
            showToast(msg)
          }}
        />

        {showAddEventModal && currentTeam && (
          <TeamAddEventModal
            currentTeam={currentTeam}
            onClose={() => setShowAddEventModal(false)}
            onAdd={(newEvent, sendEmail) => handleAddEvent(newEvent, sendEmail)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function TeamAddEventModal({
  currentTeam,
  onClose,
  onAdd
}: {
  currentTeam: Team
  onClose: () => void
  onAdd: (event: ScheduleEvent, sendEmail: boolean) => void
}) {
  const [type, setType] = useState<'game' | 'practice' | 'tournament' | 'event'>('game')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [opponent, setOpponent] = useState('')
  const [homeAway, setHomeAway] = useState<'home' | 'away'>('home')
  const [uniformColor, setUniformColor] = useState('White (Home)')
  const [arrivalNote, setArrivalNote] = useState('Arrive 30 minutes prior for warmups')
  const [notes, setNotes] = useState('')
  const [sendEmail, setSendEmail] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date || !time || !location) {
      alert('Please fill out Title, Date, Time, and Location.')
      return
    }

    const newEvent: ScheduleEvent = {
      id: 'event-' + Date.now(),
      teamId: currentTeam.id,
      type,
      title: title.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      opponent: type === 'game' ? opponent.trim() : undefined,
      homeAway: type === 'game' ? homeAway : undefined,
      uniformColor: uniformColor || undefined,
      arrivalNote: arrivalNote.trim() || undefined,
      notes: notes.trim() || undefined,
      rsvp: { going: 0, maybe: 0, notGoing: 0, total: 0 }
    }

    onAdd(newEvent, sendEmail)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-eco-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glow-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto bg-eco-surface border border-eco-border rounded-2xl shadow-2xl"
      >
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/10">
          <div>
            <h2 className="font-display text-xl text-white uppercase tracking-wider">
              Add Event to {currentTeam.name}
            </h2>
            <p className="text-xs text-eco-muted font-mono">{currentTeam.season} &middot; {currentTeam.gender}</p>
          </div>
          <button onClick={onClose} className="text-eco-muted hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-mono uppercase tracking-wider text-eco-muted mb-1 text-[10px]">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-eco-surface2 border border-eco-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#97B3D2]"
              placeholder="e.g. vs Oakville Venom or Practice & Film Lab"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase tracking-wider text-eco-muted mb-1 text-[10px]">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-eco-surface2 border border-eco-border rounded-xl px-3 py-2 text-white focus:outline-none cursor-pointer"
              >
                <option value="game">Game</option>
                <option value="practice">Practice</option>
                <option value="tournament">Tournament</option>
                <option value="event">Scrimmage / Event</option>
              </select>
            </div>
            <div>
              <label className="block font-mono uppercase tracking-wider text-eco-muted mb-1 text-[10px]">Jersey Color</label>
              <select
                value={uniformColor}
                onChange={(e) => setUniformColor(e.target.value)}
                className="w-full bg-eco-surface2 border border-eco-border rounded-xl px-3 py-2 text-white focus:outline-none cursor-pointer"
              >
                <option value="White (Home)">White (Home)</option>
                <option value="Black (Away)">Black (Away)</option>
                <option value="Practice Reversible">Practice Reversible</option>
                <option value="Both White & Black">Both White & Black</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase tracking-wider text-eco-muted mb-1 text-[10px]">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-eco-surface2 border border-eco-border rounded-xl px-3 py-2 text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-mono uppercase tracking-wider text-eco-muted mb-1 text-[10px]">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 6:30 PM"
                className="w-full bg-eco-surface2 border border-eco-border rounded-xl px-3 py-2 text-white focus:outline-none"
                required
              />
            </div>
          </div>

          {type === 'game' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono uppercase tracking-wider text-eco-muted mb-1 text-[10px]">Opponent</label>
                <input
                  type="text"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  placeholder="e.g. Brampton Warriors"
                  className="w-full bg-eco-surface2 border border-eco-border rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono uppercase tracking-wider text-eco-muted mb-1 text-[10px]">Court Side</label>
                <select
                  value={homeAway}
                  onChange={(e) => setHomeAway(e.target.value as any)}
                  className="w-full bg-eco-surface2 border border-eco-border rounded-xl px-3 py-2 text-white focus:outline-none cursor-pointer"
                >
                  <option value="home">Home Game</option>
                  <option value="away">Away Game</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block font-mono uppercase tracking-wider text-eco-muted mb-1 text-[10px]">Gym Location & Address</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hershey Centre Court 3, 5500 Rose Cherry Pl"
              className="w-full bg-eco-surface2 border border-eco-border rounded-xl px-3.5 py-2 text-white focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase tracking-wider text-eco-muted mb-1 text-[10px]">Arrival Time Buffer</label>
              <input
                type="text"
                value={arrivalNote}
                onChange={(e) => setArrivalNote(e.target.value)}
                placeholder="e.g. Arrive 30 mins prior"
                className="w-full bg-eco-surface2 border border-eco-border rounded-xl px-3.5 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono uppercase tracking-wider text-eco-muted mb-1 text-[10px]">Coach's Tactical / Logistics Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Bring water bottles, door codes, etc."
                className="w-full bg-eco-surface2 border border-eco-border rounded-xl px-3.5 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-eco-surface2/60 border border-white/10 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 rounded text-[#97B3D2] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-white">Immediately dispatch email alert to team parents</span>
            </label>
            <span className="text-[10px] font-mono text-emerald-400">
              {currentTeam.parentContacts?.length || currentTeam.roster.length} Verified
            </span>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-eco-muted hover:text-white transition-colors cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-glow text-xs !px-5 !py-2 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Add Event & Dispatch
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
