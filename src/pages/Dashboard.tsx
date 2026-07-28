import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, MessageCircle, CreditCard, Users,
  TrendingUp, Trophy, Clock, Check, X, Send, Bot,
  ChevronRight, Bell, ArrowUpRight, Search, UploadCloud, BarChart2, FileText,
  Plus, Newspaper, Key, Loader2, Settings, Sparkles, AlertTriangle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import {
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  askAICoach,
  getSimulatedResponse
} from '../lib/gemini'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

type Tab = 'overview' | 'messages' | 'payments' | 'ai-coach' | 'analytics'

export default function Dashboard() {
  useDocumentTitle('Member Dashboard')
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    ...(isAdmin ? [{ id: 'analytics' as Tab, label: 'Analytics', icon: BarChart2 }] : []),
    { id: 'messages' as Tab, label: 'Messages', icon: MessageCircle },
    ...(isAdmin ? [{ id: 'payments' as Tab, label: 'Payments', icon: CreditCard }] : []),
    { id: 'ai-coach' as Tab, label: 'AI Coach', icon: Bot },
  ]

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10"
        >
          <div>
            <span className="tag mb-4 inline-block">Team Hub</span>
            <h1 className="font-display text-section uppercase">
              <span className="gradient-text">DASHBOARD</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="relative w-10 h-10 rounded-xl bg-eco-surface border border-eco-border flex items-center justify-center text-eco-muted hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-eco-blue text-eco-black font-bold rounded-full text-[10px] flex items-center justify-center">3</span>
            </button>
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

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'messages' && <MessagesTab />}
            {activeTab === 'payments' && <PaymentsTab />}
            {activeTab === 'ai-coach' && <AICoachTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ─── OVERVIEW TAB ─── */
function OverviewTab() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const { teams, schedule, messages } = useData()

  const upcomingEvents = schedule
    .filter((e) => !e.result)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  const totalPlayers = teams.reduce((sum, t) => sum + t.roster.length, 0)
  
  // Calculate win rate across all teams
  let totalWins = 0
  let totalLosses = 0
  teams.forEach(t => {
    const [w, l] = t.record.split('-').map(Number)
    if (!isNaN(w) && !isNaN(l)) {
      totalWins += w
      totalLosses += l
    }
  })
  const totalGames = totalWins + totalLosses
  const winRate = totalGames > 0 ? `${Math.round((totalWins / totalGames) * 100)}%` : '0%'

  // Next game date
  const nextGameDate = upcomingEvents[0]
    ? new Date(upcomingEvents[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'None'

  const unreadCount = messages.filter(m => m.unread).length

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Players', value: String(totalPlayers), icon: Users, color: '#97B3D2' },
          { label: 'Win Rate', value: winRate, icon: TrendingUp, color: '#B0C8E0' },
          { label: 'Next Game', value: nextGameDate, icon: Calendar, color: '#6A9BC7' },
          { label: 'Unread', value: String(unreadCount), icon: MessageCircle, color: '#4A7FB5' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="glow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-eco-blue flex items-center gap-2">
              <Calendar size={14} />
              Upcoming
            </h3>
            {isAdmin && (
               <button 
                onClick={() => navigate('/admin/blog/new')}
                className="text-[10px] font-mono uppercase tracking-widest text-eco-muted hover:text-eco-blue transition-colors flex items-center gap-1 bg-eco-surface2 px-2 py-1 rounded-md border border-white/5"
              >
                <Plus size={10} /> New Post
              </button>
            )}
          </div>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-3 rounded-xl bg-eco-surface2 border border-eco-border">
                  <div className="text-center w-10">
                    <p className="font-display text-lg text-white">{new Date(event.date).getDate()}</p>
                    <p className="text-[10px] text-eco-muted uppercase">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-sm text-white truncate">{event.title}</p>
                    <p className="text-xs text-eco-muted flex items-center gap-1">
                      <Clock size={10} /> {event.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Check size={10} className="text-white" />
                    <span className="text-xs text-eco-muted">{event.rsvp.going}/{event.rsvp.total}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-eco-muted p-4 text-center">No upcoming events scheduled</p>
            )}
          </div>
        </div>

        {/* Teams Summary */}
        <div className="glow-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-eco-blue mb-4 flex items-center gap-2">
            <Trophy size={14} />
            Teams
          </h3>
          <div className="space-y-3">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center gap-4 p-3 rounded-xl bg-eco-surface2 border border-eco-border">
                <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center font-display text-lg text-eco-blue">
                  {team.roster.length}
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-sm text-white">{team.name}</p>
                  <p className="text-xs text-eco-muted">{team.ageGroup} &middot; Born {team.birthYear}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-white text-sm">{team.record}</p>
                  <p className="text-xs text-eco-muted">W-L</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── MESSAGES TAB ─── */
function MessagesTab() {
  const { isAdmin, currentUser } = useAuth()
  const { messages, sendMessage } = useData()
  const [activeChannel, setActiveChannel] = useState('general')
  const [messageInput, setMessageInput] = useState('')

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    const sender = isAdmin ? 'Coach Adrian' : (currentUser?.displayName || 'Parent User')
    sendMessage(activeChannel, messageInput.trim(), sender)
    setMessageInput('')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Channel List */}
      <div className="glow-card p-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-eco-blue mb-4 px-2">Channels</h3>
        {['general', '2011-boys', '2012-girls', ...(isAdmin ? ['payments', 'coaches'] : [])].map((channel) => {
          const unread = messages.filter((m) => m.channel === channel && m.unread).length
          const isActive = activeChannel === channel
          return (
            <button
              key={channel}
              onClick={() => setActiveChannel(channel)}
              className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-eco-surface2 transition-colors text-left ${
                isActive ? 'bg-eco-surface2 border border-eco-blue/20' : ''
              }`}
            >
              <span className={`text-sm font-heading capitalize ${isActive ? 'text-eco-blue font-bold' : 'text-white'}`}>
                # {channel.replace('-', ' ')}
              </span>
              {unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-eco-blue text-[10px] flex items-center justify-center text-eco-black font-bold">
                  {unread}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Message Feed */}
      <div className="lg:col-span-2 glow-card flex flex-col" style={{ minHeight: '500px' }}>
        <div className="p-4 border-b border-eco-border">
          <h3 className="font-heading font-bold text-white capitalize"># {activeChannel.replace('-', ' ')}</h3>
          <p className="text-xs text-eco-muted">
            {activeChannel === 'general' ? 'Team-wide announcements and chat' : 
             activeChannel === 'payments' ? 'Confidential parent billing support' :
             activeChannel === 'coaches' ? 'Coach-only alignment room' :
             `${activeChannel.replace('-', ' ')} team communication`}
          </p>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[350px]">
          {messages.filter((m) => m.channel === activeChannel).map((msg) => (
            <div key={msg.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-eco-surface2 border border-eco-border flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-eco-blue">{msg.sender[0]}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-heading font-bold text-white">{msg.sender}</span>
                  <span className="text-xs text-eco-muted">{msg.timestamp}</span>
                </div>
                <p className="text-sm text-eco-muted-light mt-1">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-eco-border bg-eco-surface2/30">
          <div className="flex gap-2">
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="input-field flex-1 !py-2.5"
              placeholder={`Message #${activeChannel}`}
            />
            <button onClick={handleSendMessage} className="btn-glow !px-4 !py-2.5 flex items-center justify-center">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── PAYMENTS TAB ─── */
function PaymentsTab() {
  const { isAdmin } = useAuth()
  const { payments, updatePaymentStatus } = useData()
  const [searchQuery, setSearchQuery] = useState('')

  const totalCollected = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = payments.filter((p) => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)

  const filteredPayments = payments.filter((p) =>
    p.player.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card bg-eco-surface border border-eco-border rounded-2xl p-6">
          <p className="text-xs text-eco-muted uppercase tracking-wider mb-2">Collected</p>
          <p className="font-display text-3xl text-white">${totalCollected.toLocaleString()}</p>
        </div>
        <div className="stat-card bg-eco-surface border border-eco-border rounded-2xl p-6">
          <p className="text-xs text-eco-muted uppercase tracking-wider mb-2">Pending</p>
          <p className="font-display text-3xl text-eco-blue-light">${totalPending.toLocaleString()}</p>
        </div>
        <div className="stat-card bg-eco-surface border border-eco-border rounded-2xl p-6">
          <p className="text-xs text-eco-muted uppercase tracking-wider mb-2">Overdue</p>
          <p className="font-display text-3xl text-red-400">${totalOverdue.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment List */}
      <div className="glow-card overflow-hidden">
        <div className="p-4 border-b border-eco-border flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-widest text-eco-blue flex items-center gap-2">
            <CreditCard size={14} />
            Payment Records
          </h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !py-1.5 !pl-9 !pr-3 text-xs w-48"
              placeholder="Search..."
            />
          </div>
        </div>
        <div className="divide-y divide-eco-border">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="flex items-center gap-4 px-4 py-3 hover:bg-eco-surface2/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-eco-surface2 border border-eco-border flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-eco-blue">{payment.player[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-heading font-bold text-white truncate">{payment.player}</p>
                <p className="text-xs text-eco-muted">{payment.description}</p>
              </div>
              <div className="text-right flex items-center gap-3">
                <p className="font-heading font-bold text-white">${payment.amount}</p>
                {isAdmin ? (
                  <select
                    value={payment.status}
                    onChange={(e) => updatePaymentStatus(payment.id, e.target.value as any)}
                    className="bg-eco-surface2 text-white border border-eco-border rounded-xl px-2 py-1 text-xs font-heading focus:outline-none focus:border-eco-blue cursor-pointer"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                ) : (
                  <span className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                    payment.status === 'paid'
                      ? 'bg-eco-blue/20 text-white'
                      : payment.status === 'pending'
                      ? 'bg-eco-blue-light/20 text-eco-blue-light'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {payment.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── AI COACH TAB ─── */
function AICoachTab() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: "What's good! I'm the EcoHoops AI Coach, powered by the same philosophy Coach Adrian built this movement on. Ask me about drills, game strategy, player development, or the science behind how we train. Let's work. 🏀",
    },
  ])
  const [apiKey, setApiKey] = useState(getStoredApiKey())
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [keyInputValue, setKeyInputValue] = useState(getStoredApiKey())
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault()
    setStoredApiKey(keyInputValue)
    setApiKey(keyInputValue)
    setShowKeyInput(false)
    setErrorMessage('')
  }

  const handleClearKey = () => {
    clearStoredApiKey()
    setApiKey('')
    setKeyInputValue('')
    setErrorMessage('')
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMessage = input.trim()
    const updatedMessages = [...messages, { role: 'user' as const, text: userMessage }]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)
    setErrorMessage('')

    if (apiKey) {
      // Live Mode
      try {
        const responseText = await askAICoach(updatedMessages, apiKey)
        setMessages((prev) => [...prev, { role: 'model', text: responseText }])
      } catch (err: any) {
        console.error(err)
        setErrorMessage(err.message || 'Something went wrong. Please check your API Key.')
        // Fallback simulated response on error to keep experience seamless
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'model',
              text: `[Error: Live call failed. Falling back to Demo response] ${getSimulatedResponse(userMessage)}`,
            },
          ])
        }, 1000)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Demo Mode
      setTimeout(() => {
        const responseText = getSimulatedResponse(userMessage)
        setMessages((prev) => [...prev, { role: 'model', text: responseText }])
        setIsLoading(false)
      }, 1200)
    }
  }

  // Scroll to bottom helper
  useEffect(() => {
    const chatContainer = document.getElementById('ai-coach-chat-container')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, [messages, isLoading, errorMessage])

  return (
    <div className="glow-card flex flex-col" style={{ minHeight: '600px' }}>
      {/* Header */}
      <div className="p-4 border-b border-eco-border flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eco-navy-bright to-eco-blue flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white">AI Coach</h3>
            <p className="text-xs text-white flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${apiKey ? 'bg-green-500 animate-pulse' : 'bg-eco-blue'}`} />
              {apiKey ? 'Powered by live Gemini 2.5' : 'Demo Mode (Simulated)'}
            </p>
          </div>
        </div>

        {/* API Key Controls */}
        <div className="flex items-center gap-2">
          {apiKey ? (
            <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-green-500/10 border border-green-500/30 text-green-400 font-bold">
              Live Mode Active
            </span>
          ) : (
            <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-eco-blue/10 border border-eco-blue/30 text-eco-blue font-bold">
              Demo Mode
            </span>
          )}

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-eco-surface border border-eco-border rounded-lg text-eco-muted hover:text-white transition-all"
          >
            <Key size={12} />
            {apiKey ? 'Manage Key' : 'Enter API Key'}
          </button>
        </div>
      </div>

      {/* API Key Entry Drawer */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-eco-surface2 border-b border-eco-border"
          >
            <div className="p-4">
              <form onSubmit={handleSaveKey} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">
                      Gemini API Key (Google AI Studio)
                    </label>
                    <input
                      type="password"
                      value={keyInputValue}
                      onChange={(e) => setKeyInputValue(e.target.value)}
                      placeholder="AIzaSy..."
                      className="input-field !py-2 !px-3 text-xs font-mono"
                      required
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none px-4 py-2 bg-eco-blue text-eco-black rounded-xl text-xs font-heading font-bold uppercase tracking-wider hover:bg-eco-blue/80 transition-all shadow-glow-sm"
                    >
                      Save Key
                    </button>
                    {apiKey && (
                      <button
                        type="button"
                        onClick={handleClearKey}
                        className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-heading font-semibold hover:bg-red-500/20 transition-all"
                      >
                        Clear Key
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-eco-muted leading-relaxed">
                  Your key is stored safely in your local browser storage and is only used to make direct client-side requests to Google's official Gemini API. You can get a free key from the{' '}
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-eco-blue underline font-bold"
                  >
                    Google AI Studio
                  </a>.
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Feed */}
      <div
        id="ai-coach-chat-container"
        className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[500px] scrollbar-thin"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'model'
                ? 'bg-eco-blue/20 text-eco-blue'
                : 'bg-eco-navy-bright/20 text-eco-blue'
            }`}>
              {msg.role === 'model' ? <Bot size={14} /> : <span className="text-xs font-bold">U</span>}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 whitespace-pre-line ${
              msg.role === 'model'
                ? 'bg-eco-surface2 border border-eco-border'
                : 'bg-eco-blue/10 border border-eco-blue/20'
            }`}>
              <p className="text-sm text-eco-muted-light leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-eco-blue/20 text-eco-blue flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot size={14} />
            </div>
            <div className="bg-eco-surface2 border border-eco-border rounded-2xl px-5 py-3 flex items-center gap-2">
              <Loader2 className="animate-spin text-eco-blue" size={14} />
              <span className="text-xs text-eco-muted font-heading font-medium">
                {apiKey ? 'Calling Gemini...' : 'Formulating simulated coaching drills...'}
              </span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="flex gap-3 justify-center">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl px-5 py-3 flex items-center gap-2 max-w-[80%] text-xs">
              <AlertTriangle size={14} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Inputs */}
      <div className="p-4 border-t border-eco-border bg-eco-surface/50">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="input-field flex-1 !py-2.5 disabled:opacity-50"
            placeholder={isLoading ? 'Coach is thinking...' : 'Ask the AI Coach anything...'}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="btn-glow !px-4 !py-2.5 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {[
            'Give me a CLA shooting drill',
            'Explain Constraints-Led Approach',
            'How to fight athlete burnout',
            'Strategy for full-court defense',
          ].map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              disabled={isLoading}
              className="text-[11px] px-3.5 py-1.5 rounded-full bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-blue/30 transition-all whitespace-nowrap disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── ANALYTICS TAB ─── */
function AnalyticsTab() {
  const { teams, uploadScoresheet } = useData()
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '')
  const [csvText, setCsvText] = useState('')
  const [gameOutcome, setGameOutcome] = useState<'W' | 'L' | undefined>(undefined)
  const [gameScore, setGameScore] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [processingLog, setProcessingLog] = useState<{ file: string; status: string; time: string }[]>([
    { file: '2011_vs_Raptors_BoxScore.csv', status: 'Processed', time: '2 hours ago' },
    { file: 'Quarterly_Development_Metrics.xlsx', status: 'Processed', time: 'Yesterday' },
    { file: '2012_Tournament_Advanced.pdf', status: 'Format Error', time: '3 days ago' },
  ])

  useEffect(() => {
    const team = teams.find((t) => t.id === selectedTeamId)
    if (team && team.roster.length > 0) {
      const csvLines = [
        'Player Name,PTS,REB,AST,STL,FG%',
        ...team.roster.slice(0, 5).map((p) => `${p.name},18,6,7,2,55`),
      ].join('\n')
      setCsvText(csvLines)
    } else {
      setCsvText('Player Name,PTS,REB,AST,STL,FG%')
    }
  }, [selectedTeamId, teams])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setIsUploading(true)

      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const resultMsg = uploadScoresheet(selectedTeamId, text, gameOutcome, gameScore || undefined)

        setIsUploading(false)
        alert(resultMsg)

        const isSuccess = resultMsg.startsWith('Success')
        setProcessingLog((prev) => [
          { file: file.name, status: isSuccess ? 'Processed' : 'Format Error', time: 'Just now' },
          ...prev,
        ])
      }
      reader.readAsText(file)
    }
  }

  const handleProcessManualCSV = () => {
    if (!csvText.trim()) return
    setIsUploading(true)
    setTimeout(() => {
      const resultMsg = uploadScoresheet(selectedTeamId, csvText, gameOutcome, gameScore || undefined)
      setIsUploading(false)
      alert(resultMsg)

      const isSuccess = resultMsg.startsWith('Success')
      setProcessingLog((prev) => [
        { file: 'manual_entry.csv', status: isSuccess ? 'Processed' : 'Format Error', time: 'Just now' },
        ...prev,
      ])
    }, 800)
  }

  return (
    <div className="space-y-8">
      {/* Configuration Fields */}
      <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl">
        <h3 className="font-heading font-bold text-white mb-4">Scoresheet Processing Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="w-full">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">Target Team</label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="bg-eco-surface2 text-white border border-eco-border rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-eco-blue cursor-pointer"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.season})
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">Outcome</label>
            <select
              value={gameOutcome || ''}
              onChange={(e) => setGameOutcome(e.target.value ? (e.target.value as any) : undefined)}
              className="bg-eco-surface2 text-white border border-eco-border rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-eco-blue cursor-pointer"
            >
              <option value="">None (Stats only)</option>
              <option value="W">Win</option>
              <option value="L">Loss</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">Score Result</label>
            <input
              type="text"
              value={gameScore}
              onChange={(e) => setGameScore(e.target.value)}
              placeholder="e.g. 78-72"
              className="input-field !py-2.5"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="glow-card p-6 flex flex-col items-center justify-center text-center border-dashed border-2 border-eco-blue/30 group hover:border-eco-blue/60 transition-colors lg:col-span-1 bg-eco-surface border rounded-2xl">
          <UploadCloud size={40} className="text-eco-blue mb-4 group-hover:-translate-y-2 transition-transform duration-300" />
          <h4 className="font-heading font-bold text-white mb-2">Upload CSV File</h4>
          <p className="text-eco-muted text-xs mb-4">
            Upload a game stats file. Columns must contain "Player Name" and optionally PTS, REB, AST, STL, FG%.
          </p>

          <label className="btn-glow cursor-pointer inline-flex items-center gap-2 text-xs !px-4 !py-2">
            {isUploading ? 'Processing File...' : 'Select File'}
            <input type="file" className="hidden" accept=".csv" onChange={handleUpload} disabled={isUploading} />
          </label>
        </div>

        {/* Manual Data Editor */}
        <div className="glow-card p-6 flex flex-col lg:col-span-2 bg-eco-surface border border-eco-border rounded-2xl">
          <h4 className="font-heading font-bold text-white mb-1">Live CSV Data Editor</h4>
          <p className="text-eco-muted text-xs mb-3">
            Modify values below to simulate a game performance. Applies a 90/10 moving average to player records.
          </p>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full h-32 bg-eco-surface2 text-white border border-eco-border rounded-xl p-3 text-xs font-mono mb-4 focus:outline-none focus:border-eco-blue scrollbar-thin"
          />
          <button
            onClick={handleProcessManualCSV}
            disabled={isUploading || !csvText.trim()}
            className="btn-glow text-xs !px-4 !py-2 self-end"
          >
            {isUploading ? 'Applying Changes...' : 'Apply Box Score'}
          </button>
        </div>
      </div>

      {/* Analytics Dashboard Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl">
          <h3 className="text-xs font-mono uppercase tracking-widest text-eco-muted mb-6 flex items-center gap-2">
            <TrendingUp size={14} /> Team Performance Vectors
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-white mb-1">
                <label>Offensive Rating (Points per 100 pos)</label> <span>114.2</span>
              </div>
              <div className="w-full h-2 rounded-full bg-eco-surface2 overflow-hidden">
                <div className="w-[85%] h-full bg-eco-blue rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white mb-1">
                <label>Defensive Rating (Points allowed per 100 pos)</label> <span>98.6</span>
              </div>
              <div className="w-full h-2 rounded-full bg-eco-surface2 overflow-hidden">
                <div className="w-[92%] h-full bg-eco-blue rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white mb-1">
                <label>Effective Field Goal % (eFG%)</label> <span>53.4%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-eco-surface2 overflow-hidden">
                <div className="w-[60%] h-full bg-eco-muted-light rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl">
          <h3 className="text-xs font-mono uppercase tracking-widest text-eco-muted mb-6 flex items-center gap-2">
            <FileText size={14} /> Recent Processing Logs
          </h3>
          <div className="space-y-3">
            {processingLog.map((log, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-eco-surface2 border border-eco-border text-sm">
                <span className="text-white font-medium truncate">{log.file}</span>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${log.status === 'Processed' ? 'text-eco-blue' : 'text-red-500'}`}>
                    {log.status}
                  </span>
                  <span className="text-[10px] text-eco-muted">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
