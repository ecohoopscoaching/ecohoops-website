import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Mail, Bell, AlertTriangle, CheckCircle2, Clock, 
  MapPin, Send, Eye, Shield, Users, Sparkles
} from 'lucide-react'
import type { ScheduleEvent, Team } from '../../types'
import { 
  dispatchTeamNotification, 
  generateEmailHtml, 
  DispatchNotificationParams 
} from '../../lib/email-service'

interface EventNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  event: ScheduleEvent
  team: Team
  initialType?: 'pre_game_reminder' | 'weather_cancellation' | 'rsvp_nudge' | 'event_updated'
  onSuccess?: (message: string) => void
}

export default function EventNotificationModal({
  isOpen,
  onClose,
  event,
  team,
  initialType = 'pre_game_reminder',
  onSuccess
}: EventNotificationModalProps) {
  const [alertType, setAlertType] = useState<'pre_game_reminder' | 'weather_cancellation' | 'rsvp_nudge' | 'event_updated'>(initialType)
  const [customSubject, setCustomSubject] = useState('')
  const [customNote, setCustomNote] = useState('')
  const [cancellationReason, setCancellationReason] = useState('Inclement weather and facility permit closure. Player safety is our priority.')
  const [showPreview, setShowPreview] = useState(false)
  const [isSending, setIsSending] = useState(false)

  if (!isOpen) return null

  const parentContacts = team.parentContacts || []
  const recipientCount = parentContacts.length > 0 ? parentContacts.length : 12

  const previewParams: DispatchNotificationParams = {
    team,
    event,
    eventType: alertType,
    customSubject: customSubject.trim() || undefined,
    customMessage: customNote.trim() || undefined,
    cancellationReason: alertType === 'weather_cancellation' ? cancellationReason : undefined,
  }

  const { subject: generatedSubject, body: generatedHtml } = generateEmailHtml(previewParams)

  const handleSend = async () => {
    setIsSending(true)
    try {
      const result = await dispatchTeamNotification(previewParams)
      setIsSending(false)
      onClose()
      if (onSuccess) {
        onSuccess(`✓ Dispatched alert to ${result.notification.recipientCount} parents on ${team.name}!`)
      }
    } catch (err) {
      console.error('Failed to dispatch alert:', err)
      setIsSending(false)
      alert('Error sending notification. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-eco-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="glow-card w-full max-w-2xl bg-[#0C1424] border border-eco-blue/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isSending}
          className="absolute top-5 right-5 text-eco-muted hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            alertType === 'weather_cancellation'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : alertType === 'rsvp_nudge'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-eco-blue/20 text-eco-blue border border-eco-blue/30'
          }`}>
            {alertType === 'weather_cancellation' ? (
              <AlertTriangle size={20} />
            ) : alertType === 'rsvp_nudge' ? (
              <Users size={20} />
            ) : (
              <Bell size={20} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#97B3D2] font-semibold">
                Parent Notification Engine
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {recipientCount} Recipients Ready
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-white uppercase font-bold">
              Dispatch Schedule Alert
            </h3>
          </div>
        </div>

        {/* Event Quick Snapshot Banner */}
        <div className="p-3.5 rounded-2xl bg-[#050B14] border border-white/10 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-heading font-bold text-white text-sm">
              {event.title}
            </div>
            <div className="text-eco-muted-light mt-0.5 flex items-center gap-3 font-mono text-[11px]">
              <span>📅 {event.date}</span>
              <span>⏱️ {event.time}</span>
              <span>📍 {event.location}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#003366] text-eco-blue-light border border-eco-blue/30 font-bold">
              {team.name}
            </span>
            {event.uniformColor && (
              <div className="text-[10px] text-emerald-400 font-mono mt-1">
                👕 {event.uniformColor}
              </div>
            )}
          </div>
        </div>

        {/* Alert Type Selector */}
        <div className="space-y-4 mb-6">
          <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted font-medium">
            Select Notification Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'pre_game_reminder' as const,
                title: 'Game Day Prep',
                desc: 'Uniform, arrival, directions & checklist',
                color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
              },
              {
                id: 'weather_cancellation' as const,
                title: 'Urgent Cancellation',
                desc: 'Weather, snow day, or permit closure',
                color: 'border-red-500/40 bg-red-500/10 text-red-400'
              },
              {
                id: 'rsvp_nudge' as const,
                title: 'RSVP Attendance Nudge',
                desc: 'Remind parents to confirm availability',
                color: 'border-amber-500/40 bg-amber-500/10 text-amber-400'
              }
            ].map((opt) => {
              const isSelected = alertType === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAlertType(opt.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? `${opt.color} shadow-glow-sm font-bold`
                      : 'bg-[#060A10]/60 border-white/10 text-eco-muted-light hover:border-white/20'
                  }`}
                >
                  <div className="font-heading text-xs uppercase font-bold text-white mb-1">
                    {opt.title}
                  </div>
                  <div className="text-[10px] text-eco-muted leading-tight">
                    {opt.desc}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Inputs based on alert type */}
        <div className="space-y-4 mb-6">
          {alertType === 'weather_cancellation' && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-red-300 mb-1.5 font-medium flex items-center justify-between">
                <span>Reason for Cancellation</span>
                <span className="text-[10px] text-red-400 font-bold uppercase">High Urgency</span>
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={2}
                placeholder="e.g. Due to severe winter storm warnings, all community gym permits have been revoked."
                className="w-full bg-[#060A10] border border-red-500/40 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-red-400 leading-relaxed placeholder:text-eco-muted"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5 font-medium flex items-center justify-between">
              <span>Coach's Custom Note</span>
              <span className="text-[10px] text-eco-muted uppercase">Optional</span>
            </label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              rows={2}
              placeholder={
                alertType === 'pre_game_reminder'
                  ? "e.g. Please make sure players bring both jerseys and arrive early for defensive rotations."
                  : alertType === 'rsvp_nudge'
                  ? "e.g. We need a final headcount by 5 PM today to submit our tournament roster."
                  : "Additional instructions for players and families..."
              }
              className="w-full bg-[#060A10] border border-eco-border rounded-xl p-3 text-white text-xs focus:outline-none focus:border-eco-blue leading-relaxed placeholder:text-eco-muted"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1 font-medium flex items-center justify-between">
              <span>Email Subject Preview</span>
              <span className="text-[10px] text-eco-muted">Auto-generated</span>
            </label>
            <input
              type="text"
              value={customSubject || generatedSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full bg-[#060A10] border border-white/10 rounded-xl px-3 py-2 text-eco-muted-light text-xs focus:outline-none focus:border-eco-blue"
            />
          </div>
        </div>

        {/* Live Email Preview Drawer */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 text-xs font-heading font-semibold text-[#97B3D2] hover:text-white transition-colors cursor-pointer"
          >
            <Eye size={14} />
            <span>{showPreview ? 'Hide HTML Preview' : 'Show Live Parent Email Preview'}</span>
          </button>

          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-4 rounded-2xl bg-[#060A10] border border-white/10 max-h-56 overflow-y-auto"
              >
                <div className="text-[10px] font-mono text-eco-muted uppercase mb-2">Subject: {generatedSubject}</div>
                <div 
                  className="prose prose-invert max-w-none text-xs"
                  dangerouslySetInnerHTML={{ __html: generatedHtml }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2.5 rounded-xl border border-eco-border text-eco-muted-light hover:text-white text-xs font-heading font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className={`btn-glow text-xs uppercase tracking-wider font-bold !py-2.5 !px-6 flex items-center gap-2 ${
              alertType === 'weather_cancellation'
                ? '!bg-gradient-to-r !from-red-600 !to-red-500 !text-white'
                : ''
            }`}
          >
            {isSending ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Dispatching to {recipientCount} Parents...</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>Dispatch Alert ({recipientCount} Parents)</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
