import React, { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  CheckCircle2,
  Smile,
  User,
  Mail,
  Phone,
  Users,
  HeartHandshake,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const BENEFITS = [
  'Play-based learning with low player-to-coach ratios',
  'Skill growth with maximum ball touches & active movement',
  'A supportive, encouraging environment where kids gain confidence',
  'No yelling, fear, or pressure to be “elite”',
]

interface FormState {
  parentName: string
  email: string
  phone: string
  ageGroup: 'Ages 5–6' | 'Ages 7–9' | 'Both'
  programInterest: 'Jr. NBA' | 'Jr. WNBA' | 'Not Sure Yet'
  childCount: string
  consent: boolean
}

const INITIAL_FORM_STATE: FormState = {
  parentName: '',
  email: '',
  phone: '',
  ageGroup: 'Ages 5–6',
  programInterest: 'Not Sure Yet',
  childCount: '1',
  consent: false,
}

// Isolated form component to ensure sub-10ms INP response
const WaitlistForm = memo(function WaitlistForm() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
      if (fieldErrors[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: '' }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (fieldErrors[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: '' }))
      }
    }
  }

  const validate = () => {
    const errors: { [key: string]: string } = {}

    if (!formData.parentName.trim()) {
      errors.parentName = 'Please enter your parent or guardian name.'
    }

    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }

    if (!formData.ageGroup) {
      errors.ageGroup = 'Please select an age group.'
    }

    if (!formData.consent) {
      errors.consent = 'Please agree to receive updates to join the waitlist.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setStatus('submitting')
    setErrorMessage('')

    const payload = {
      access_key: '933bf5e4-2815-45e1-853f-a58c9fb77a2f',
      subject: `New EcoHoops Jr. NBA/Jr. WNBA Waitlist Registration - ${formData.parentName.trim()}`,
      from_name: 'EcoHoops Jr. Waitlist',
      to: 'ecohoopscoaching@gmail.com',
      replyto: formData.email.trim(),
      'Parent / Guardian Name': formData.parentName.trim(),
      'Email Address': formData.email.trim(),
      'Phone Number': formData.phone.trim() || 'Not provided',
      'Child Age Group': formData.ageGroup,
      'Program Interest': formData.programInterest,
      'Number of Children Interested': formData.childCount || '1',
      'Consent to Updates': formData.consent ? 'Yes' : 'No',
      'Submission Time': new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }),
    }

    try {
      // 1. Store locally for backup
      const existingWaitlist = JSON.parse(
        localStorage.getItem('ecohoops_jr_waitlist') || '[]'
      )
      existingWaitlist.push(payload)
      localStorage.setItem(
        'ecohoops_jr_waitlist',
        JSON.stringify(existingWaitlist)
      )

      // 2. Deliver via Web3Forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        setStatus('success')
        setFormData(INITIAL_FORM_STATE)
      } else {
        setStatus('error')
        setErrorMessage(
          "We couldn’t add you to the waitlist. Please try again or contact EcoHoops directly."
        )
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        "We couldn’t add you to the waitlist. Please try again or contact EcoHoops directly."
      )
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-2 space-y-5"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <CheckCircle2 size={36} />
        </div>
        <h4 className="font-display text-2xl text-white uppercase tracking-tight">
          You're On The List!
        </h4>
        <p className="text-eco-muted-light text-sm sm:text-base leading-relaxed">
          You’re on the list! We’ll let you know as soon as EcoHoops Jr. program dates and registration details are available for {formData.ageGroup || 'your player'}.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn-ghost !py-2.5 !px-6 text-xs uppercase tracking-wider font-heading font-bold cursor-pointer"
        >
          Add Another Child / Sibling
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* ERROR ALERT */}
      {status === 'error' && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3"
        >
          <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">Submission failed</p>
            <p className="mt-0.5">
              {errorMessage ||
                "We couldn’t add you to the waitlist. Please try again or contact EcoHoops directly."}
            </p>
          </div>
        </div>
      )}

      {/* Parent / Guardian Name */}
      <div>
        <label
          htmlFor="parentName"
          className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5 font-medium"
        >
          Parent or Guardian Name <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <User
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-muted pointer-events-none"
          />
          <input
            id="parentName"
            name="parentName"
            type="text"
            required
            value={formData.parentName}
            onChange={handleInputChange}
            placeholder="e.g. Sarah Jenkins"
            aria-invalid={!!fieldErrors.parentName}
            aria-describedby={fieldErrors.parentName ? 'parentName-error' : undefined}
            className={`w-full bg-[#060A10]/80 border rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-eco-muted/60 ${
              fieldErrors.parentName
                ? 'border-red-500/80 focus:ring-red-500/30'
                : 'border-eco-border focus:border-eco-blue focus:ring-eco-blue/20'
            }`}
          />
        </div>
        {fieldErrors.parentName && (
          <p id="parentName-error" className="text-xs text-red-400 mt-1 flex items-center gap-1 font-heading">
            <AlertCircle size={12} /> {fieldErrors.parentName}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5 font-medium"
        >
          Email Address <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-muted pointer-events-none"
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="parent@example.com"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className={`w-full bg-[#060A10]/80 border rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-eco-muted/60 ${
              fieldErrors.email
                ? 'border-red-500/80 focus:ring-red-500/30'
                : 'border-eco-border focus:border-eco-blue focus:ring-eco-blue/20'
            }`}
          />
        </div>
        {fieldErrors.email && (
          <p id="email-error" className="text-xs text-red-400 mt-1 flex items-center gap-1 font-heading">
            <AlertCircle size={12} /> {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phone"
          className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5 font-medium flex items-center justify-between"
        >
          <span>Phone Number</span>
          <span className="text-[10px] text-eco-muted uppercase">Optional</span>
        </label>
        <div className="relative">
          <Phone
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-muted pointer-events-none"
          />
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(416) 555-0199"
            className="w-full bg-[#060A10]/80 border border-eco-border rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-eco-blue focus:ring-2 focus:ring-eco-blue/20 transition-all placeholder:text-eco-muted/60"
          />
        </div>
      </div>

      {/* Child's Age Group & Number of Children */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Child's Age Group (Ultra low INP radio group) */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5 font-medium flex items-center justify-between">
            <span>Age Group <span className="text-red-400">*</span></span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['Ages 5–6', 'Ages 7–9'] as const).map((group) => {
              const isSelected = formData.ageGroup === group
              return (
                <label
                  key={group}
                  className={`py-2.5 px-2 rounded-xl font-heading text-xs uppercase font-bold transition-colors duration-150 border cursor-pointer text-center flex items-center justify-center select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#003366] to-eco-blue text-white border-eco-blue shadow-glow-sm'
                      : 'bg-[#060A10]/80 border-eco-border text-eco-muted-light hover:border-eco-blue/40 hover:text-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="ageGroup"
                    value={group}
                    checked={isSelected}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span>{group}</span>
                </label>
              )
            })}
          </div>
          {fieldErrors.ageGroup && (
            <p id="ageGroup-error" className="text-xs text-red-400 mt-1 flex items-center gap-1 font-heading">
              <AlertCircle size={12} /> {fieldErrors.ageGroup}
            </p>
          )}
        </div>

        {/* Number of Children Interested */}
        <div>
          <label
            htmlFor="childCount"
            className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5 font-medium flex items-center justify-between"
          >
            <span>Number of Kids</span>
            <span className="text-[10px] text-eco-muted uppercase">Optional</span>
          </label>
          <div className="relative">
            <Users
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-muted pointer-events-none"
            />
            <select
              id="childCount"
              name="childCount"
              value={formData.childCount}
              onChange={handleInputChange}
              className="w-full bg-[#060A10]/80 border border-eco-border rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-eco-blue focus:ring-2 focus:ring-eco-blue/20 transition-all cursor-pointer"
            >
              <option value="1" className="bg-eco-surface text-white">1 Child</option>
              <option value="2" className="bg-eco-surface text-white">2 Children</option>
              <option value="3" className="bg-eco-surface text-white">3 Children</option>
              <option value="4+" className="bg-eco-surface text-white">4+ Children</option>
            </select>
          </div>
        </div>
      </div>

      {/* Program Interest */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-2 font-medium">
          Program Interest
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['Jr. NBA', 'Jr. WNBA', 'Not Sure Yet'] as const).map((option) => {
            const isSelected = formData.programInterest === option
            return (
              <label
                key={option}
                className={`flex items-center justify-center px-3 py-2.5 rounded-xl border text-xs font-heading font-bold cursor-pointer transition-colors duration-150 text-center select-none ${
                  isSelected
                    ? 'bg-[#003366] border-[#97B3D2] text-white shadow-glow-sm'
                    : 'bg-[#060A10]/60 border-eco-border text-eco-muted-light hover:border-eco-blue/40'
                }`}
              >
                <input
                  type="radio"
                  name="programInterest"
                  value={option}
                  checked={isSelected}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span>{option}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Consent Checkbox */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            checked={formData.consent}
            onChange={handleInputChange}
            aria-invalid={!!fieldErrors.consent}
            aria-describedby={fieldErrors.consent ? 'consent-error' : undefined}
            className="mt-1 w-4 h-4 rounded border-eco-border bg-[#060A10] accent-[#97B3D2] cursor-pointer flex-shrink-0"
          />
          <span className="text-xs text-eco-muted-light leading-relaxed">
            I agree to receive EcoHoops Jr. program and registration updates.{' '}
            <Link
              to="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#97B3D2] hover:text-white underline font-semibold transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {fieldErrors.consent && (
          <p id="consent-error" className="text-xs text-red-400 mt-1 flex items-center gap-1 font-heading">
            <AlertCircle size={12} /> {fieldErrors.consent}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`w-full btn-glow !py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-4 shadow-glow-md transition-all ${
          status === 'submitting'
            ? 'opacity-70 cursor-not-allowed'
            : 'hover:scale-[1.01]'
        }`}
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="animate-spin text-eco-blue" size={18} />
            <span>Adding to Waitlist...</span>
          </>
        ) : (
          <>
            <span>Keep Me Updated</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <p className="text-[11px] text-eco-muted text-center pt-1 font-mono">
        Program dates & details are TBD. You'll be notified first.
      </p>
    </form>
  )
})

export default function JrNbaAnnouncement() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section
      id="jr-nba-waitlist"
      ref={ref}
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-eco-black via-[#08101E] to-eco-black border-t border-b border-eco-border"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#003366]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-eco-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: ANNOUNCEMENT COPY & BENEFITS */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#003366]/50 border border-[#97B3D2]/30 text-[#97B3D2] text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-[#97B3D2]" />
                NEW FROM ECOHOOPS JR.
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-eco-blue/15 border border-eco-blue/35 text-eco-blue-light text-xs font-mono font-bold uppercase tracking-wider">
                Ages 5–6 & Ages 7–9
              </div>
            </div>

            {/* Headline */}
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-[1.08]">
              Jr. NBA/Jr. WNBA Is Coming to{' '}
              <span className="gradient-text">EcoHoops Jr.</span>
            </h2>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white font-heading font-semibold leading-snug">
              A fun, welcoming place for kids to play, learn, and grow (Ages 5–6 & Ages 7–9).
            </p>

            {/* Body */}
            <div className="space-y-4 text-eco-muted-light text-base md:text-lg leading-relaxed font-body">
              <p>
                EcoHoops Jr. is excited to bring Jr. NBA/Jr. WNBA programming to our community, offered specifically for two age divisions: <strong className="text-white font-semibold">Ages 5–6</strong> and <strong className="text-white font-semibold">Ages 7–9</strong>.
              </p>
              <p>
                Young players will have the opportunity to learn the game, make friends, build confidence, and develop teamwork in a positive environment that puts kids first.
              </p>
              <p className="text-white font-medium">
                Program dates and details are still being finalized. Join the parent waitlist and be the first to know when registration opens.
              </p>
            </div>

            {/* Benefits List */}
            <div className="pt-4 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#97B3D2] font-semibold">
                Why Families Love EcoHoops Jr.
              </h3>
              <ul className="space-y-2.5">
                {BENEFITS.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-white text-sm md:text-base font-heading font-medium"
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Authentic photo card */}
            <div className="pt-4">
              <div className="relative rounded-2xl overflow-hidden border border-eco-border/60 shadow-xl group">
                <img
                  src="/images/13.png"
                  alt="Young children smiling and having fun playing basketball together in EcoHoops Jr."
                  loading="lazy"
                  decoding="async"
                  className="w-full h-56 sm:h-64 object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-eco-black/85 via-eco-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-heading font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Smile size={16} className="text-eco-blue" />
                    Joyful, pressure-free youth basketball
                  </span>
                  <span className="text-[11px] font-mono text-eco-muted uppercase tracking-wider">
                    EcoHoops Jr.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: WAITLIST FORM CARD */}
          <div className="lg:col-span-5">
            <div className="glow-card p-6 sm:p-8 bg-[#0F1628]/90 border border-eco-blue/20 backdrop-blur-xl rounded-3xl shadow-2xl relative">
              
              {/* Card top accent */}
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#97B3D2] font-semibold block mb-1">
                    Priority Notification
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl text-white uppercase font-bold">
                    Join the Parent Waitlist
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#003366] border border-eco-blue/30 flex items-center justify-center text-eco-blue flex-shrink-0">
                  <HeartHandshake size={20} />
                </div>
              </div>

              {/* ISOLATED FORM */}
              <WaitlistForm />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
