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
  ArrowRight,
  Loader2,
  AlertCircle,
  MapPin,
  CalendarDays,
  Clock,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  Bell,
} from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { getTrackingParams, saveWaitlistEntry, WaitlistEntry } from '../../data/waitlist'
import { dispatchWaitlistConfirmationEmail } from '../../lib/email-service'

declare const fbq: any

export const JR_NBA_REGISTER_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSclCKn0JE0P2NB3Ts0YvxR4gZXmKNei2TMldZCueSZ4PsmS2A/viewform'

interface UpdatesFormState {
  parentName: string
  email: string
  phone: string
  gradeGroup: 'Grades 1-2' | 'Grades 3-4' | 'Grades 5-6'
  groupPreference: 'Girls group' | 'Boys group' | ''
  neighbourhood: string
  childCount: string
  consent: boolean
}

const INITIAL_FORM_STATE: UpdatesFormState = {
  parentName: '',
  email: '',
  phone: '',
  gradeGroup: 'Grades 1-2',
  groupPreference: '',
  neighbourhood: '',
  childCount: '1',
  consent: false,
}

// Isolated email updates form component to ensure fast INP response
const UpdatesSignupForm = memo(function UpdatesSignupForm() {
  const [formData, setFormData] = useState<UpdatesFormState>(INITIAL_FORM_STATE)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [submittedEntry, setSubmittedEntry] = useState<WaitlistEntry | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

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
    } else if (type === 'radio') {
      React.startTransition(() => {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          ...(name === 'gradeGroup' && value === 'Grades 1-2' ? { groupPreference: '' } : {}),
        }))
        if (fieldErrors[name]) {
          setFieldErrors((prev) => ({ ...prev, [name]: '' }))
        }
      })
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

    if (formData.phone.trim()) {
      const digits = formData.phone.replace(/\D/g, '')
      if (digits.length < 10) {
        errors.phone = 'Please enter a valid 10-digit phone number or leave blank.'
      }
    }

    if (!formData.gradeGroup) {
      errors.gradeGroup = 'Please select a grade group.'
    }

    if (formData.gradeGroup !== 'Grades 1-2' && !formData.groupPreference) {
      errors.groupPreference = 'Please select the girls group or the boys group.'
    }

    if (!formData.consent) {
      errors.consent = 'Please agree to receive program updates.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const trackingParams = getTrackingParams()
    const isTest = Boolean(
      formData.parentName.trim().toLowerCase() === 'dre' ||
        formData.parentName.trim().toLowerCase().includes('test') ||
        formData.email.toLowerCase().includes('test@') ||
        formData.parentName.trim().toLowerCase() === 'adrian test'
    )

    const resolvedGroupPref =
      formData.gradeGroup === 'Grades 1-2'
        ? 'Co-ed'
        : formData.groupPreference || 'Not provided'

    const newEntry: WaitlistEntry = {
      id: `entry-${Date.now()}`,
      parentName: formData.parentName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || 'Not provided',
      ageGroup: formData.gradeGroup,
      groupPreference: resolvedGroupPref as WaitlistEntry['groupPreference'],
      daysAvailable: 'Saturdays',
      neighbourhood: formData.neighbourhood.trim() || 'Not provided',
      childCount: (formData.childCount || '1') as WaitlistEntry['childCount'],
      consent: formData.consent,
      submissionTime: new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }),
      source: trackingParams.utm_source ? `Meta / ${trackingParams.utm_source}` : 'Website direct',
      utmParams: trackingParams,
      isTest,
    }

    // 1. Store in localStorage so no lead is lost
    saveWaitlistEntry(newEntry)
    setSubmittedEntry(newEntry)

    // 2. Switch immediately to confirmation state
    setStatus('success')
    setFormData(INITIAL_FORM_STATE)

    // Fire Meta Pixel Lead event
    try {
      if (typeof fbq === 'function') {
        fbq('track', 'Lead')
      } else if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead')
      }
    } catch {
      // Ignore tracking errors if blocked by privacy extensions
    }

    // Fire Google Ads conversion event
    try {
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'conversion', {
          send_to: 'AW-18484354648/cSy9CKDYhIwdENi8g-5E',
        })
      }
    } catch {
      // Ignore tracking errors if blocked by privacy extensions
    }

    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 40)

    // 3. Trigger automated confirmation email to the parent
    dispatchWaitlistConfirmationEmail({
      parentName: newEntry.parentName,
      email: newEntry.email,
      phone: newEntry.phone,
      ageGroup: newEntry.ageGroup,
      groupPreference: newEntry.groupPreference,
      daysAvailable: newEntry.daysAvailable,
      neighbourhood: newEntry.neighbourhood,
      childCount: newEntry.childCount,
    }).catch((err) => {
      console.warn('Updates confirmation email dispatch error:', err)
    })

    // 4. Redundant Web3Forms dispatch for Coach Adrian's inbox
    const web3Payload = {
      access_key: '933bf5e4-2815-45e1-853f-a58c9fb77a2f',
      subject: `EcoHoops Jr. Program Updates - ${newEntry.parentName} (${newEntry.ageGroup})`,
      from_name: 'EcoHoops Jr. Program Updates',
      to: 'ecohoopscoaching@gmail.com',
      replyto: newEntry.email,
      email: newEntry.email,
      'Parent / Guardian Name': newEntry.parentName,
      'Email Address': newEntry.email,
      'Phone Number': newEntry.phone,
      'Child Grade Group': newEntry.ageGroup,
      'Group Preference': newEntry.groupPreference,
      'Neighbourhood / Postal Area': newEntry.neighbourhood,
      'Number of Children': newEntry.childCount,
      'Consent to Updates': newEntry.consent ? 'Yes' : 'No',
      'Submission Time': newEntry.submissionTime,
      'Campaign Source': trackingParams.utm_source || 'Direct / organic',
      'Test Status': isTest ? 'TEST' : 'REAL LEAD',
    }

    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 4000)
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(web3Payload),
        signal: controller.signal,
      })
      clearTimeout(timer)
    } catch {
      // Data is already stored locally and queued for email dispatch
    }
  }

  if (status === 'success') {
    return (
      <div ref={containerRef} className="py-2 space-y-5">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="text-center space-y-3"
        >
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#003366] via-[#0A1830] to-[#001C40] border-2 border-eco-blue/50 flex items-center justify-center shadow-[0_0_25px_rgba(0,102,204,0.35)]">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              Updates Signup Confirmed
            </span>
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
              You're Signed Up for Updates
            </h3>
            <p className="text-sm sm:text-base font-heading font-medium text-eco-blue-light">
              We will email you updates as groups fill.
            </p>
          </div>
        </motion.div>

        <div className="p-4 rounded-2xl bg-[#060A10]/90 border border-white/10 text-eco-muted-light text-sm leading-relaxed space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-eco-blue-light bg-[#003366]/25 border border-eco-blue/30 rounded-xl p-3">
            <Mail size={16} className="text-eco-blue flex-shrink-0" />
            <span>
              We sent a confirmation email to{' '}
              <strong className="text-white underline">{submittedEntry?.email || 'your email'}</strong>.
            </span>
          </div>
          {submittedEntry && (
            <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
              <div>
                <span className="text-eco-muted block text-[10px] uppercase font-mono">Parent / Guardian</span>
                <span className="text-white font-medium">{submittedEntry.parentName}</span>
              </div>
              <div>
                <span className="text-eco-muted block text-[10px] uppercase font-mono">Group</span>
                <span className="text-white font-medium">
                  {submittedEntry.ageGroup} ({submittedEntry.groupPreference})
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-1 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              setStatus('idle')
              setSubmittedEntry(null)
            }}
            className="flex-1 btn-ghost !py-3 !px-4 text-xs uppercase tracking-wider font-heading font-bold cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <span>Sign Up Another Email</span>
          </button>
          <Link
            to="/jr"
            className="flex-1 btn-ghost !py-3 !px-4 text-xs uppercase tracking-wider font-heading font-bold text-center flex items-center justify-center gap-2"
          >
            <span>Explore EcoHoops Jr.</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#97B3D2] font-semibold block mb-1">
            Not Ready to Register Yet?
          </span>
          <h3 className="font-display text-xl sm:text-2xl text-white uppercase font-bold">
            Get Program Updates
          </h3>
          <p className="text-xs sm:text-sm text-eco-muted-light mt-1">
            Leave your email and we will send updates as groups fill.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#003366] border border-eco-blue/30 flex items-center justify-center text-eco-blue flex-shrink-0">
          <Bell size={19} />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {status === 'error' && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3"
          >
            <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">Could not save your email</p>
              <p className="mt-0.5">
                {errorMessage || 'Please try again or email ecohoopscoaching@gmail.com.'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
        </div>

        {/* Child's Grade Group */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5 font-medium">
            Child's Grade <span className="text-red-400">*</span>
          </label>
          <div role="radiogroup" aria-label="Child's Grade" className="grid grid-cols-3 gap-2">
            {(['Grades 1-2', 'Grades 3-4', 'Grades 5-6'] as const).map((group) => {
              const isSelected = formData.gradeGroup === group
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
                    name="gradeGroup"
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
          {fieldErrors.gradeGroup && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-heading">
              <AlertCircle size={12} /> {fieldErrors.gradeGroup}
            </p>
          )}
        </div>

        {/* Conditional Group Preference */}
        {formData.gradeGroup === 'Grades 1-2' ? (
          <div className="p-2.5 rounded-xl bg-[#003366]/20 border border-eco-blue/30 flex items-center gap-2 text-xs text-eco-blue-light">
            <span className="w-2 h-2 rounded-full bg-eco-blue flex-shrink-0" />
            <span>
              <strong>Co-ed group:</strong> Girls and boys in Grades 1 and 2 play together in one co-ed group.
            </span>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5 font-medium">
              Which group? <span className="text-red-400">*</span>
            </label>
            <div role="radiogroup" aria-label="Which group?" className="grid grid-cols-2 gap-2">
              {(['Girls group', 'Boys group'] as const).map((opt) => {
                const isSelected = formData.groupPreference === opt
                return (
                  <label
                    key={opt}
                    className={`py-2.5 px-3 rounded-xl font-heading text-xs sm:text-sm font-bold transition-colors duration-150 border cursor-pointer text-center flex items-center justify-center select-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#003366] to-eco-blue text-white border-eco-blue shadow-glow-sm'
                        : 'bg-[#060A10]/80 border-eco-border text-eco-muted-light hover:border-eco-blue/40 hover:text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="groupPreference"
                      value={opt}
                      checked={isSelected}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span>{opt}</span>
                  </label>
                )
              })}
            </div>
            {fieldErrors.groupPreference && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-heading">
                <AlertCircle size={12} /> {fieldErrors.groupPreference}
              </p>
            )}
          </div>
        )}

        {/* Optional Details Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-[11px] font-mono uppercase tracking-wider text-eco-muted-light mb-1 font-medium"
            >
              Phone <span className="text-eco-muted">(Optional)</span>
            </label>
            <div className="relative">
              <Phone
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-muted pointer-events-none"
              />
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(416) 555-0199"
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                className={`w-full bg-[#060A10]/80 border rounded-xl pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-eco-muted/60 ${
                  fieldErrors.phone
                    ? 'border-red-500/80 focus:ring-red-500/30'
                    : 'border-eco-border focus:border-eco-blue focus:ring-eco-blue/20'
                }`}
              />
            </div>
            {fieldErrors.phone && (
              <p id="phone-error" className="text-xs text-red-400 mt-1 flex items-center gap-1 font-heading">
                <AlertCircle size={12} /> {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* Neighbourhood */}
          <div>
            <label
              htmlFor="neighbourhood"
              className="block text-[11px] font-mono uppercase tracking-wider text-eco-muted-light mb-1 font-medium"
            >
              Area <span className="text-eco-muted">(Optional)</span>
            </label>
            <div className="relative">
              <MapPin
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-muted pointer-events-none"
              />
              <input
                id="neighbourhood"
                name="neighbourhood"
                type="text"
                value={formData.neighbourhood}
                onChange={handleInputChange}
                placeholder="e.g. L5K or Erin Mills"
                className="w-full bg-[#060A10]/80 border border-eco-border rounded-xl pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-eco-blue focus:ring-2 focus:ring-eco-blue/20 transition-all placeholder:text-eco-muted/60"
              />
            </div>
          </div>

          {/* Number of Kids */}
          <div>
            <label
              htmlFor="childCount"
              className="block text-[11px] font-mono uppercase tracking-wider text-eco-muted-light mb-1 font-medium"
            >
              Kids <span className="text-eco-muted">(Optional)</span>
            </label>
            <div className="relative">
              <Users
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-muted pointer-events-none"
              />
              <select
                id="childCount"
                name="childCount"
                value={formData.childCount}
                onChange={handleInputChange}
                className="w-full bg-[#060A10]/80 border border-eco-border rounded-xl pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-eco-blue focus:ring-2 focus:ring-eco-blue/20 transition-all cursor-pointer"
              >
                <option value="1" className="bg-eco-surface text-white">1 Child</option>
                <option value="2" className="bg-eco-surface text-white">2 Children</option>
                <option value="3" className="bg-eco-surface text-white">3 Children</option>
                <option value="4+" className="bg-eco-surface text-white">4+ Children</option>
              </select>
            </div>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="pt-1">
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
              I agree to receive EcoHoops Jr. program updates by email.{' '}
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
          className={`w-full btn-ghost !py-3.5 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border-eco-blue/40 hover:border-eco-blue text-white transition-all ${
            status === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="animate-spin text-eco-blue" size={18} />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Get Program Updates</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  )
})

export default function JrNbaAnnouncement() {
  const { ref } = useScrollReveal(0.05)

  return (
    <section
      id="jr-nba-waitlist"
      ref={ref}
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-eco-black via-[#08101E] to-eco-black border-t border-b border-eco-border"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#003366]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-eco-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10 space-y-12">
        {/* TOP ROW: PROGRAM DETAILS & GROUPS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* LEFT COLUMN: OVERVIEW, PLANNING NOTICE, KEY DETAILS */}
          <div className="lg:col-span-7 space-y-6">
            {/* Official Partner Branding Banner */}
            <div className="bg-[#050B14]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4 flex-wrap">
                <img
                  src="/images/branding/jr-nba-canada-basketball-dark-tight.png"
                  alt="Jr. NBA and Jr. WNBA with Canada Basketball"
                  className="h-9 sm:h-11 w-auto object-contain"
                />
                <p className="text-xs sm:text-sm font-heading font-semibold text-white">
                  Officially partnered with Canada Basketball and NBA Canada.
                </p>
              </div>
              <img
                src="/images/branding/canada-basketball-dark-vertical-tight.png"
                alt="Canada Basketball Official Crest"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>

            {/* Eyebrow badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#003366]/50 border border-[#97B3D2]/30 text-[#97B3D2] text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-[#97B3D2]" />
                ECOHOOPS JR.
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                Grades 1 to 6 - Registration Open
              </div>
            </div>

            {/* Headline */}
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white leading-[1.08]">
              Jr. NBA and Jr. WNBA at{' '}
              <span className="gradient-text">EcoHoops Jr.</span>
            </h2>

            {/* Subheadline & Intro */}
            <div className="space-y-3 text-eco-muted-light text-base md:text-lg leading-relaxed font-body">
              <p className="text-xl md:text-2xl text-white font-heading font-semibold leading-snug">
                Basketball for girls and boys in Grades 1 to 6. No tryouts. No cuts.
              </p>
              <p>
                This program is being planned, and registration is open. Every player gets a reversible Jr. NBA or Jr. WNBA uniform and a basketball, included in the price.
              </p>
            </div>

            {/* Honest Planning Notice */}
            <div className="p-5 rounded-2xl bg-[#003366]/25 border border-eco-blue/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#97B3D2]">
                <ShieldCheck size={16} className="text-eco-blue flex-shrink-0" />
                <span>How Groups Will Run</span>
              </div>
              <p className="text-white text-sm sm:text-base font-medium leading-relaxed">
                Only the first two groups that fill will run. Maximum 15 players per group. First paid, first served.
              </p>
              <p className="text-eco-muted-light text-sm leading-relaxed">
                If your child's group does not fill, you choose a full refund or holding the spot for a later start.
              </p>
            </div>

            {/* Key Program Facts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0B1322]/90 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#97B3D2] font-semibold">
                  <CalendarDays size={15} className="text-eco-blue" />
                  <span>Dates</span>
                </div>
                <p className="text-white font-heading font-semibold text-sm sm:text-base">
                  Saturdays, January 23 to March 13, 2027.
                </p>
                <p className="text-eco-muted-light text-xs sm:text-sm">8 sessions.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B1322]/90 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#97B3D2] font-semibold">
                  <MapPin size={15} className="text-eco-blue" />
                  <span>Location</span>
                </div>
                <p className="text-white font-heading font-semibold text-sm sm:text-base">
                  St. Francis of Assisi School gym
                </p>
                <p className="text-eco-muted-light text-xs sm:text-sm">
                  2480 Thornlodge Dr, Mississauga.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B1322]/90 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#97B3D2] font-semibold">
                  <DollarSign size={15} className="text-eco-blue" />
                  <span>Price and Gear</span>
                </div>
                <p className="text-white font-heading font-semibold text-sm sm:text-base">
                  $249 for all 8 sessions.
                </p>
                <p className="text-eco-muted-light text-xs sm:text-sm">
                  Includes a reversible Jr. NBA or Jr. WNBA uniform and a basketball.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B1322]/90 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#97B3D2] font-semibold">
                  <Users size={15} className="text-eco-blue" />
                  <span>Group Size</span>
                </div>
                <p className="text-white font-heading font-semibold text-sm sm:text-base">
                  Maximum 15 players per group.
                </p>
                <p className="text-eco-muted-light text-xs sm:text-sm">
                  First paid, first served. No tryouts. No cuts.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FIVE GROUPS, SESSION TIMES, PARTNER SEAL, PHOTO */}
          <div className="lg:col-span-5 space-y-6">
            {/* Five Groups & Times Card */}
            <div className="p-6 rounded-3xl bg-[#0F1628]/90 border border-eco-blue/25 shadow-xl space-y-5">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#97B3D2] font-semibold">
                  Five Groups Total
                </span>
                <h3 className="font-display text-2xl text-white uppercase font-bold mt-1">
                  Groups and Times
                </h3>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-white text-sm sm:text-base font-heading font-medium">
                  <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Kids in Grades 1 and 2 play in one co-ed group.</span>
                </li>
                <li className="flex items-start gap-3 text-white text-sm sm:text-base font-heading font-medium">
                  <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Kids in Grades 3 and 4 have a girls group and a boys group.</span>
                </li>
                <li className="flex items-start gap-3 text-white text-sm sm:text-base font-heading font-medium">
                  <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Kids in Grades 5 and 6 have a girls group and a boys group.</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#97B3D2] font-semibold">
                  <Clock size={14} className="text-eco-blue" />
                  <span>Saturday Session Times</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                  <div className="p-3 rounded-xl bg-[#060A10]/80 border border-white/10">
                    <div className="text-xs font-mono uppercase text-[#97B3D2]">Girls Groups</div>
                    <div className="text-white font-heading font-bold mt-0.5">10:00 to 11:00 AM</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#060A10]/80 border border-white/10">
                    <div className="text-xs font-mono uppercase text-[#97B3D2]">Boys Groups</div>
                    <div className="text-white font-heading font-bold mt-0.5">11:00 AM to 12:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Gear & Partner Seal */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#003366]/40 via-eco-surface to-[#003366]/20 border border-white/10 flex items-center gap-4 shadow-lg">
              <img
                src="/images/branding/canada-basketball-vertical-red.png"
                alt="Canada Basketball Official Partner"
                className="h-16 w-auto object-contain flex-shrink-0"
              />
              <div className="space-y-1">
                <h4 className="text-white font-heading font-bold text-sm">
                  Officially partnered with Canada Basketball and NBA Canada.
                </h4>
                <p className="text-eco-muted-light text-xs leading-relaxed">
                  Every player gets a reversible Jr. NBA or Jr. WNBA uniform and a basketball, included in the $249 price.
                </p>
              </div>
            </div>

            {/* Authentic photo card */}
            <div className="relative rounded-2xl overflow-hidden border border-eco-border/60 shadow-xl group">
              <img
                src="/images/13.png"
                alt="Young girls and boys smiling and playing basketball together in EcoHoops Jr."
                loading="lazy"
                decoding="async"
                className="w-full h-52 sm:h-56 object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-eco-black/85 via-eco-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-heading font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Smile size={16} className="text-eco-blue" />
                  Fun, pressure-free basketball for girls and boys
                </span>
                <span className="text-[11px] font-mono text-eco-muted uppercase tracking-wider">
                  EcoHoops Jr.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION ROW: BIG REGISTER BUTTON ALONGSIDE GET UPDATES EMAIL SIGNUP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* PRIMARY ACTION: ONE BIG CLEAR REGISTER BUTTON */}
          <div className="lg:col-span-5">
            <div className="h-full glow-card p-7 sm:p-8 bg-gradient-to-br from-[#002855] via-[#0F1B33] to-[#0A1324] border-2 border-eco-blue/50 rounded-3xl shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                  Registration Open
                </span>
                <h3 className="font-display text-3xl sm:text-4xl text-white uppercase font-bold leading-tight">
                  Ready to Register?
                </h3>
                <p className="text-eco-muted-light text-sm sm:text-base leading-relaxed">
                  Save a spot for your child in our Grades 1 to 6 Saturday sessions at St. Francis of Assisi School gym. $249 covers all 8 sessions, a reversible Jr. NBA or Jr. WNBA uniform, and a basketball.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-white/90 font-heading">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                    <span>Saturdays, January 23 to March 13, 2027 (8 sessions)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                    <span>Maximum 15 players per group. First paid, first served.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                    <span>No tryouts. No cuts.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={JR_NBA_REGISTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-glow !py-5 !px-6 text-base sm:text-lg font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-glow-md hover:scale-[1.01] transition-transform text-center"
                >
                  <span>Register</span>
                  <ExternalLink size={18} />
                </a>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  Only the first two groups that fill will run. If your child's group does not fill, you choose a full refund or holding the spot for a later start.
                </p>
              </div>
            </div>
          </div>

          {/* SECONDARY ACTION ALONGSIDE REGISTER: EMAIL UPDATES SIGNUP */}
          <div className="lg:col-span-7">
            <div className="h-full glow-card p-6 sm:p-8 bg-[#0F1628]/90 border border-eco-blue/20 backdrop-blur-xl rounded-3xl shadow-2xl">
              <UpdatesSignupForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
