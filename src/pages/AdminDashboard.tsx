import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { TEAMS } from '../data/teams'
import { SCHEDULE } from '../data/schedule'
import { MESSAGES, PAYMENTS } from '../data/content'
import { 
  LayoutDashboard, Users, Calendar, Settings, FileText, 
  ChevronRight, Plus, Edit2, Shield, AlertTriangle
} from 'lucide-react'

type Tab = 'overview' | 'content' | 'teams' | 'schedule'

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [teams] = useState(TEAMS)
  const [schedule] = useState(SCHEDULE)
  const [messages] = useState(MESSAGES)
  const [payments] = useState(PAYMENTS)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login')
    }
  }, [isAdmin, authLoading, navigate])

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'content' as Tab, label: 'Content', icon: FileText },
    { id: 'teams' as Tab, label: 'Teams', icon: Users },
    { id: 'schedule' as Tab, label: 'Schedule', icon: Calendar },
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
            <span className="tag mb-4 inline-flex items-center gap-2"><Shield size={14} className="text-eco-orange" /> Administrator</span>
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
                  ? 'bg-eco-orange text-white shadow-glow-sm'
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
            {activeTab === 'overview' && <OverviewTab teams={teams} schedule={schedule} />}
            {activeTab === 'content' && <ContentTab navigate={navigate} />}
            {activeTab === 'teams' && <TeamsTab teams={teams} />}
            {activeTab === 'schedule' && <ScheduleTab schedule={schedule} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function OverviewTab({ teams, schedule }: { teams: any[], schedule: any[] }) {
  const totalPlayers = teams.reduce((acc, team) => acc + team.roster.length, 0)
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Players', value: totalPlayers, icon: Users, color: '#97B3D2' },
          { label: 'Active Teams', value: teams.filter(t => t.isActive).length, icon: Shield, color: '#FF6B00' },
          { label: 'Total Events', value: schedule.length, icon: Calendar, color: '#6A9BC7' },
          { label: 'System Status', value: 'Online', icon: Settings, color: '#4CAF50' },
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
      
      <div className="glow-card p-6 border border-eco-orange/20">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-eco-orange" size={20} />
          <h3 className="font-heading font-bold text-lg text-white">System Notice</h3>
        </div>
        <p className="text-eco-muted-light">
          Welcome to the new Admin Command Center. Data for Teams and Schedule is currently loading from static files. Updates made here (in future releases) will sync with the central database.
        </p>
      </div>
    </div>
  )
}

function ContentTab({ navigate }: { navigate: (path: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glow-card p-6 flex flex-col justify-between items-start h-full min-h-[200px]">
        <div>
          <div className="w-12 h-12 bg-eco-orange/20 rounded-xl flex items-center justify-center mb-4">
            <FileText className="text-eco-orange" size={24} />
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
      
      <div className="glow-card p-6 opacity-50 cursor-not-allowed">
        <h3 className="font-heading font-bold text-white mb-2">Page Content Manager</h3>
        <p className="text-sm text-eco-muted-light mb-4">Edit homepage text, philosophy, and program details directly.</p>
        <div className="text-xs font-mono uppercase tracking-widest text-eco-orange bg-eco-orange/10 inline-block px-3 py-1 rounded">Coming Soon</div>
      </div>
    </div>
  )
}

function TeamsTab({ teams }: { teams: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-xl text-white">Roster Management</h3>
        <button className="btn-ghost flex items-center gap-2 text-sm"><Plus size={16} /> Add Team</button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map(team => (
          <div key={team.id} className="glow-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-heading font-bold text-lg text-white">{team.name}</h4>
                <p className="text-sm text-eco-muted">{team.season} • {team.roster.length} Players</p>
              </div>
              <button className="text-eco-muted hover:text-eco-orange transition-colors"><Edit2 size={16} /></button>
            </div>
            <div className="space-y-2 mt-4 max-h-[200px] overflow-y-auto scrollbar-thin pr-2">
              {team.roster.map((player: any) => (
                <div key={player.id} className="flex items-center justify-between p-2 bg-eco-surface2 rounded-lg border border-eco-border text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-eco-orange font-mono text-xs w-4">#{player.number}</span>
                    <span className="text-white">{player.name}</span>
                  </div>
                  <span className="text-eco-muted text-xs">{player.position}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScheduleTab({ schedule }: { schedule: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-xl text-white">Event Schedule</h3>
        <button className="btn-ghost flex items-center gap-2 text-sm"><Plus size={16} /> Add Event</button>
      </div>
      
      <div className="glow-card overflow-hidden">
        <div className="divide-y divide-eco-border">
          {schedule.map(event => (
            <div key={event.id} className="flex items-center justify-between p-4 hover:bg-eco-surface2/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-center w-12 flex-shrink-0">
                  <p className="font-display text-lg text-white">{new Date(event.date).getDate()}</p>
                  <p className="text-[10px] text-eco-muted uppercase">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                </div>
                <div>
                  <p className="font-heading font-bold text-sm text-white">{event.title}</p>
                  <p className="text-xs text-eco-muted">{event.location}</p>
                </div>
              </div>
              <button className="text-eco-muted hover:text-eco-orange transition-colors"><Edit2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
