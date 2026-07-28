import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { 
  LayoutDashboard, Users, Calendar, Settings, FileText, 
  ChevronRight, Plus, Edit2, Shield, AlertTriangle, Trash2
} from 'lucide-react'
import { blogService } from '../lib/blog-service'
import { BLOG_POSTS } from '../data/blogs'
import { BlogPost } from '../types'

import MarketingPlaybook from './MarketingPlaybook'

type Tab = 'overview' | 'content' | 'teams' | 'schedule' | 'marketing'

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
            {activeTab === 'overview' && <OverviewTab />}
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

function OverviewTab() {
  const { teams, schedule } = useData()
  const totalPlayers = teams.reduce((acc, team) => acc + team.roster.length, 0)
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Players', value: totalPlayers, icon: Users, color: '#97B3D2' },
          { label: 'Active Teams', value: teams.filter(t => t.isActive).length, icon: Shield, color: '#97B3D2' },
          { label: 'Total Events', value: schedule.length, icon: Calendar, color: '#6A9BC7' },
          { label: 'System Status', value: 'Live', icon: Settings, color: '#4CAF50' },
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
      
      <div className="glow-card p-6 border border-eco-blue/20 bg-eco-surface rounded-2xl">
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
