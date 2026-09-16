import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, AlertTriangle, Send, Shield, Users, Bell } from 'lucide-react'
import type { Team } from '../../types'
import { dispatchTeamNotification } from '../../lib/email-service'

interface EmergencyBroadcastModalProps {
  isOpen: boolean
  onClose: () => void
  teams: Team[]
  onSuccess?: (message: string) => void
}

const TEMPLATES = [
  {
    label: '❄️ Severe Winter Storm / Travel Advisory',
    subject: 'URGENT: All Basketball Activities Cancelled Today Due to Weather',
    message: 'Due to severe storm conditions and treacherous road conditions across Mississauga, all EcoHoops sessions scheduled for today have been cancelled to ensure the safety of our players and families. Please stay safe at home. We will communicate makeup details as soon as conditions clear.'
  },
  {
    label: '🏫 School Facility / Permit Revocation',
    subject: 'URGENT: School Gym Closed Today by Facility Board',
    message: 'The school board has issued an emergency facility closure for our gym tonight, and all community permits are cancelled. Tonight’s session cannot take place. We apologize for the inconvenience and will update you on alternate gym times.'
  },
  {
    label: '⏱️ Last-Minute Schedule Shift / Delay',
    subject: 'NOTICE: Today’s Session Time Delayed by 30 Minutes',
    message: 'Please note an urgent timing adjustment for today’s session. Warm-ups will begin 30 minutes later than originally scheduled due to prior permit runover. Please check the Team Portal for updated arrival times.'
  }
]

export default function EmergencyBroadcastModal({
  isOpen,
  onClose,
  teams,
  onSuccess
}: EmergencyBroadcastModalProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all')
  const [subject, setSubject] = useState(TEMPLATES[0].subject)
  const [message, setMessage] = useState(TEMPLATES[0].message)
  const [isSending, setIsSending] = useState(false)

  if (!isOpen) return null

  const targetTeams = selectedTeamId === 'all' 
    ? teams 
    : teams.filter((t) => t.id === selectedTeamId)

  const totalParents = targetTeams.reduce((acc, curr) => {
    return acc + (curr.parentContacts?.length || 12)
  }, 0)

  const applyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setSubject(tmpl.subject)
    setMessage(tmpl.message)
  }

  const handleBroadcast = async () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please fill out both the subject and message.')
      return
    }

    setIsSending(true)
    let dispatchedCount = 0

    try {
      for (const team of targetTeams) {
        await dispatchTeamNotification({
          team,
          eventType: 'weather_cancellation',
          customSubject: `[${team.name}] ${subject.trim()}`,
          cancellationReason: message.trim(),
        })
        dispatchedCount += (team.parentContacts?.length || 12)
      }

      setIsSending(false)
      onClose()
      if (onSuccess) {
        onSuccess(`✓ Emergency alert broadcast to ${dispatchedCount} parents across ${targetTeams.length} squad(s)!`)
      }
    } catch (err) {
      console.error('Broadcast error:', err)
      setIsSending(false)
      alert('An error occurred while dispatching the broadcast. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-eco-black/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="glow-card w-full max-w-xl bg-[#0F1626] border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
      >
        <button
          onClick={onClose}
          disabled={isSending}
          className="absolute top-5 right-5 text-eco-muted hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-500/20">
          <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                Emergency Parent Broadcast
              </span>
              <span className="text-[10px] font-mono text-white bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded">
                High Priority
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-white uppercase font-bold">
              Weather / Facility Alert
            </h3>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1.5 font-medium">
              Target Audience
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full bg-[#060A10] border border-eco-border rounded-xl px-4 py-2.5 text-white text-xs font-heading font-semibold focus:outline-none focus:border-red-400 cursor-pointer"
            >
              <option value="all">🚨 All Teams & Divisions ({totalParents} Parents)</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.season} &middot; {t.parentContacts?.length || 12} parents)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1.5 font-medium">
              Quick Templates
            </label>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((tmpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyTemplate(tmpl)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#060A10] border border-white/10 hover:border-red-400/40 text-[11px] text-eco-muted-light hover:text-white transition-colors cursor-pointer text-left"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1.5 font-medium">
              Broadcast Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#060A10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-red-400 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1.5 font-medium">
              Alert Message for Families
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-[#060A10] border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-red-400 leading-relaxed"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-[11px] text-eco-muted font-mono">
            Will email <strong className="text-white">{totalParents} parents</strong> immediately.
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 rounded-xl border border-eco-border text-eco-muted text-xs font-heading font-semibold hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBroadcast}
              disabled={isSending}
              className="btn-glow !bg-gradient-to-r !from-red-600 !to-red-500 !text-white text-xs uppercase font-bold !py-2 !px-5 flex items-center gap-2 cursor-pointer shadow-glow-sm"
            >
              {isSending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Broadcasting...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Broadcast Alert</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
