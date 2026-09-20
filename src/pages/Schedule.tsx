import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import {
  Calendar, MapPin, Clock, Users, Check, X, HelpCircle,
  Trophy, Dumbbell, Star, PartyPopper, Filter,
  ChevronDown, Plus, Trash2, Download, ExternalLink, MessageSquare, CheckCircle2,
  AlertTriangle, Bell, Send, Sparkles, Lock, ArrowRight
} from 'lucide-react'
import type { ScheduleEvent, Team } from '../types'
import { useData } from '../contexts/DataContext'
import EventNotificationModal from '../components/schedule/EventNotificationModal'
import EmergencyBroadcastModal from '../components/schedule/EmergencyBroadcastModal'
import { getSentNotifications } from '../lib/email-service'

const EVENT_ICONS: Record<string, React.ElementType> = {
  game: Trophy,
  practice: Dumbbell,
  tournament: Star,
  event: PartyPopper,
}

const EVENT_COLORS: Record<string, string> = {
  game: '#B0C8E0',
  practice: '#6A9BC7',
  tournament: '#97B3D2',
  event: '#4A7FB5',
}

type FilterType = 'all' | 'game' | 'practice' | 'tournament' | 'event'

export default function Schedule() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { ref, isVisible } = useScrollReveal(0.05)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin, isCoach, isParent, isTeamMember, userProfile, loginAsRole, unlockWithPasscode } = useAuth()
  const [passcode, setPasscode] = useState('')
  const [passcodeError, setPasscodeError] = useState(false)
  const { schedule, teams, addEvent, deleteEvent, updateEvent, downloadCalendarIcs, recordAttendance, checkInPlayer } = useData()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedChildId, setSelectedChildId] = useState<string>(
    userProfile?.children?.[0]?.id || userProfile?.playerId || 'child-1'
  )
  const [userRsvps, setUserRsvps] = useState<Record<string, 'going'|'maybe'|'notGoing'>>({})
  const [rsvpNotes, setRsvpNotes] = useState<Record<string, string>>({})
  
  // Notification Modal States
  const [activeAlertEvent, setActiveAlertEvent] = useState<ScheduleEvent | null>(null)
  const [activeAlertType, setActiveAlertType] = useState<'pre_game_reminder' | 'weather_cancellation' | 'rsvp_nudge'>('pre_game_reminder')
  const [showEmergencyBroadcast, setShowEmergencyBroadcast] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleOpenAlert = (event: ScheduleEvent, type: 'pre_game_reminder' | 'weather_cancellation' | 'rsvp_nudge') => {
    setActiveAlertEvent(event)
    setActiveAlertType(type)
  }

  const handleRsvp = (eventId: string, newStatus: 'going'|'maybe'|'notGoing', note?: string) => {
    const playerId = isParent ? selectedChildId : (userProfile?.playerId || 'player-1')
    recordAttendance(eventId, playerId, newStatus, note)
    setUserRsvps(prev => ({ ...prev, [eventId]: newStatus }))
  }

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId)
  }

  const filtered = schedule
    .filter((e) => filter === 'all' || e.type === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const upcoming = filtered.filter((e) => !e.result)
  const past = filtered.filter((e) => e.result)

  const activeAlertTeam = teams.find(t => t.id === activeAlertEvent?.teamId) || teams[0]

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (unlockWithPasscode(passcode)) {
      setPasscodeError(false)
    } else {
      setPasscodeError(true)
    }
  }

  if (!isTeamMember) {
    return (
      <section className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-eco-black text-white flex items-center justify-center px-4">
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

          <p className="text-eco-muted-light text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto">
            Game schedules, practices, and attendance RSVP tracking are private and restricted to active EcoHoops players, parents, and coaches.
          </p>

          {/* WhatsApp Direct Access Highlight */}
          <div className="p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-left mb-6 space-y-2">
            <div className="flex items-center gap-2 text-[#25D366] font-heading font-bold text-xs uppercase tracking-wider">
              <MessageSquare size={16} />
              <span>Direct WhatsApp Group Access</span>
            </div>
            <p className="text-xs text-eco-muted-light leading-relaxed">
              If you are a registered player or parent, tap the <strong>pinned link</strong> in your team's WhatsApp group chat to enter directly on your phone with no password needed.
            </p>
          </div>

          {/* Passcode Unlock */}
          <form onSubmit={handlePasscodeSubmit} className="mb-6 space-y-2">
            <div className="flex gap-2">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value)
                  setPasscodeError(false)
                }}
                placeholder="Or enter team passcode..."
                className="input-field flex-1 !py-3 !px-4 text-xs sm:text-sm bg-eco-surface border-white/10 focus:border-[#97B3D2]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#97B3D2] text-[#060A10] font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#B0C8E0] transition-colors whitespace-nowrap cursor-pointer"
              >
                Unlock
              </button>
            </div>
            {passcodeError && (
              <p className="text-xs text-red-400 text-left font-mono">
                Incorrect passcode. Check your WhatsApp group or tap the secret link.
              </p>
            )}
          </form>

          <div className="pt-5 border-t border-white/10 mt-6 flex items-center justify-between text-xs">
            <Link
              to="/"
              className="text-eco-muted hover:text-white transition-colors uppercase font-mono tracking-wider"
            >
              &larr; Back to Home
            </Link>
            <Link
              to="/login"
              className="text-eco-blue hover:text-white transition-colors uppercase font-mono tracking-wider font-semibold"
            >
              Coach Login &rarr;
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="pt-28 pb-20 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[200px] md:h-[260px] mb-10 mx-4 lg:mx-8 rounded-2xl overflow-hidden">
        <img
          src="/images/IMG_0357.JPG"
          alt="Game action"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-eco-black/80 via-eco-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="tag mb-3 inline-block">TeamSnap Calendar</span>
            <h1 className="font-display text-section uppercase mb-2">
              <span className="text-white">THE </span>
              <span className="gradient-text">SCHEDULE</span>
            </h1>
            <p className="text-eco-muted-light text-base max-w-md">
              Games, practices, tournaments, and live team RSVPs. Stay locked in.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 mb-6 rounded-2xl bg-[#00D26A]/20 border border-[#00D26A]/40 text-[#00D26A] font-heading font-semibold text-sm flex items-center justify-between shadow-glow-sm"
            >
              <span>{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="text-white hover:text-eco-muted ml-2">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Control Bar: Parent Child Switcher + Sync Calendar + Admin Add */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-4 bg-eco-surface2/60 border border-eco-border rounded-2xl">
          {isParent && userProfile?.children && userProfile.children.length > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-eco-muted uppercase tracking-wider">RSVP for:</span>
              <div className="flex gap-2">
                {userProfile.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase transition-all ${
                      selectedChildId === child.id
                        ? 'bg-eco-blue text-eco-black shadow-glow-sm'
                        : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white'
                    }`}
                  >
                    #{child.number || ''} {child.name} ({child.teamId.toUpperCase()})
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs font-mono text-eco-muted">
              Live Team Availability & Schedule Feed
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {(isAdmin || isCoach) && (
              <button
                onClick={() => setShowEmergencyBroadcast(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/15 border border-red-500/35 text-red-300 rounded-xl text-xs font-heading font-bold uppercase tracking-wider hover:bg-red-500/25 transition-all shadow-glow-sm cursor-pointer"
                title="Broadcast urgent weather cancellation or facility closure notice"
              >
                <AlertTriangle size={13} className="text-red-400" />
                <span>Urgent Weather Alert</span>
              </button>
            )}

            <button
              onClick={() => downloadCalendarIcs('EcoHoops Team Calendar')}
              className="flex items-center gap-2 px-4 py-2 bg-eco-surface border border-eco-blue/30 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider hover:bg-eco-blue hover:text-eco-black transition-all shadow-glow-sm cursor-pointer"
              title="Download iCal (.ics) file to sync with iPhone, Android, or Outlook calendar"
            >
              <Download size={14} />
              Sync to Phone (.ics)
            </button>

            {isAdmin && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-eco-blue text-eco-black rounded-xl text-xs font-heading font-bold uppercase tracking-wider hover:bg-eco-blue/80 transition-colors shadow-glow-sm cursor-pointer"
              >
                <Plus size={14} />
                Add Event
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {schedule.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {(['all', 'game', 'practice', 'tournament', 'event'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider transition-all duration-300 ${
                  filter === f
                    ? 'bg-eco-blue text-eco-black font-bold shadow-glow-sm'
                    : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-blue/30'
                }`}
              >
                {f === 'all' ? 'All Events' : f + 's'}
              </button>
            ))}
          </motion.div>
        )}

        {schedule.length === 0 && (
          <div className="text-center py-20 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-eco-surface border border-eco-border flex items-center justify-center mx-auto mb-4 text-[#97B3D2]">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-2">No Scheduled Events</h3>
            <p className="text-eco-muted-light text-sm mb-6">
              The schedule is currently being finalized for the upcoming season. Check back soon or download the iCal feed to stay synced.
            </p>
            {(isAdmin || isCoach) && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-glow inline-flex items-center gap-2 text-sm !px-6 !py-2.5"
              >
                <Plus size={16} /> Add Schedule Event
              </button>
            )}
          </div>
        )}

        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xs font-mono uppercase tracking-widest text-eco-blue mb-6 flex items-center gap-2">
              <Calendar size={14} />
              Upcoming
            </h3>
            <div className="space-y-4">
              {upcoming.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={i}
                  isExpanded={expandedId === event.id}
                  onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
                  currentRsvp={userRsvps[event.id]}
                  onRsvp={(status) => handleRsvp(event.id, status)}
                  isAdmin={isAdmin}
                  isCoach={isCoach}
                  onDelete={() => handleDeleteEvent(event.id)}
                  onOpenAlert={(type) => handleOpenAlert(event, type)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Results */}
        {past.length > 0 && (
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-eco-muted mb-6 flex items-center gap-2">
              <Trophy size={14} />
              Results
            </h3>
            <div className="space-y-4">
              {past.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={i}
                  isExpanded={expandedId === event.id}
                  onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
                  currentRsvp={userRsvps[event.id]}
                  onRsvp={(status) => handleRsvp(event.id, status)}
                  isAdmin={isAdmin}
                  isCoach={isCoach}
                  onDelete={() => handleDeleteEvent(event.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddEventModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={(newEvent) => {
              addEvent(newEvent)
              setIsAddModalOpen(false)
            }}
          />
        )}

        {activeAlertEvent && activeAlertTeam && (
          <EventNotificationModal
            isOpen={true}
            event={activeAlertEvent}
            team={activeAlertTeam}
            initialType={activeAlertType}
            onClose={() => setActiveAlertEvent(null)}
            onSuccess={(msg: string) => {
              updateEvent({
                ...activeAlertEvent,
                lastAlertSent: new Date().toISOString(),
                lastAlertType: activeAlertType
              })
              setToastMessage(msg)
              setTimeout(() => setToastMessage(null), 6000)
            }}
          />
        )}

        <EmergencyBroadcastModal
          isOpen={showEmergencyBroadcast}
          teams={teams}
          onClose={() => setShowEmergencyBroadcast(false)}
          onSuccess={(msg: string) => {
            setToastMessage(msg)
            setTimeout(() => setToastMessage(null), 8000)
          }}
        />
      </AnimatePresence>
    </section>
  )
}

function AddEventModal({ onClose, onAdd }: { onClose: () => void, onAdd: (e: ScheduleEvent) => void }) {
  const [type, setType] = useState<'game'|'practice'|'tournament'|'event'>('game')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [opponent, setOpponent] = useState('')
  const [homeAway, setHomeAway] = useState<'home'|'away'>('home')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let formattedTime = time
    if (time) {
      const [h, m] = time.split(':')
      const hour = parseInt(h, 10)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const hour12 = hour % 12 || 12
      formattedTime = `${hour12}:${m} ${ampm}`
    }

    const newEvent: ScheduleEvent = {
        id: 'new-' + Date.now(),
        type,
        title,
        date,
        time: formattedTime,
        location,
        opponent: type === 'game' ? opponent : undefined,
        homeAway: type === 'game' ? homeAway : undefined,
        rsvp: { going: 0, maybe: 0, notGoing: 0, total: 0 }
    }
    onAdd(newEvent)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-eco-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glow-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl text-white uppercase">Add Schedule Event</h2>
          <button onClick={onClose} className="text-eco-muted hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-blue/50 transition-colors" required>
              <option value="game">Game</option>
              <option value="practice">Practice</option>
              <option value="tournament">Tournament</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-blue/50 transition-colors" placeholder="e.g. vs Raptors Prep" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-blue/50 transition-colors" required />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1">Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-blue/50 transition-colors" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1">Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-blue/50 transition-colors" placeholder="e.g. Hershey Centre" required />
          </div>
          
          {type === 'game' && (
            <>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1">Opponent</label>
                <input type="text" value={opponent} onChange={e => setOpponent(e.target.value)} className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-blue/50 transition-colors" placeholder="e.g. Raptors Prep" />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1">Home / Away</label>
                <select value={homeAway} onChange={e => setHomeAway(e.target.value as any)} className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-blue/50 transition-colors">
                  <option value="home">Home</option>
                  <option value="away">Away</option>
                </select>
              </div>
            </>
          )}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-eco-surface border border-eco-border text-white rounded-xl font-heading font-semibold hover:bg-eco-surface2 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-eco-blue text-eco-black rounded-xl font-heading font-bold uppercase tracking-wider hover:bg-eco-blue/80 transition-colors shadow-glow-sm">Save Event</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function EventCard({
  event,
  index,
  isExpanded,
  onToggle,
  currentRsvp,
  onRsvp,
  isAdmin,
  isCoach,
  onDelete,
  onOpenAlert,
}: {
  event: ScheduleEvent
  index: number
  isExpanded: boolean
  onToggle: () => void
  currentRsvp?: 'going' | 'maybe' | 'notGoing'
  onRsvp?: (status: 'going' | 'maybe' | 'notGoing') => void
  isAdmin?: boolean
  isCoach?: boolean
  onDelete?: () => void
  onOpenAlert?: (type: 'pre_game_reminder' | 'weather_cancellation' | 'rsvp_nudge') => void
}) {
  const Icon = EVENT_ICONS[event.type]
  const color = EVENT_COLORS[event.type]
  const date = new Date(event.date)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
  const dayNum = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'short' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glow-card overflow-hidden"
    >
      <div
        onClick={onToggle}
        className="p-5 md:p-6 flex items-center gap-4 md:gap-6 cursor-pointer group"
      >
        {/* Date */}
        <div className="flex-shrink-0 text-center w-14">
          <p className="text-xs text-eco-muted uppercase">{dayName}</p>
          <p className="font-display text-2xl text-white">{dayNum}</p>
          <p className="text-xs text-eco-muted uppercase">{month}</p>
        </div>

        {/* Type indicator */}
        <div
          className="w-1.5 h-12 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Icon size={14} style={{ color }} />
            <span className="text-xs uppercase tracking-wider font-mono" style={{ color }}>
              {event.type}
            </span>
            {event.homeAway && (
              <span className="text-xs text-eco-muted">
                ({event.homeAway === 'home' ? 'HOME' : 'AWAY'})
              </span>
            )}
            {event.uniformColor && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                👕 {event.uniformColor}
              </span>
            )}
            {event.arrivalNote && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-eco-blue/10 text-eco-blue border border-eco-blue/20">
                ⏱️ {event.arrivalNote}
              </span>
            )}
            {event.lastAlertType && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                event.lastAlertType === 'weather_cancellation' 
                  ? 'bg-red-500/15 text-red-300 border-red-500/30' 
                  : event.lastAlertType === 'rsvp_nudge'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-[#00D26A]/15 text-[#00D26A] border-[#00D26A]/30'
              }`}>
                ✓ {event.lastAlertType === 'weather_cancellation' ? 'Alert Sent' : event.lastAlertType === 'rsvp_nudge' ? 'Nudge Sent' : 'Prep Sent'}
              </span>
            )}
          </div>
          <h4 className="font-heading font-bold text-white text-lg truncate">
            {event.title}
          </h4>
          <div className="flex flex-wrap items-center gap-4 mt-1">
            <span className="text-xs text-eco-muted flex items-center gap-1">
              <Clock size={12} /> {event.time}
            </span>
            <span className="text-xs text-eco-muted flex items-center gap-1 truncate">
              <MapPin size={12} /> {event.location}
            </span>
          </div>
        </div>

        {/* Result or RSVP */}
        <div className="flex-shrink-0 text-right">
          {event.result ? (
            <div>
              <p className={`font-display text-xl ${
                event.result.outcome === 'W' ? 'text-white' : 'text-eco-muted-light'
              }`}>
                {event.result.outcome}
              </p>
              <p className="text-xs text-eco-muted">{event.result.score}</p>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <Check size={12} className="text-white" />
                <span className="text-xs text-eco-muted">{event.rsvp.going}</span>
              </div>
              <span className="text-xs text-eco-muted">/</span>
              <span className="text-xs text-eco-muted">{event.rsvp.total}</span>
            </div>
          )}
        </div>

        {isAdmin && onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="flex-shrink-0 text-eco-muted hover:text-red-500 transition-colors ml-2"
          >
            <Trash2 size={16} />
          </button>
        )}

        <ChevronDown
          size={16}
          className={`text-eco-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-eco-border">
              {/* Coach / Admin Parent Alert Controls */}
              {(isAdmin || isCoach) && onOpenAlert && !event.result && (
                <div className="mb-6 p-4 rounded-xl bg-eco-surface2/80 border border-eco-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Send size={14} className="text-eco-blue" />
                      <h5 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                        Coach Parent Alert Controls
                      </h5>
                    </div>
                    {event.lastAlertSent && (
                      <span className="text-[11px] font-mono text-eco-muted">
                        Last alert: {new Date(event.lastAlertSent).toLocaleDateString()} at {new Date(event.lastAlertSent).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onOpenAlert('pre_game_reminder'); }}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-eco-blue/15 hover:bg-eco-blue/25 border border-eco-blue/30 text-eco-blue hover:text-white text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>24h Game Prep</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onOpenAlert('weather_cancellation'); }}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-white text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <AlertTriangle size={13} />
                      <span>Weather / Cancel</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onOpenAlert('rsvp_nudge'); }}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Bell size={13} />
                      <span>Nudge RSVPs</span>
                    </button>
                  </div>
                </div>
              )}

              {/* RSVP Breakdown */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-eco-blue/10 rounded-xl p-3 text-center border border-eco-blue/20">
                  <Check size={16} className="text-white mx-auto mb-1" />
                  <p className="font-heading font-bold text-white">{event.rsvp.going}</p>
                  <p className="text-xs text-eco-muted">Going</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center border border-white/20">
                  <HelpCircle size={16} className="text-white/70 mx-auto mb-1" />
                  <p className="font-heading font-bold text-white">{event.rsvp.maybe}</p>
                  <p className="text-xs text-eco-muted">Maybe</p>
                </div>
                <div className="bg-eco-muted/10 rounded-xl p-3 text-center border border-eco-muted/20">
                  <X size={16} className="text-eco-muted-light mx-auto mb-1" />
                  <p className="font-heading font-bold text-white">{event.rsvp.notGoing}</p>
                  <p className="text-xs text-eco-muted">Can't Go</p>
                </div>
              </div>

              {/* Location Directions & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-xl bg-eco-surface2 border border-white/5">
                <div className="flex items-center gap-2 text-xs text-eco-muted-light">
                  <MapPin size={14} className="text-eco-blue" />
                  <span>{event.location}</span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-eco-surface border border-eco-border text-xs font-mono text-white hover:text-eco-blue hover:border-eco-blue/40 transition-colors"
                >
                  <ExternalLink size={12} />
                  Get Directions
                </a>
              </div>

              {/* RSVP Buttons & Note */}
              {!event.result && onRsvp && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRsvp('going'); }}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-heading font-semibold transition-colors flex items-center justify-center gap-2 ${
                        currentRsvp === 'going' 
                          ? 'bg-eco-blue text-eco-black border-eco-blue font-bold shadow-glow-sm' 
                          : 'bg-eco-blue/20 border-eco-blue/30 text-white hover:bg-eco-blue/30'
                      }`}>
                      <Check size={16} /> I'm Going
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRsvp('maybe'); }}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-heading font-semibold transition-colors flex items-center justify-center gap-2 ${
                        currentRsvp === 'maybe' 
                          ? 'bg-white text-eco-black border-white font-bold shadow-glow-sm' 
                          : 'bg-white/20 border-white/30 text-white/70 hover:bg-white/30'
                      }`}>
                      <HelpCircle size={16} /> Maybe
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRsvp('notGoing'); }}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-heading font-semibold transition-colors flex items-center justify-center gap-2 ${
                        currentRsvp === 'notGoing' 
                          ? 'bg-eco-muted text-white border-eco-muted font-bold' 
                          : 'bg-eco-muted/20 border-eco-muted/30 text-eco-muted-light hover:bg-eco-muted/30'
                      }`}>
                      <X size={16} /> Can't Go
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
