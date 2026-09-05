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
  MapPin,
  CalendarDays,
} from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { getTrackingParams, saveWaitlistEntry } from '../../data/waitlist'

const BENEFITS = [
  'Targeting a mid-October 2026 start in Southwest Mississauga',
  'Weekly session day and venue to be confirmed (Friday or Saturday options pending permit)',
  '10 weekly sessions, 60 minutes each (max 12 children per group)',
  'Ages 5–6 (co-ed), Ages 7–9 & 10–11 (separate girls’ and boys’ groups)',
  'Groups will run based on registration numbers',
  'Confirmed price: $249 per player',
  'Official gear: Jr. NBA reversible jersey, shorts, Wilson basketball included',
  'Includes Canada Basketball & Ontario Basketball membership/insurance',
]

interface FormState {
  parentName: string
  email: string
  phone: string
  ageGroup: 'Ages 5–6' | 'Ages 7–9' | 'Ages 10–11'
  groupPreference: 'Boys’ group' | 'Girls’ group' | ''
  daysAvailable: 'Friday' | 'Saturday' | 'Either' | ''
  neighbourhood: string
  childCount: string
  consent: boolean
}

const INITIAL_FORM_STATE: FormState = {
  parentName: '',
  email: '',
  phone: '',
  ageGroup: 'Ages 5–6',
  groupPreference: '',
  daysAvailable: '', // Do not preselect an answer
  neighbourhood: '',
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

  const setFieldValue = (name: keyof FormState, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
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

    // Phone validation: optional, but if supplied validate format
    if (formData.phone.trim()) {
      const digits = formData.phone.replace(/\D/g, '')
      if (digits.length < 10) {
        errors.phone = 'Please enter a valid 10-digit phone number or leave blank.'
      }
    }

    if (!formData.ageGroup) {
      errors.ageGroup = 'Please select an age group.'
    }

    // For Ages 7–9 and 10–11, require group preference
    if (formData.ageGroup !== 'Ages 5–6' && !formData.groupPreference) {
      errors.groupPreference = 'Please select which group you are interested in.'
    }

    // "Which days could work?" - do not preselect, require a selection
    if (!formData.daysAvailable) {
      errors.daysAvailable = 'Please select which days could work.'
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

    const trackingParams = getTrackingParams()
    const isTest = Boolean(
      formData.parentName.trim().toLowerCase() === 'dre' ||
      formData.parentName.trim().toLowerCase().includes('test') ||
      formData.email.toLowerCase().includes('test@') ||
      formData.parentName.trim().toLowerCase() === 'adrian test'
    )

    const resolvedGroupPref = formData.ageGroup === 'Ages 5–6' 
      ? 'Co-ed' 
      : (formData.groupPreference || 'Not provided')

    const payload = {
      access_key: '933bf5e4-2815-45e1-853f-a58c9fb77a2f',
      subject: `New EcoHoops Jr. Waitlist - ${formData.parentName.trim()} (${formData.ageGroup})`,
      from_name: 'EcoHoops Jr. Waitlist',
      to: 'ecohoopscoaching@gmail.com',
      replyto: formData.email.trim(),
      'Parent / Guardian Name': formData.parentName.trim(),
      'Email Address': formData.email.trim(),
      'Phone Number': formData.phone.trim() || 'Not provided',
      'Child Age Group': formData.ageGroup,
      'Group Preference': resolvedGroupPref,
      'Days That Could Work': formData.daysAvailable || 'Not provided',
      'Neighbourhood / Postal Area': formData.neighbourhood.trim() || 'Not provided',
      'Number of Children': formData.childCount || '1',
      'Consent to Updates': formData.consent ? 'Yes' : 'No',
      'Submission Time': new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }),
      'Campaign Source': trackingParams.utm_source || 'Direct / organic',
      'Campaign Medium': trackingParams.utm_medium || 'Not provided',
      'Campaign Name': trackingParams.utm_campaign || 'Not provided',
      'Meta Click ID (fbclid)': trackingParams.fbclid || 'Not provided',
      'Test Status': isTest ? 'TEST' : 'REAL LEAD',
    }

    try {
      // 1. Store locally with full fields for backup & Admin Dashboard
      saveWaitlistEntry({
        id: `entry-${Date.now()}`,
        parentName: formData.parentName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || 'Not provided',
        ageGroup: formData.ageGroup,
        groupPreference: resolvedGroupPref as any,
        daysAvailable: (formData.daysAvailable || 'Not provided') as any,
        neighbourhood: formData.neighbourhood.trim() || 'Not provided',
        childCount: (formData.childCount || '1') as any,
        consent: formData.consent,
        submissionTime: new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }),
        source: trackingParams.utm_source ? `Meta / ${trackingParams.utm_source}` : 'Website direct',
        utmParams: trackingParams,
        isTest,
      })

      // 2. Deliver via Web3Forms to Adrian's email
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
        // 3. Meta Pixel Lead tracking:
        // ONLY fire after successfully confirmed API submission.
        // Never fire on button click, failed submission, page reload, or internal test.
        if (!isTest && typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead', {
            content_name: 'EcoHoops Jr. Waitlist',
            content_category: formData.ageGroup,
            currency: 'CAD',
            value: 0,
          })
        }

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
            aria-invalid={!!fieldErrors.phone}
            aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
            className={`w-full bg-[#060A10]/80 border rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-eco-muted/60 ${
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

      {/* Child's Age Group */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5 font-medium flex items-center justify-between">
          <span>Child's Age Group <span className="text-red-400">*</span></span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['Ages 5–6', 'Ages 7–9', 'Ages 10–11'] as const).map((group) => {
            const isSelected = formData.ageGroup === group
            return (
              <button
                type="button"
                key={group}
                onClick={() => {
                  setFieldValue('ageGroup', group)
                  if (group === 'Ages 5–6') {
                    setFieldValue('groupPreference', '')
                  }
                }}
                className={`py-2.5 px-1 rounded-xl font-heading text-[11px] sm:text-xs uppercase font-bold transition-colors duration-150 border cursor-pointer text-center flex items-center justify-center select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#003366] to-eco-blue text-white border-eco-blue shadow-glow-sm'
                    : 'bg-[#060A10]/80 border-eco-border text-eco-muted-light hover:border-eco-blue/40 hover:text-white'
                }`}
              >
                {group}
              </button>
            )
          })}
        </div>
        {fieldErrors.ageGroup && (
          <p id="ageGroup-error" className="text-xs text-red-400 mt-1 flex items-center gap-1 font-heading">
            <AlertCircle size={12} /> {fieldErrors.ageGroup}
          </p>
        )}
      </div>

      {/* Conditional Group Preference */}
      {formData.ageGroup === 'Ages 5–6' ? (
        <div className="p-2.5 rounded-xl bg-[#003366]/20 border border-eco-blue/30 flex items-center gap-2 text-xs text-eco-blue-light">
          <span className="w-2 h-2 rounded-full bg-eco-blue flex-shrink-0" />
          <span><strong>Co-ed group:</strong> Boys and girls play and learn together in Ages 5–6.</span>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5 font-medium">
            Which group are you interested in? <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['Boys’ group', 'Girls’ group'] as const).map((opt) => {
              const isSelected = formData.groupPreference === opt
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setFieldValue('groupPreference', opt)}
                  className={`py-2.5 px-3 rounded-xl font-heading text-xs sm:text-sm font-bold transition-colors duration-150 border cursor-pointer text-center flex items-center justify-center select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#003366] to-eco-blue text-white border-eco-blue shadow-glow-sm'
                      : 'bg-[#060A10]/80 border-eco-border text-eco-muted-light hover:border-eco-blue/40 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
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

      {/* Which days could work? */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5 font-medium flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-eco-blue" />
            <span>Which days could work? <span className="text-red-400">*</span></span>
          </span>
          <span className="text-[10px] text-eco-muted">Permit pending</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['Friday', 'Saturday', 'Either'] as const).map((day) => {
            const isSelected = formData.daysAvailable === day
            return (
              <button
                type="button"
                key={day}
                onClick={() => setFieldValue('daysAvailable', day)}
                className={`py-2.5 px-2 rounded-xl font-heading text-[11px] sm:text-xs font-bold transition-colors duration-150 border cursor-pointer text-center flex items-center justify-center select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#003366] to-eco-blue text-white border-eco-blue shadow-glow-sm'
                    : 'bg-[#060A10]/80 border-eco-border text-eco-muted-light hover:border-eco-blue/40 hover:text-white'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
        {fieldErrors.daysAvailable && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-heading">
            <AlertCircle size={12} /> {fieldErrors.daysAvailable}
          </p>
        )}
      </div>

      {/* Neighbourhood & Number of Children */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Your Neighbourhood */}
        <div>
          <label
            htmlFor="neighbourhood"
            className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1 font-medium flex items-center justify-between"
          >
            <span>Your Neighbourhood</span>
            <span className="text-[10px] text-eco-muted uppercase">Optional</span>
          </label>
          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-muted pointer-events-none"
            />
            <input
              id="neighbourhood"
              name="neighbourhood"
              type="text"
              value={formData.neighbourhood}
              onChange={handleInputChange}
              placeholder="e.g. Churchill Meadows or L5M"
              className="w-full bg-[#060A10]/80 border border-eco-border rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-eco-blue focus:ring-2 focus:ring-eco-blue/20 transition-all placeholder:text-eco-muted/60"
            />
          </div>
          <p className="text-[10px] text-eco-muted mt-1 leading-tight">
            Or enter the first three characters of your postal code.
          </p>
        </div>

        {/* Number of Kids */}
        <div>
          <label
            htmlFor="childCount"
            className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1 font-medium flex items-center justify-between"
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
            <span>Join the Waitlist</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <p className="text-[11px] text-eco-muted text-center pt-1 font-mono">
        Joining provides registration updates and does not reserve a place.
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
            {/* Official Branding Header Lockup Banner */}
            <div className="bg-[#050B14]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <img
                src="/images/branding/jr-nba-canada-basketball-dark-tight.png"
                alt="Jr. NBA • WNBA • Canada Basketball"
                className="h-9 sm:h-11 w-auto object-contain"
              />
              <div className="flex items-center gap-3">
                <img
                  src="/images/branding/canada-basketball-dark-vertical-tight.png"
                  alt="Canada Basketball Official Crest"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                <div className="text-left hidden xs:block">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#97B3D2]">
                    Official Sanctioning
                  </div>
                  <div className="text-xs font-heading font-semibold text-white">
                    Canada Basketball & OBA
                  </div>
                </div>
              </div>
            </div>

            {/* Eyebrow badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#003366]/50 border border-[#97B3D2]/30 text-[#97B3D2] text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-[#97B3D2]" />
                NEW FROM ECOHOOPS JR.
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-eco-blue/15 border border-eco-blue/35 text-eco-blue-light text-xs font-mono font-bold uppercase tracking-wider">
                Ages 5–6 (Co-Ed) • Ages 7–9 & 10–11 (Separate Groups)
              </div>
            </div>

            {/* Headline */}
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-[1.08]">
              Jr. NBA/Jr. WNBA Is Coming to{' '}
              <span className="gradient-text">EcoHoops Jr.</span>
            </h2>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white font-heading font-semibold leading-snug">
              A fun, welcoming place for kids to play, learn, and grow (Ages 5–6 Co-Ed, Ages 7–9 & 10–11 Separate Girls’ and Boys’ Groups).
            </p>

            {/* Body */}
            <div className="space-y-4 text-eco-muted-light text-base md:text-lg leading-relaxed font-body">
              <p>
                EcoHoops Jr. is excited to bring Jr. NBA/Jr. WNBA programming to Southwest Mississauga, targeting a mid-October 2026 start across three age divisions: <strong className="text-white font-semibold">Ages 5–6 (co-ed)</strong>, <strong className="text-white font-semibold">Ages 7–9 (separate girls’ and boys’ groups)</strong>, and <strong className="text-white font-semibold">Ages 10–11 (separate girls’ and boys’ groups)</strong>.
              </p>
              <p>
                Young players will have the opportunity to learn the game, make friends, build confidence, and develop teamwork in a positive environment that puts kids first. Groups will run based on registration numbers.
              </p>
              <p className="text-white font-medium">
                Weekly session day and venue to be confirmed. (A school permit would most likely mean Friday; Saturday is another possibility under review. Churchill Meadows Community Centre is a possible venue, not a confirmed booking).
              </p>
              <p className="text-eco-muted-light text-sm">
                Joining the waitlist provides registration updates and does not reserve a place.
              </p>
            </div>

            {/* Benefits List */}
            <div className="pt-2 space-y-3">
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

            {/* Official Gear & Sanctioning Seal */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#003366]/40 via-eco-surface to-[#003366]/20 border border-white/10 flex flex-col sm:flex-row items-center gap-4 shadow-lg">
              <img
                src="/images/branding/canada-basketball-vertical-red.png"
                alt="Canada Basketball Official Partner"
                className="h-16 w-auto object-contain flex-shrink-0"
              />
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Official Sanctioned Youth Program
                </div>
                <h4 className="text-white font-heading font-bold text-sm">
                  Official Jr. NBA Reversible Kit & Canada Basketball Membership
                </h4>
                <p className="text-eco-muted-light text-xs leading-relaxed">
                  Every registered player receives an official Jr. NBA reversible uniform, Wilson basketball, and full player insurance coverage through Canada Basketball & Ontario Basketball.
                </p>
              </div>
            </div>

            {/* Authentic photo card */}
            <div className="pt-2">
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
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src="/images/branding/jr-nba-wnba-dark.png"
                      alt="Jr. NBA & Jr. WNBA"
                      className="h-6 w-auto object-contain"
                    />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#97B3D2] font-semibold">
                      Priority Notification
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-white uppercase font-bold">
                    Join the Waitlist
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
