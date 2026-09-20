import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Lock, Calendar, FileText, CheckCircle2, Trash2, 
  Clock, MapPin, Trophy, Dumbbell, Sparkles, Send, Plus, ArrowRight, Shield
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { blogService } from '../lib/blog-service'
import { dispatchTeamNotification } from '../lib/email-service'
import { ScheduleEvent, BlogPost } from '../types'

type AdminView = 'event' | 'blog' | 'manage'

const VENUE_PRESETS = [
  { name: 'Iona Catholic Secondary School', address: '2170 South Sheridan Way, Mississauga, ON L5J 2M4' },
  { name: 'Green Glade Senior Public School', address: '1550 Green Glade, Mississauga, ON L5J 1B5' },
  { name: 'Paramount Fine Foods Centre', address: '5500 Rose Cherry Pl, Mississauga, ON L4Z 4B6' }
]

const TIME_PRESETS = [
  '6:00 PM – 8:00 PM',
  '8:15 PM – 10:00 PM',
  '1:00 PM – 3:00 PM',
  '3:30 PM – 5:30 PM'
]

const BLOG_CATEGORIES = [
  'Player Development',
  'Training & Skills',
  'Season Updates',
  'Nutrition & Recovery',
  'Coaching Philosophy'
]

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth()
  const { teams, schedule, addEvent, deleteEvent } = useData()

  useDocumentTitle('Coach Console | EcoHoops', { noindex: true })

  const [activeView, setActiveView] = useState<AdminView>('event')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Event Form State
  const [eventType, setEventType] = useState<'game' | 'practice' | 'tournament'>('game')
  const [targetTeam, setTargetTeam] = useState<string>('u16-boys')
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('6:00 PM – 8:00 PM')
  const [eventVenue, setEventVenue] = useState(VENUE_PRESETS[0].name)
  const [eventAddress, setEventAddress] = useState(VENUE_PRESETS[0].address)
  const [opponent, setOpponent] = useState('')
  const [uniformColor, setUniformColor] = useState('Home (White)')
  const [arrivalNote, setArrivalNote] = useState('Arrive 30 minutes prior for warmups')
  const [eventNotes, setEventNotes] = useState('')
  const [sendNotification, setSendNotification] = useState(false)

  // Blog Form State
  const [blogTitle, setBlogTitle] = useState('')
  const [blogCategory, setBlogCategory] = useState(BLOG_CATEGORIES[0])
  const [blogSummary, setBlogSummary] = useState('')
  const [blogContent, setBlogContent] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Handle Event Creation
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventDate) {
      alert('Please choose a date.')
      return
    }

    setIsSubmitting(true)
    const title = eventTitle.trim() || (eventType === 'game' ? `Game vs ${opponent || 'TBD'}` : 'Team Practice')

    const newEvent: ScheduleEvent = {
      id: `custom-event-${Date.now()}`,
      type: eventType,
      title,
      date: eventDate,
      time: eventTime.trim(),
      location: eventVenue.trim(),
      venueDetails: eventAddress.trim(),
      teamId: targetTeam,
      opponent: eventType === 'game' ? opponent.trim() : undefined,
      uniformColor: eventType === 'game' ? uniformColor : undefined,
      arrivalNote: arrivalNote.trim() || undefined,
      notes: eventNotes.trim() || undefined,
      rsvp: { going: 0, maybe: 0, notGoing: 0, total: 0 }
    }

    addEvent(newEvent)

    // Optional parent email alert
    if (sendNotification) {
      const selectedTeamObj = teams.find(t => t.id === targetTeam) || teams[0]
      if (selectedTeamObj) {
        try {
          await dispatchTeamNotification({
            team: selectedTeamObj,
            event: newEvent,
            eventType: 'event_created'
          })
        } catch (err) {
          console.error('Email dispatch error:', err)
        }
      }
    }

    setIsSubmitting(false)
    showToast(`✓ Published ${title} to Team Hub!`)

    // Reset Form
    setEventTitle('')
    setOpponent('')
    setEventDate('')
    setEventNotes('')
    setActiveView('manage')
  }

  // Handle Blog Creation
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blogTitle.trim() || !blogContent.trim()) {
      alert('Please provide a title and content.')
      return
    }

    setIsSubmitting(true)
    const slug = blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    await blogService.addBlogPost({
      title: blogTitle.trim(),
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      category: blogCategory,
      excerpt: blogSummary.trim() || blogContent.trim().slice(0, 160) + '...',
      content: blogContent.trim(),
      author: 'Coach Adrian Sapp',
      image: null
    })

    setIsSubmitting(false)
    showToast('✓ Article published live to /blog!')

    // Reset Blog Form
    setBlogTitle('')
    setBlogSummary('')
    setBlogContent('')
  }

  // Filter custom added events for the manage tab
  const upcomingEvents = useMemo(() => {
    return schedule
      .filter((e) => e.id.startsWith('custom-') || e.id.startsWith('event-'))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [schedule])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#060A10] flex items-center justify-center text-white font-mono text-xs">
        Authenticating Coach Console...
      </div>
    )
  }

  // Strict Access Screen if not authenticated via secret token
  if (!isAdmin) {
    return (
      <section className="pt-28 pb-20 min-h-screen bg-[#060A10] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md p-6 sm:p-10 text-center border-2 border-white/10 bg-[#0B131E] rounded-3xl shadow-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#97B3D2]/10 border border-[#97B3D2]/30 flex items-center justify-center mx-auto mb-5 text-[#97B3D2]">
            <Lock size={32} />
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-[11px] uppercase tracking-widest inline-block mb-3 font-bold">
            Private Access
          </span>
          <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white mb-2">
            Coach Portal
          </h1>
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6">
            This console is strictly private for authorized coaching staff. Please open using your private coach link.
          </p>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 font-mono">
            No password needed — tap your private coach WhatsApp link.
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="pt-20 sm:pt-24 pb-32 min-h-screen bg-[#060A10] text-white font-sans selection:bg-[#97B3D2] selection:text-[#060A10] overflow-x-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 z-50 px-4 py-3 rounded-2xl bg-[#97B3D2] text-[#060A10] font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} className="flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Minimal Header */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#97B3D2]/15 text-[#97B3D2] border border-[#97B3D2]/30 inline-flex items-center gap-1.5">
              <Shield size={12} /> Coach Console
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1.5">
              Control <span className="text-[#97B3D2]">Center</span>
            </h1>
          </div>

          {/* Quick links to live hubs */}
          <div className="flex items-center gap-2">
            <Link
              to="/hub/u16-boys"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-heading font-bold uppercase tracking-wider"
            >
              Boys Hub
            </Link>
            <Link
              to="/hub/u15-girls"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-heading font-bold uppercase tracking-wider"
            >
              Girls Hub
            </Link>
          </div>
        </div>

        {/* Sticky 3-Segment Switcher */}
        <div className="sticky top-16 sm:top-20 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-2.5 bg-[#060A10]/95 backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0B131E] rounded-2xl border-2 border-white/10 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveView('event')}
              className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                activeView === 'event'
                  ? 'bg-[#97B3D2] text-[#060A10] shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Calendar size={15} className="flex-shrink-0" />
              <span>Add Event</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('blog')}
              className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                activeView === 'blog'
                  ? 'bg-[#97B3D2] text-[#060A10] shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <FileText size={15} className="flex-shrink-0" />
              <span>Add Blog</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('manage')}
              className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                activeView === 'manage'
                  ? 'bg-[#97B3D2] text-[#060A10] shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Trash2 size={15} className="flex-shrink-0" />
              <span>Manage ({upcomingEvents.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ADD EVENT (Games, Practices, Tournaments) */}
        {activeView === 'event' && (
          <form onSubmit={handleCreateEvent} className="space-y-5">
            {/* 1. Event Type Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                1. Event Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'game', label: 'Game', icon: Trophy },
                  { id: 'practice', label: 'Practice', icon: Dumbbell },
                  { id: 'tournament', label: 'Tournament', icon: Sparkles },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEventType(item.id as any)}
                    className={`py-3 px-3 rounded-2xl border-2 text-xs font-heading font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      eventType === item.id
                        ? 'bg-[#97B3D2] text-[#060A10] border-[#97B3D2]'
                        : 'bg-[#0B131E] text-white/70 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <item.icon size={15} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Target Squad Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                2. Target Squad
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'u16-boys', label: 'U16 Boys' },
                  { id: 'u15-girls', label: 'U15 Girls' },
                  { id: 'all', label: 'Both Squads' },
                ].map((squad) => (
                  <button
                    key={squad.id}
                    type="button"
                    onClick={() => setTargetTeam(squad.id)}
                    className={`py-3 px-2 rounded-2xl border-2 text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer ${
                      targetTeam === squad.id
                        ? 'bg-white text-[#060A10] border-white'
                        : 'bg-[#0B131E] text-white/70 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {squad.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Event Details Card */}
            <div className="p-5 rounded-3xl bg-[#0B131E] border-2 border-white/10 space-y-4">
              {/* Optional Title or Opponent */}
              {eventType === 'game' ? (
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Opponent Team
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mississauga Monarchs"
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    className="w-full bg-[#060A10] border-2 border-white/15 rounded-2xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-[#97B3D2]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Session Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shooting Clinic & Defensive Strategy"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full bg-[#060A10] border-2 border-white/15 rounded-2xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-[#97B3D2]"
                  />
                </div>
              )}

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#060A10] border-2 border-white/15 rounded-2xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#97B3D2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="6:00 PM – 8:00 PM"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full bg-[#060A10] border-2 border-white/15 rounded-2xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-[#97B3D2]"
                  />
                </div>
              </div>

              {/* Quick Time Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase text-white/40 self-center mr-1">Pills:</span>
                {TIME_PRESETS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEventTime(t)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                      eventTime === t
                        ? 'bg-[#97B3D2] text-[#060A10] font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Venue Presets */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60">
                  Gym / Location Presets
                </label>
                <div className="flex flex-col gap-2">
                  {VENUE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setEventVenue(preset.name)
                        setEventAddress(preset.address)
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        eventVenue === preset.name
                          ? 'bg-[#97B3D2]/15 border-[#97B3D2] text-white'
                          : 'bg-[#060A10] border-white/10 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-heading font-bold text-white flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#97B3D2]" />
                        <span>{preset.name}</span>
                      </div>
                      <div className="text-[11px] text-white/50 truncate mt-0.5 font-mono">
                        {preset.address}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Venue inputs */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Custom Gym Name"
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    className="w-full bg-[#060A10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Address / City"
                    value={eventAddress}
                    onChange={(e) => setEventAddress(e.target.value)}
                    className="w-full bg-[#060A10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Game Specific: Uniform & Arrival */}
              {eventType === 'game' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Uniform Color
                    </label>
                    <select
                      value={uniformColor}
                      onChange={(e) => setUniformColor(e.target.value)}
                      className="w-full bg-[#060A10] border-2 border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-medium"
                    >
                      <option value="Home (White)">Home (White)</option>
                      <option value="Away (Black)">Away (Black)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Arrival Time
                    </label>
                    <input
                      type="text"
                      value={arrivalNote}
                      onChange={(e) => setArrivalNote(e.target.value)}
                      className="w-full bg-[#060A10] border-2 border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Optional Notes */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                  Notes for Parents (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bring water bottles and warmup bands"
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                  className="w-full bg-[#060A10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Automated Parent Email Notification Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    className="w-4 h-4 rounded text-[#97B3D2] focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <div className="font-heading font-bold text-white">Email Notification to Parents</div>
                    <div className="text-white/50 text-[11px]">Send automatic event notice to registered parents</div>
                  </div>
                </label>
              </div>
            </div>

            {/* BIG BOLD ACTION BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#97B3D2] hover:bg-white active:scale-98 text-[#060A10] font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Publishing Event...' : 'Publish Event to Team Hub'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* TAB 2: ADD BLOG POST */}
        {activeView === 'blog' && (
          <form onSubmit={handleCreateBlog} className="space-y-5">
            <div className="p-5 rounded-3xl bg-[#0B131E] border-2 border-white/10 space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Season Fundamentals & Shooting Form"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  className="w-full bg-[#060A10] border-2 border-white/15 rounded-2xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-[#97B3D2]"
                />
              </div>

              {/* Category Presets */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60">
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {BLOG_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBlogCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                        blogCategory === cat
                          ? 'bg-[#97B3D2] text-[#060A10] font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Excerpt / Summary */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                  Summary / Excerpt (1-2 sentences)
                </label>
                <input
                  type="text"
                  placeholder="Key takeaways for athletes and parents..."
                  value={blogSummary}
                  onChange={(e) => setBlogSummary(e.target.value)}
                  className="w-full bg-[#060A10] border-2 border-white/15 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#97B3D2]"
                />
              </div>

              {/* Body Content */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                  Article Content
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Write the full post here..."
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full bg-[#060A10] border-2 border-white/15 rounded-2xl p-4 text-sm text-white leading-relaxed focus:outline-none focus:border-[#97B3D2]"
                />
              </div>
            </div>

            {/* Submit Blog Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#97B3D2] hover:bg-white active:scale-98 text-[#060A10] font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Publishing...' : 'Publish Article to Blog'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* TAB 3: MANAGE EVENTS */}
        {activeView === 'manage' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base sm:text-lg font-black uppercase text-white">
                Upcoming Custom Events
              </h2>
              <span className="text-xs font-mono text-white/50">
                {upcomingEvents.length} Created
              </span>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="p-8 rounded-3xl bg-[#0B131E] border-2 border-white/10 text-center space-y-3">
                <Calendar size={32} className="mx-auto text-white/30" />
                <p className="text-sm text-white/60">No custom events added yet.</p>
                <button
                  type="button"
                  onClick={() => setActiveView('event')}
                  className="px-4 py-2 rounded-xl bg-[#97B3D2] text-[#060A10] text-xs font-heading font-black uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add First Event
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#0B131E] border-2 border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#97B3D2]/15 text-[#97B3D2] border border-[#97B3D2]/30">
                          {evt.type}
                        </span>
                        <span className="text-[11px] font-mono text-white/60">
                          {evt.teamId === 'u16-boys' ? 'U16 Boys' : evt.teamId === 'u15-girls' ? 'U15 Girls' : 'Both Teams'}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black uppercase text-white">
                        {evt.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-white/70 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-[#97B3D2]" />
                          {evt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-[#97B3D2]" />
                          {evt.time}
                        </span>
                      </div>

                      <div className="text-xs text-white/50 flex items-center gap-1">
                        <MapPin size={13} className="text-[#97B3D2] flex-shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>

                    {/* 1-Tap Delete Button */}
                    <div className="self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove event: "${evt.title}"?`)) {
                            deleteEvent(evt.id)
                            showToast(`Removed "${evt.title}"`)
                          }
                        }}
                        className="py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 active:scale-95 border border-rose-500/30 text-rose-300 text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Cancel / Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
