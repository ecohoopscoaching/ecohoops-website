import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { 
  LayoutDashboard, Users, Calendar, Settings, FileText, 
  ChevronRight, Plus, Edit2, Shield, AlertTriangle, Trash2,
  Sparkles, Download, Copy, Check, Search, Filter, Phone, Mail, MapPin, CalendarDays, CheckCircle2, Info
} from 'lucide-react'
import { blogService } from '../lib/blog-service'
import { BLOG_POSTS } from '../data/blogs'
import { BlogPost } from '../types'
import { 
  WaitlistEntry, getStoredWaitlist, calculateWaitlistMetrics, exportWaitlistToCsv 
} from '../data/waitlist'

import MarketingPlaybook from './MarketingPlaybook'

type Tab = 'overview' | 'waitlist' | 'content' | 'teams' | 'schedule' | 'marketing'

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login')
    }
  }, [isAdmin, authLoading, navigate])

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'waitlist' as Tab, label: 'Jr. Waitlist & Leads', icon: Sparkles },
    { id: 'content' as Tab, label: 'Content', icon: FileText },
    { id: 'teams' as Tab, label: 'Teams', icon: Users },
    { id: 'schedule' as Tab, label: 'Schedule', icon: Calendar },
    { id: 'marketing' as Tab, label: 'Marketing Playbook v2', icon: Shield },
  ]

  return (
    <section className="pt-28 pb-20 min-h-screen bg-eco-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10"
        >
          <div>
            <span className="tag mb-4 inline-flex items-center gap-2"><Shield size={14} className="text-eco-blue" /> Administrator</span>
            <h1 className="font-display text-section uppercase">
              <span className="gradient-text">COMMAND CENTER</span>
            </h1>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-heading font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-eco-blue text-eco-black font-bold shadow-glow-sm'
                  : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <OverviewTab onNavigateWaitlist={() => setActiveTab('waitlist')} />}
            {activeTab === 'waitlist' && <WaitlistTab />}
            {activeTab === 'content' && <ContentTab navigate={navigate} />}
            {activeTab === 'teams' && <TeamsTab />}
            {activeTab === 'schedule' && <ScheduleTab />}
            {activeTab === 'marketing' && <div className="-mt-20"><MarketingPlaybook /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function OverviewTab({ onNavigateWaitlist }: { onNavigateWaitlist?: () => void }) {
  const { teams, schedule } = useData()
  const totalPlayers = teams.reduce((acc, team) => acc + team.roster.length, 0)
  const waitlistEntries = getStoredWaitlist()
  const waitlistMetrics = calculateWaitlistMetrics(waitlistEntries)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Real Waitlist Leads', value: waitlistMetrics.realSubmissions, icon: Sparkles, color: '#00D26A' },
          { label: 'Unique Families', value: waitlistMetrics.uniqueParentContacts, icon: Users, color: '#97B3D2' },
          { label: 'Total Players', value: totalPlayers, icon: Users, color: '#97B3D2' },
          { label: 'Active Teams', value: teams.filter(t => t.isActive).length, icon: Shield, color: '#97B3D2' },
          { label: 'Total Events', value: schedule.length, icon: Calendar, color: '#6A9BC7' },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <span className="text-xs text-eco-muted uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="font-display text-3xl text-white">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="glow-card p-6 border border-eco-blue/20 bg-eco-surface rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="text-eco-blue" size={18} />
            <h3 className="font-heading font-bold text-lg text-white">Jr. NBA / Jr. WNBA Waitlist Active</h3>
          </div>
          <p className="text-eco-muted-light text-sm max-w-2xl">
            {waitlistMetrics.realSubmissions} real parent leads received across {waitlistMetrics.uniqueParentContacts} unique families. 1 test record excluded. Missing historical fields displayed as "Not provided".
          </p>
        </div>
        {onNavigateWaitlist && (
          <button
            onClick={onNavigateWaitlist}
            className="btn-glow text-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <span>View Full Waitlist</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className="glow-card p-6 border border-eco-border bg-eco-surface rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-eco-blue" size={20} />
          <h3 className="font-heading font-bold text-lg text-white">Live Data System Active</h3>
        </div>
        <p className="text-eco-muted-light">
          Welcome to the EcoHoops Command Center. Roster management and event planning changes are immediately written to local storage and propagate across all public sections of the web application (Schedule, Teams, and Player Profiles).
        </p>
      </div>
    </div>
  )
}

function WaitlistTab() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAge, setFilterAge] = useState<string>('All')
  const [filterStatus, setFilterStatus] = useState<'All' | 'Real' | 'Test'>('All')
  const [copiedEmails, setCopiedEmails] = useState(false)

  useEffect(() => {
    setEntries(getStoredWaitlist())
  }, [])

  const metrics = calculateWaitlistMetrics(entries)

  const filteredEntries = entries.filter((entry) => {
    if (filterAge !== 'All' && entry.ageGroup !== filterAge) return false
    if (filterStatus === 'Real' && entry.isTest) return false
    if (filterStatus === 'Test' && !entry.isTest) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesName = entry.parentName.toLowerCase().includes(q)
      const matchesEmail = entry.email.toLowerCase().includes(q)
      const matchesPhone = entry.phone.toLowerCase().includes(q)
      const matchesNeighbourhood = entry.neighbourhood.toLowerCase().includes(q)
      const matchesDays = entry.daysAvailable.toLowerCase().includes(q)
      return matchesName || matchesEmail || matchesPhone || matchesNeighbourhood || matchesDays
    }
    return true
  })

  const handleCopyEmails = () => {
    const realEmails = Array.from(
      new Set(entries.filter((e) => !e.isTest).map((e) => e.email.trim()).filter(Boolean))
    )
    navigator.clipboard.writeText(realEmails.join(', '))
    setCopiedEmails(true)
    setTimeout(() => setCopiedEmails(false), 2500)
  }

  const handleExportCsv = () => {
    exportWaitlistToCsv(filteredEntries)
  }

  return (
    <div className="space-y-8">
      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-eco-blue/15 flex items-center justify-center text-eco-blue">
              <Sparkles size={15} />
            </div>
            <span className="text-[11px] text-eco-muted uppercase tracking-wider font-mono">Total Subs</span>
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">{metrics.totalSubmissions}</p>
          <p className="text-[10px] text-eco-muted mt-1">Includes 1 test entry</p>
        </div>

        <div className="stat-card border-emerald-500/30">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={15} />
            </div>
            <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-mono">Real Leads</span>
          </div>
          <p className="font-display text-2xl sm:text-3xl text-emerald-300">{metrics.realSubmissions}</p>
          <p className="text-[10px] text-eco-muted mt-1">Adrian test excluded</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#003366] flex items-center justify-center text-[#97B3D2]">
              <Users size={15} />
            </div>
            <span className="text-[11px] text-eco-muted uppercase tracking-wider font-mono">Unique Parents</span>
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">{metrics.uniqueParentContacts}</p>
          <p className="text-[10px] text-eco-muted mt-1">Deduplicated contacts</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <Users size={15} />
            </div>
            <span className="text-[11px] text-eco-muted uppercase tracking-wider font-mono">Est. Children</span>
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">
            {metrics.estimatedChildrenMin === metrics.estimatedChildrenMax 
              ? metrics.estimatedChildrenMin 
              : `${metrics.estimatedChildrenMin}–${metrics.estimatedChildrenMax}`}
          </p>
          <p className="text-[10px] text-eco-muted mt-1">Unresolved sibling count</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400">
              <Shield size={15} />
            </div>
            <span className="text-[11px] text-eco-muted uppercase tracking-wider font-mono">Paid Regs</span>
          </div>
          <p className="font-display text-2xl sm:text-3xl text-white">{metrics.paidRegistrations}</p>
          <p className="text-[10px] text-eco-muted mt-1">Waitlist distinct from paid</p>
        </div>
      </div>

      {/* DIVISION BREAKDOWN STRIP */}
      <div className="p-4 rounded-2xl bg-eco-surface border border-eco-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-eco-muted">
            Division Breakdown (Real Leads):
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-eco-blue/15 border border-eco-blue/30 text-eco-blue-light font-heading font-bold">
              Ages 5–6 (Co-Ed): {metrics.divisionBreakdown['Ages 5–6']}
            </span>
            <span className="px-3 py-1 rounded-xl bg-[#003366]/40 border border-[#97B3D2]/30 text-[#97B3D2] font-heading font-bold">
              Ages 7–9: {metrics.divisionBreakdown['Ages 7–9']}
            </span>
            <span className="px-3 py-1 rounded-xl bg-eco-surface2 border border-eco-border text-eco-muted font-heading font-bold">
              Ages 10–11: {metrics.divisionBreakdown['Ages 10–11']}
            </span>
          </div>
        </div>
        <div className="text-xs text-eco-muted font-mono">
          Programs run based on registration numbers
        </div>
      </div>

      {/* AUDIT & RECONCILIATION EXPLANATION ALERT */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200/90 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <AlertTriangle size={17} className="flex-shrink-0" />
          <span>Audit Reconciliation & Child Count Uncertainty Notice</span>
        </div>
        <p className="leading-relaxed">
          • <strong>5 Submissions in Total:</strong> 1 submission from “Dre” was Adrian testing (marked <span className="font-mono text-amber-400 font-bold">TEST</span> and excluded from real metrics).<br />
          • <strong>4 Real Submissions across 3 Unique Parent Contacts:</strong> One parent submitted twice (once for Ages 5–6 and once for Ages 7–9). These are preserved as separate records representing either 2 sibling children or a correction; they are flagged with uncertainty and not merged or deleted.<br />
          • <strong>Historical Fields:</strong> For historical records submitted prior to today's form update, missing fields (days available, group preference, neighbourhood) are clearly displayed as <span className="font-mono italic text-eco-muted">Not provided</span>.<br />
          • <strong>Attribution:</strong> Historical records are organic and not attributed to Meta ads.
        </p>
      </div>

      {/* SEARCH, FILTERS & ACTION CONTROLS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Age group filter */}
          <div className="flex items-center gap-1 bg-eco-surface border border-eco-border rounded-xl p-1 text-xs font-heading">
            {['All', 'Ages 5–6', 'Ages 7–9', 'Ages 10–11'].map((age) => (
              <button
                key={age}
                onClick={() => setFilterAge(age)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterAge === age
                    ? 'bg-eco-blue text-eco-black font-bold shadow-sm'
                    : 'text-eco-muted hover:text-white'
                }`}
              >
                {age}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-eco-surface border border-eco-border rounded-xl p-1 text-xs font-heading">
            {(['All', 'Real', 'Test'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === st
                    ? 'bg-[#003366] text-white font-bold shadow-sm'
                    : 'text-eco-muted hover:text-white'
                }`}
              >
                {st === 'All' ? 'All Records' : st === 'Real' ? 'Real Leads' : 'Tests'}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parent, email, area..."
              className="w-full bg-eco-surface border border-eco-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-eco-muted/60 focus:outline-none focus:border-eco-blue"
            />
          </div>

          <button
            onClick={handleCopyEmails}
            className="px-3.5 py-2 rounded-xl bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white text-xs font-heading font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy real parent email addresses"
          >
            {copiedEmails ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedEmails ? 'Copied!' : 'Copy Emails'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="btn-glow text-xs !py-2 !px-4 flex items-center gap-1.5 cursor-pointer"
            title="Download CSV of filtered entries"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* SUBMISSIONS TABLE */}
      <div className="glow-card overflow-hidden bg-eco-surface border border-eco-border rounded-2xl">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs text-eco-muted-light">
            <thead className="bg-[#050B14] border-b border-eco-border text-[10px] font-mono uppercase tracking-wider text-eco-muted">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Parent / Guardian</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Division & Group</th>
                <th className="py-3 px-4">Days Available</th>
                <th className="py-3 px-4">Neighbourhood</th>
                <th className="py-3 px-4">Kids</th>
                <th className="py-3 px-4">Source & Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eco-border/60">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-eco-muted">
                    No waitlist submissions match your current filters.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-eco-surface2/50 transition-colors ${
                      entry.isTest ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {entry.isTest ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          TEST
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          REAL LEAD
                        </span>
                      )}
                    </td>

                    {/* Parent Name & Email */}
                    <td className="py-3.5 px-4 min-w-[180px]">
                      <div className="font-heading font-bold text-white text-xs">
                        {entry.parentName}
                      </div>
                      <a
                        href={`mailto:${entry.email}`}
                        className="text-[11px] text-eco-blue hover:underline font-mono"
                      >
                        {entry.email}
                      </a>
                      {entry.uncertaintyFlag && (
                        <div className="mt-1 text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <AlertTriangle size={11} className="flex-shrink-0" />
                          <span>{entry.uncertaintyFlag}</span>
                        </div>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {entry.phone && entry.phone !== 'Not provided' ? (
                        <span className="font-mono text-white">{entry.phone}</span>
                      ) : (
                        <span className="text-eco-muted italic">Not provided</span>
                      )}
                    </td>

                    {/* Division & Group */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-white">{entry.ageGroup}</div>
                      <div className="text-[11px] text-eco-muted">
                        Pref: <span className="text-eco-muted-light font-semibold">{entry.groupPreference}</span>
                      </div>
                    </td>

                    {/* Days Available */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {entry.daysAvailable && entry.daysAvailable !== 'Not provided' ? (
                        <span className="px-2 py-0.5 rounded bg-eco-surface2 border border-eco-border text-eco-blue-light font-medium">
                          {entry.daysAvailable}
                        </span>
                      ) : (
                        <span className="text-eco-muted italic">Not provided</span>
                      )}
                    </td>

                    {/* Neighbourhood / Postal */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {entry.neighbourhood && entry.neighbourhood !== 'Not provided' ? (
                        <span className="text-white">{entry.neighbourhood}</span>
                      ) : (
                        <span className="text-eco-muted italic">Not provided</span>
                      )}
                    </td>

                    {/* Kids */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-white">{entry.childCount || '1'}</span>
                    </td>

                    {/* Source & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                      <div className="text-eco-muted-light">{entry.source}</div>
                      <div className="text-[10px] font-mono text-eco-muted">{entry.submissionTime}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ContentTab({ navigate }: { navigate: (path: string) => void }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const dbPosts = await blogService.getFirestorePosts()
      const combined = [...dbPosts, ...BLOG_POSTS]
        .filter(post => !blogService.isPostDeleted(post.id))
        .sort((a, b) => {
          const timeA = a.date ? new Date(a.date).getTime() : 0
          const timeB = b.date ? new Date(b.date).getTime() : 0
          const validA = isNaN(timeA) ? 0 : timeA
          const validB = isNaN(timeB) ? 0 : timeB
          return validB - validA
        })
      setPosts(combined)
    } catch (error) {
      console.error('Error fetching admin posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the blog post "${title}"?`)) {
      const result = await blogService.deleteBlogPost(id)
      if (result.success) {
        alert('Blog post deleted successfully!')
        fetchPosts()
      } else {
        alert('Failed to delete blog post.')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Blog Manager Actions */}
        <div className="glow-card p-6 flex flex-col justify-between items-start h-full min-h-[220px] bg-eco-surface border border-eco-border rounded-2xl lg:col-span-1">
          <div>
            <div className="w-12 h-12 bg-eco-blue/20 rounded-xl flex items-center justify-center mb-4">
              <FileText className="text-eco-blue" size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">Blog Manager</h3>
            <p className="text-eco-muted-light text-sm">Create, edit, or delete journal entries and site articles.</p>
          </div>
          <button 
            onClick={() => navigate('/admin/blog/new')}
            className="mt-6 btn-glow flex items-center gap-2 w-full justify-center"
          >
            <Plus size={16} /> New Blog Post
          </button>
        </div>

        {/* Blog List & Deletion Panel */}
        <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl lg:col-span-2">
          <h3 className="font-heading font-bold text-xl text-white mb-4">Manage Existing Entries</h3>
          
          {isLoading ? (
            <p className="text-sm text-eco-muted font-mono">Loading entries...</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-eco-muted py-4 text-center">No blog posts found.</p>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="p-3 bg-eco-surface2 rounded-xl border border-eco-border flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-eco-blue bg-eco-blue/10 px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                      <span className="text-[10px] font-mono text-eco-muted">
                        {(() => {
                          try {
                            if (post.date) {
                              const d = new Date(post.date)
                              if (!isNaN(d.getTime())) return d.toLocaleDateString()
                            }
                          } catch (e) {}
                          return 'Recent'
                        })()}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-white truncate">{post.title}</h4>
                    <p className="text-xs text-eco-muted truncate">By {post.author}</p>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="text-eco-muted hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all flex-shrink-0"
                    title="Delete Post"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glow-card p-6 opacity-50 cursor-not-allowed bg-eco-surface border border-eco-border rounded-2xl">
        <h3 className="font-heading font-bold text-white mb-2">Page Content Manager</h3>
        <p className="text-sm text-eco-muted-light mb-4">Edit homepage text, philosophy, and program details directly.</p>
        <div className="text-xs font-mono uppercase tracking-widest text-eco-blue bg-eco-blue/10 inline-block px-3 py-1 rounded">Coming Soon</div>
      </div>
    </div>
  )
}

function TeamsTab() {
  const { teams, addPlayerToTeam, deletePlayerFromTeam, updatePlayerDetails } = useData()
  const [activeTeamIdForAdd, setActiveTeamIdForAdd] = useState<string | null>(null)
  const [editPlayerId, setEditPlayerId] = useState<string | null>(null)
  const [editTeamId, setEditTeamId] = useState<string | null>(null)

  // Add Form State
  const [addName, setAddName] = useState('')
  const [addNumber, setAddNumber] = useState('')
  const [addPosition, setAddPosition] = useState('')
  const [addHeight, setAddHeight] = useState('')
  const [addAge, setAddAge] = useState('')

  // Edit Form State
  const [editName, setEditName] = useState('')
  const [editNumber, setEditNumber] = useState('')
  const [editPosition, setEditPosition] = useState('')
  const [editHeight, setEditHeight] = useState('')
  const [editAge, setEditAge] = useState('')

  const handleAddSubmit = (teamId: string) => {
    if (!addName.trim() || !addNumber || !addPosition || !addHeight || !addAge) {
      alert('Please fill out all player details.')
      return
    }

    const newPlayer = {
      id: 'p-' + Date.now(),
      name: addName.trim(),
      number: parseInt(addNumber) || 0,
      position: addPosition.trim(),
      height: addHeight.trim(),
      age: parseInt(addAge) || 0,
      stats: { ppg: 0, rpg: 0, apg: 0, spg: 0, fgPct: 0 }
    }

    addPlayerToTeam(teamId, newPlayer)
    setActiveTeamIdForAdd(null)

    // Clear state
    setAddName('')
    setAddNumber('')
    setAddPosition('')
    setAddHeight('')
    setAddAge('')
  }

  const handleStartEdit = (teamId: string, player: any) => {
    setEditTeamId(teamId)
    setEditPlayerId(player.id)
    setEditName(player.name)
    setEditNumber(String(player.number))
    setEditPosition(player.position)
    setEditHeight(player.height)
    setEditAge(String(player.age))
  }

  const handleSaveEdit = () => {
    if (!editName.trim() || !editNumber || !editPosition || !editHeight || !editAge) {
      alert('Please fill out all player details.')
      return
    }

    if (editTeamId && editPlayerId) {
      updatePlayerDetails(editTeamId, editPlayerId, {
        name: editName.trim(),
        number: parseInt(editNumber) || 0,
        position: editPosition.trim(),
        height: editHeight.trim(),
        age: parseInt(editAge) || 0
      })
      setEditPlayerId(null)
      setEditTeamId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-xl text-white">Roster Management</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map(team => (
          <div key={team.id} className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-heading font-bold text-lg text-white">{team.name}</h4>
                <p className="text-sm text-eco-muted">{team.season} • {team.roster.length} Players</p>
              </div>
              <button 
                onClick={() => {
                  setActiveTeamIdForAdd(activeTeamIdForAdd === team.id ? null : team.id)
                  setEditPlayerId(null)
                }}
                className="btn-glow text-xs flex items-center gap-1.5 !px-3 !py-1.5"
              >
                <Plus size={12} /> Add Player
              </button>
            </div>

            {/* Add Player Inline Form */}
            <AnimatePresence>
              {activeTeamIdForAdd === team.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-eco-surface2 border border-eco-blue/30 overflow-hidden"
                >
                  <h5 className="text-xs font-mono uppercase tracking-widest text-eco-blue mb-3">Add New Athlete</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="col-span-2 md:col-span-3">
                      <input 
                        placeholder="Player Name" 
                        value={addName}
                        onChange={(e) => setAddName(e.target.value)}
                        className="input-field !py-2 !px-3 text-xs"
                      />
                    </div>
                    <div>
                      <input 
                        type="number" 
                        placeholder="Jersey #" 
                        value={addNumber}
                        onChange={(e) => setAddNumber(e.target.value)}
                        className="input-field !py-2 !px-3 text-xs"
                      />
                    </div>
                    <div>
                      <input 
                        placeholder="Position (e.g. PG)" 
                        value={addPosition}
                        onChange={(e) => setAddPosition(e.target.value)}
                        className="input-field !py-2 !px-3 text-xs"
                      />
                    </div>
                    <div>
                      <input 
                        placeholder="Height (e.g. 5ft 8in)" 
                        value={addHeight}
                        onChange={(e) => setAddHeight(e.target.value)}
                        className="input-field !py-2 !px-3 text-xs"
                      />
                    </div>
                    <div>
                      <input 
                        type="number" 
                        placeholder="Age" 
                        value={addAge}
                        onChange={(e) => setAddAge(e.target.value)}
                        className="input-field !py-2 !px-3 text-xs"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-3 flex justify-end gap-2 mt-2">
                      <button 
                        onClick={() => setActiveTeamIdForAdd(null)}
                        className="px-3 py-1.5 rounded-lg border border-eco-border text-eco-muted text-xs hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleAddSubmit(team.id)}
                        className="btn-glow text-xs !px-4 !py-1.5"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Roster list */}
            <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto scrollbar-thin pr-2">
              {team.roster.map((player: any) => {
                const isEditing = editTeamId === team.id && editPlayerId === player.id
                return (
                  <div key={player.id} className="p-3 bg-eco-surface2 rounded-xl border border-eco-border flex flex-col gap-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <div className="col-span-2 md:col-span-3">
                            <label className="text-[10px] text-eco-muted font-mono uppercase">Name</label>
                            <input 
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="input-field !py-1.5 !px-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-eco-muted font-mono uppercase">Jersey #</label>
                            <input 
                              type="number" 
                              value={editNumber}
                              onChange={(e) => setEditNumber(e.target.value)}
                              className="input-field !py-1.5 !px-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-eco-muted font-mono uppercase">Position</label>
                            <input 
                              value={editPosition}
                              onChange={(e) => setEditPosition(e.target.value)}
                              className="input-field !py-1.5 !px-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-eco-muted font-mono uppercase">Height</label>
                            <input 
                              value={editHeight}
                              onChange={(e) => setEditHeight(e.target.value)}
                              className="input-field !py-1.5 !px-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-eco-muted font-mono uppercase">Age</label>
                            <input 
                              type="number" 
                              value={editAge}
                              onChange={(e) => setEditAge(e.target.value)}
                              className="input-field !py-1.5 !px-2 text-xs"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 text-xs">
                          <button 
                            onClick={() => {
                              setEditPlayerId(null)
                              setEditTeamId(null)
                            }}
                            className="px-2.5 py-1 rounded border border-eco-border text-eco-muted hover:text-white"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleSaveEdit}
                            className="bg-eco-blue text-eco-black font-bold px-3 py-1 rounded"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-eco-blue font-mono text-xs w-6">#{player.number}</span>
                          <span className="text-white font-medium">{player.name}</span>
                          <span className="text-[10px] text-eco-muted px-2 py-0.5 bg-eco-surface rounded border border-eco-border text-xs">
                            {player.position} • {player.height} • {player.age} yrs
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleStartEdit(team.id, player)}
                            className="text-eco-muted hover:text-eco-blue transition-colors p-1"
                            title="Edit Player"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${player.name} from the roster?`)) {
                                deletePlayerFromTeam(team.id, player.id)
                              }
                            }}
                            className="text-eco-muted hover:text-red-400 transition-colors p-1"
                            title="Delete Player"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              {team.roster.length === 0 && (
                <p className="text-xs text-eco-muted text-center py-4">No players on roster</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScheduleTab() {
  const { schedule, addEvent, deleteEvent } = useData()
  const [showAddForm, setShowAddForm] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'game' | 'practice' | 'tournament' | 'event'>('game')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [opponent, setOpponent] = useState('')
  const [homeAway, setHomeAway] = useState<'home' | 'away'>('home')

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date || !time || !location) {
      alert('Please fill out Title, Date, Time, and Location.')
      return
    }

    const newEvent = {
      id: 'event-' + Date.now(),
      type,
      title: title.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      opponent: type === 'game' ? opponent.trim() : undefined,
      homeAway: type === 'game' ? homeAway : undefined,
      rsvp: { going: 0, maybe: 0, notGoing: 0, total: 0 }
    }

    addEvent(newEvent)
    setShowAddForm(false)

    // Reset Form
    setTitle('')
    setType('game')
    setDate('')
    setTime('')
    setLocation('')
    setOpponent('')
    setHomeAway('home')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-xl text-white">Event Schedule</h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-glow flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glow-card p-6 bg-eco-surface border border-eco-blue/30 rounded-2xl overflow-hidden mb-6"
          >
            <form onSubmit={handleAddEvent} className="space-y-4">
              <h4 className="font-heading font-bold text-white text-lg">Add New Calendar Event</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">Event Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. vs Oakville Venom or Practice Session"
                    className="input-field !py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">Event Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="bg-eco-surface2 text-white border border-eco-border rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-eco-blue cursor-pointer"
                  >
                    <option value="game">Game</option>
                    <option value="practice">Practice</option>
                    <option value="tournament">Tournament</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field !py-2 text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">Time</label>
                  <input
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 6:30 PM"
                    className="input-field !py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. EcoHoops Court 1"
                    className="input-field !py-2"
                    required
                  />
                </div>
                {type === 'game' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">Opponent</label>
                      <input
                        value={opponent}
                        onChange={(e) => setOpponent(e.target.value)}
                        placeholder="Opponent Team Name"
                        className="input-field !py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">Court Side</label>
                      <select
                        value={homeAway}
                        onChange={(e) => setHomeAway(e.target.value as any)}
                        className="bg-eco-surface2 text-white border border-eco-border rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-eco-blue cursor-pointer"
                      >
                        <option value="home">Home Game</option>
                        <option value="away">Away Game</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl border border-eco-border text-eco-muted hover:text-white transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-glow text-sm !px-5 !py-2"
                >
                  Create Event
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glow-card overflow-hidden bg-eco-surface border border-eco-border rounded-2xl">
        <div className="divide-y divide-eco-border">
          {schedule.length > 0 ? (
            schedule.map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 hover:bg-eco-surface2/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center w-12 flex-shrink-0">
                    <p className="font-display text-lg text-white">{new Date(event.date).getDate()}</p>
                    <p className="text-[10px] text-eco-muted uppercase">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-bold text-sm text-white">{event.title}</p>
                      <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold ${
                        event.type === 'game' ? 'bg-eco-blue/15 text-eco-blue border border-eco-blue/20' :
                        event.type === 'practice' ? 'bg-eco-muted/15 text-eco-muted-light border border-white/5' :
                        'bg-eco-surface2 text-eco-muted border border-eco-border'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-xs text-eco-muted">{event.location} • {event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this event?')) {
                        deleteEvent(event.id)
                      }
                    }}
                    className="text-eco-muted hover:text-red-400 transition-colors p-2"
                    title="Delete Event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-eco-muted p-8 text-center bg-eco-surface">No events found in calendar.</p>
          )}
        </div>
      </div>
    </div>
  )
}
