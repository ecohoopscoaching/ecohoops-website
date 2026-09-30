import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Send, Loader2, AlertCircle } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

interface VolunteerFormState {
  fullName: string
  email: string
  phone: string
  ageConfirmed: boolean
  collegeName: string
  whyCoach: string
  availability: string
}

const INITIAL_FORM: VolunteerFormState = {
  fullName: '',
  email: '',
  phone: '',
  ageConfirmed: false,
  collegeName: '',
  whyCoach: '',
  availability: 'Weekday evenings',
}

export default function Volunteer() {
  useDocumentTitle('Volunteer Coaching Application | EcoHoops')
  const { ref, isVisible } = useScrollReveal(0.05)
  const formRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<VolunteerFormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof VolunteerFormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
      if (errors[name as keyof VolunteerFormState]) {
        setErrors((prev) => ({ ...prev, [name]: '' }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (errors[name as keyof VolunteerFormState]) {
        setErrors((prev) => ({ ...prev, [name]: '' }))
      }
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof VolunteerFormState, string>> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.ageConfirmed) {
      newErrors.ageConfirmed = 'You must confirm that you are 19 years of age or older.'
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'Please enter your college or university name.'
    }

    if (!formData.whyCoach.trim()) {
      newErrors.whyCoach = 'Please enter why you want to coach.'
    }

    if (!formData.availability.trim()) {
      newErrors.availability = 'Please specify your weekday evening availability.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      return
    }

    setStatus('submitting')

    const applicantName = formData.fullName.trim()
    const payload = {
      access_key: '933bf5e4-2815-45e1-853f-a58c9fb77a2f',
      subject: `New EcoHoops Volunteer Application - ${applicantName}`,
      from_name: 'EcoHoops Volunteer Application',
      to: 'ecohoopscoaching@gmail.com',
      replyto: formData.email.trim(),
      email: formData.email.trim(),
      'Full Name': applicantName,
      'Email': formData.email.trim(),
      'Phone': formData.phone.trim() || 'Not provided',
      'Age Confirmation (19+)': formData.ageConfirmed ? 'Confirmed 19 or older' : 'No',
      'College / University': formData.collegeName.trim(),
      'Why Want to Coach': formData.whyCoach.trim(),
      'Availability': formData.availability.trim(),
      'Submission Time': new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }),
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success || response.ok) {
        setStatus('success')
        setFormData(INITIAL_FORM)

        // Fire Google Ads volunteer conversion event (guarded, fires once per successful submit)
        try {
          if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
            (window as any).gtag('event', 'conversion', {
              send_to: 'AW-18484354648/vkoxCKbYhIwdENi8g-5E',
            })
          }
        } catch {
          // Ignore tracking errors if blocked by privacy extensions
        }

        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }, 50)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div ref={ref} className="pt-28 pb-24 min-h-screen bg-eco-dark text-white selection:bg-eco-blue selection:text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 space-y-3"
        >
          <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#003366]/60 border border-[#97B3D2]/30 text-[#97B3D2] text-xs font-mono font-bold uppercase tracking-wider">
            Volunteer Coaching
          </div>

          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
            BECOME A <span className="text-[#97B3D2]">VOLUNTEER COACH.</span>
          </h1>

          <p className="text-eco-muted-light text-base leading-relaxed font-body">
            Interested in volunteer coaching with EcoHoops? Fill out the application form below and our team will get in touch with you.
          </p>
        </motion.div>

        {/* Application Form Card */}
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-2xl mx-auto"
        >
          <div className="p-6 sm:p-10 rounded-3xl bg-[#0A1424] border border-[#003366] shadow-2xl relative">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="py-10 text-center space-y-5"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#003366]/50 border border-[#97B3D2]/40 flex items-center justify-center text-[#97B3D2]">
                    <CheckCircle2 size={36} />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                      Application Submitted
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
                      APPLICATION RECEIVED!
                    </h3>
                    <p className="text-eco-muted-light text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                      Thank you for applying to volunteer coach with EcoHoops. We have received your application and will review your details shortly.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setStatus('idle')
                        setFormData(INITIAL_FORM)
                      }}
                      className="px-6 py-2.5 rounded-xl border border-white/20 text-eco-muted-light hover:text-white hover:border-white/40 text-sm font-heading transition-colors"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-white/10 pb-3">
                    <h2 className="font-display text-xl uppercase tracking-tight text-white">
                      Volunteer Coach Application
                    </h2>
                    <p className="text-xs text-eco-muted-light mt-0.5">
                      Required fields are marked with an asterisk (<span className="text-red-400">*</span>).
                    </p>
                  </div>

                  {status === 'error' && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-300 text-xs">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-400" />
                      <div>
                        There was an issue submitting your application. Please check your connection or email{' '}
                        <a href="mailto:ecohoopscoaching@gmail.com" className="underline font-semibold text-white">
                          ecohoopscoaching@gmail.com
                        </a>.
                      </div>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-eco-muted-light mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`w-full bg-[#060A10] border ${
                        errors.fullName ? 'border-red-500' : 'border-white/10'
                      } rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#97B3D2] text-sm font-body transition-colors`}
                    />
                    {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-eco-muted-light mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className={`w-full bg-[#060A10] border ${
                          errors.email ? 'border-red-500' : 'border-white/10'
                        } rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#97B3D2] text-sm font-body transition-colors`}
                      />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-eco-muted-light mb-1.5">
                        Phone <span className="text-white/40 text-[10px]">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(optional)"
                        className="w-full bg-[#060A10] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#97B3D2] text-sm font-body transition-colors"
                      />
                    </div>
                  </div>

                  {/* Age Confirmation (19 or older) */}
                  <div className="p-3.5 rounded-xl bg-[#060A10] border border-white/10">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="ageConfirmed"
                        checked={formData.ageConfirmed}
                        onChange={handleChange}
                        className="mt-0.5 w-4 h-4 rounded text-[#003366] focus:ring-[#97B3D2] border-white/30 bg-[#0A1424] cursor-pointer"
                      />
                      <span className="text-xs text-white leading-relaxed">
                        I confirm that I am 19 years of age or older <span className="text-red-400">*</span>
                      </span>
                    </label>
                    {errors.ageConfirmed && (
                      <p className="text-xs text-red-400 mt-1.5 pl-7">{errors.ageConfirmed}</p>
                    )}
                  </div>

                  {/* College / University Name */}
                  <div>
                    <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-eco-muted-light mb-1.5">
                      College / University Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleChange}
                      placeholder="e.g. University of Toronto, Sheridan College"
                      className={`w-full bg-[#060A10] border ${
                        errors.collegeName ? 'border-red-500' : 'border-white/10'
                      } rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#97B3D2] text-sm font-body transition-colors`}
                    />
                    {errors.collegeName && <p className="text-xs text-red-400 mt-1">{errors.collegeName}</p>}
                  </div>

                  {/* Availability (Weekday evenings) */}
                  <div>
                    <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-eco-muted-light mb-1.5">
                      Availability (Weekday Evenings) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      placeholder="e.g. Weekday evenings, Monday & Wednesday, etc."
                      className={`w-full bg-[#060A10] border ${
                        errors.availability ? 'border-red-500' : 'border-white/10'
                      } rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#97B3D2] text-sm font-body transition-colors`}
                    />
                    {errors.availability && <p className="text-xs text-red-400 mt-1">{errors.availability}</p>}
                  </div>

                  {/* Why they want to coach */}
                  <div>
                    <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-eco-muted-light mb-1.5">
                      Why do you want to coach? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      name="whyCoach"
                      value={formData.whyCoach}
                      onChange={handleChange}
                      placeholder="Short note on why you want to coach with EcoHoops..."
                      className={`w-full bg-[#060A10] border ${
                        errors.whyCoach ? 'border-red-500' : 'border-white/10'
                      } rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#97B3D2] text-sm font-body transition-colors resize-none`}
                    />
                    {errors.whyCoach && <p className="text-xs text-red-400 mt-1">{errors.whyCoach}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full btn-glow py-3.5 px-6 rounded-xl font-heading font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-white" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
