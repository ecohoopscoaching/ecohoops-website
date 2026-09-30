import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Heart, 
  Clock, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  Loader2, 
  AlertCircle,
  Award,
  ChevronRight,
  CalendarCheck
} from 'lucide-react'
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
  availability: 'Weekday Evenings (Monday–Thursday 6:00 PM – 9:00 PM)',
}

export default function Volunteer() {
  useDocumentTitle('Volunteer Coaching Application | EcoHoops')
  const { ref, isVisible } = useScrollReveal(0.05)
  const formRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<VolunteerFormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof VolunteerFormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [submittedName, setSubmittedName] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
      if (errors[name as keyof VolunteerFormState]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      if (errors[name as keyof VolunteerFormState]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
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

    if (formData.phone.trim() && formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number or leave blank.'
    }

    if (!formData.ageConfirmed) {
      newErrors.ageConfirmed = 'You must confirm that you are 19 years of age or older.'
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'Please enter your college or university name.'
    }

    if (!formData.whyCoach.trim()) {
      newErrors.whyCoach = 'Please share a brief note on why you would like to coach with us.'
    } else if (formData.whyCoach.trim().length < 15) {
      newErrors.whyCoach = 'Please provide a sentence or two explaining your motivation.'
    }

    if (!formData.availability.trim()) {
      newErrors.availability = 'Please select or confirm your weekday evening availability.'
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
      'Applicant Full Name': applicantName,
      'Email Address': formData.email.trim(),
      'Phone Number': formData.phone.trim() || 'Not provided',
      'Age Confirmation (19+)': formData.ageConfirmed ? 'Confirmed (19 or older)' : 'No',
      'College / University': formData.collegeName.trim(),
      'Why They Want to Coach': formData.whyCoach.trim(),
      'Availability (Weekday Evenings)': formData.availability.trim(),
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
        setSubmittedName(applicantName)
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
      {/* Background radial accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#003366]/30 via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#003366]/60 border border-[#97B3D2]/30 text-[#97B3D2] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-[#97B3D2]" />
            Volunteer With EcoHoops • Make An Impact
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-tight">
            BECOME A <span className="text-[#97B3D2]">VOLUNTEER COACH.</span>
          </h1>

          <p className="text-eco-muted-light text-base sm:text-lg leading-relaxed font-body">
            Empower youth basketball in Southwest Mississauga. We're looking for passionate university & college students aged 19+ who want to mentor young athletes, build real coaching experience, and foster a healthy, positive sports culture.
          </p>
        </motion.div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#060A10]/80 border border-white/10 hover:border-[#97B3D2]/40 transition-colors space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#003366]/40 border border-[#97B3D2]/30 flex items-center justify-center text-[#97B3D2]">
              <Heart size={22} />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Youth Mentorship</h3>
            <p className="text-sm text-eco-muted-light leading-relaxed">
              Help children learn the fundamentals, gain confidence, and experience basketball free from toxicity or excessive pressure.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#060A10]/80 border border-white/10 hover:border-[#97B3D2]/40 transition-colors space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#003366]/40 border border-[#97B3D2]/30 flex items-center justify-center text-[#97B3D2]">
              <GraduationCap size={22} />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Collegiate Students (19+)</h3>
            <p className="text-sm text-eco-muted-light leading-relaxed">
              Ideal for students pursuing Kinesiology, Sports Management, Education, or anyone who loves the sport and wants verified community coaching hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#060A10]/80 border border-white/10 hover:border-[#97B3D2]/40 transition-colors space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#003366]/40 border border-[#97B3D2]/30 flex items-center justify-center text-[#97B3D2]">
              <Clock size={22} />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Weekday Evenings</h3>
            <p className="text-sm text-eco-muted-light leading-relaxed">
              Sessions take place on weekday evenings in Southwest Mississauga. Low time commitment (1–2 hours weekly) with maximum community impact.
            </p>
          </div>
        </div>

        {/* Main Content Layout: Form & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Program Details & Expectations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#003366]/20 via-[#0A1830]/40 to-[#001C40]/30 border border-[#97B3D2]/30 shadow-xl space-y-6">
              <div className="flex items-center gap-3 text-[#97B3D2]">
                <ShieldCheck size={28} />
                <h3 className="font-heading font-bold text-xl text-white">What You'll Experience</h3>
              </div>

              <ul className="space-y-4 text-sm text-eco-muted-light">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#003366] text-[#97B3D2] flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white">Hands-On Coaching:</strong> Assist our Head Coaches with drill execution, station rotations, and small-sided games.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#003366] text-[#97B3D2] flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white">Coaching Gear & Training:</strong> EcoHoops coaching shirt, practice drill sheets, and Safe Sport guidance provided.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#003366] text-[#97B3D2] flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white">Reference Letters & Hours:</strong> Verified volunteer hours sign-off and formal employment/academic reference letters from Coach Adrian.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#003366] text-[#97B3D2] flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white">Safe Sport Environment:</strong> Background checks and positive coaching standards ensure a supportive space for both players and coaches.
                  </div>
                </li>
              </ul>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-xs text-[#97B3D2] font-mono uppercase tracking-wider font-semibold">
                  Program Location & Timing
                </p>
                <p className="text-xs text-eco-muted-light">
                  Gyms located in Southwest Mississauga (including St. Luke, St. Christopher, and Iona Catholic SS). Practices run weekday evenings (typically between 6:00 PM and 9:00 PM).
                </p>
              </div>
            </div>

            {/* Quote Card */}
            <div className="p-6 rounded-2xl bg-[#060A10] border border-white/10 text-xs text-eco-muted-light space-y-2">
              <p className="italic">
                "We don't need drill sergeants. We want coaches who bring joy, listen, high-five, and make sure every player walks out of the gym with a smile and a love for the game."
              </p>
              <p className="text-[#97B3D2] font-heading font-semibold text-right">— Adrian Sapp, Founder & Head Coach</p>
            </div>
          </motion.div>

          {/* Right Column: Application Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="p-6 sm:p-10 rounded-3xl bg-[#0A1424]/90 border border-white/10 shadow-2xl relative">
              
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="py-6 text-center space-y-6"
                  >
                    <div className="relative inline-flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-[#003366]/40 blur-2xl animate-pulse" />
                      <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#003366] via-[#0A1830] to-[#001C40] border-2 border-[#97B3D2]/50 flex items-center justify-center shadow-lg text-[#97B3D2]">
                        <CheckCircle2 size={40} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                        Application Received
                      </span>
                      <h3 className="font-display text-3xl uppercase tracking-tight text-white">
                        THANK YOU, {submittedName || 'COACH'}!
                      </h3>
                      <p className="text-eco-muted-light text-base max-w-lg mx-auto leading-relaxed">
                        We've received your volunteer coaching application. Coach Adrian will review your information and reach out via email within 48–72 hours to schedule a quick conversation and discuss next steps.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#060A10] border border-white/10 text-xs text-eco-muted-light max-w-md mx-auto text-left space-y-2">
                      <div className="flex items-center gap-2 text-[#97B3D2] font-semibold uppercase font-mono text-[11px]">
                        <CalendarCheck size={16} /> Next Steps
                      </div>
                      <p>
                        Check your inbox for a confirmation. In the meantime, feel free to explore our philosophy and team programs.
                      </p>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                      <Link 
                        to="/" 
                        className="btn-glow px-6 py-2.5 text-sm uppercase tracking-wider font-heading font-bold"
                      >
                        Return Home
                      </Link>
                      <button
                        onClick={() => {
                          setStatus('idle')
                          setFormData(INITIAL_FORM)
                        }}
                        className="px-6 py-2.5 rounded-xl border border-white/20 text-eco-muted-light hover:text-white hover:border-white/40 text-sm font-heading transition-colors"
                      >
                        Submit Another Form
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form key="form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="font-display text-2xl uppercase tracking-tight text-white">
                        Volunteer Coach Application
                      </h2>
                      <p className="text-xs text-eco-muted-light mt-1">
                        Please fill out the form below. All required fields are marked with an asterisk (<span className="text-red-400">*</span>).
                      </p>
                    </div>

                    {status === 'error' && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-400" />
                        <div>
                          <strong>Submission issue:</strong> We couldn't send your application right now. Please check your connection or email us directly at{' '}
                          <a href="mailto:ecohoopscoaching@gmail.com" className="underline font-medium text-white">
                            ecohoopscoaching@gmail.com
                          </a>.
                        </div>
                      </div>
                    )}

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Jordan Smith"
                        className={`w-full bg-[#060A10] border ${
                          errors.fullName ? 'border-red-500' : 'border-white/10'
                        } rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#97B3D2] text-sm font-body transition-colors`}
                      />
                      {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="jordan@mail.utoronto.ca"
                          className={`w-full bg-[#060A10] border ${
                            errors.email ? 'border-red-500' : 'border-white/10'
                          } rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#97B3D2] text-sm font-body transition-colors`}
                        />
                        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5">
                          Phone Number <span className="text-white/40 text-[10px]">(Optional)</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="905-555-0123"
                          className={`w-full bg-[#060A10] border ${
                            errors.phone ? 'border-red-500' : 'border-white/10'
                          } rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#97B3D2] text-sm font-body transition-colors`}
                        />
                        {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Age Confirmation (19 or older) */}
                    <div className="p-4 rounded-2xl bg-[#060A10] border border-white/10 space-y-2">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="ageConfirmed"
                          checked={formData.ageConfirmed}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 rounded text-[#003366] focus:ring-[#97B3D2] border-white/30 bg-[#0A1424] cursor-pointer"
                        />
                        <div className="text-xs leading-relaxed">
                          <span className="text-white font-semibold block">
                            I confirm that I am 19 years of age or older <span className="text-red-400">*</span>
                          </span>
                          <span className="text-eco-muted-light text-[11px]">
                            Required by Canada Basketball / Safe Sport guidelines for volunteer coaching roles involving youth athletes.
                          </span>
                        </div>
                      </label>
                      {errors.ageConfirmed && (
                        <p className="text-xs text-red-400 pl-7">{errors.ageConfirmed}</p>
                      )}
                    </div>

                    {/* College / University */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5">
                        College or University Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleChange}
                        placeholder="e.g. University of Toronto Mississauga (UTM), Sheridan College, etc."
                        className={`w-full bg-[#060A10] border ${
                          errors.collegeName ? 'border-red-500' : 'border-white/10'
                        } rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#97B3D2] text-sm font-body transition-colors`}
                      />
                      {errors.collegeName && <p className="text-xs text-red-400 mt-1">{errors.collegeName}</p>}
                    </div>

                    {/* Availability (Weekday evenings) */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5">
                        Availability (Weekday Evenings) <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="w-full bg-[#060A10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#97B3D2] text-sm font-body transition-colors"
                      >
                        <option value="Weekday Evenings (Monday–Thursday 6:00 PM – 9:00 PM)">
                          Weekday Evenings (Monday–Thursday 6:00 PM – 9:00 PM) — General Availability
                        </option>
                        <option value="Monday & Wednesday Evenings">
                          Monday & Wednesday Evenings
                        </option>
                        <option value="Tuesday & Thursday Evenings">
                          Tuesday & Thursday Evenings
                        </option>
                        <option value="Flexible Weekday Evenings (1–2 days/week)">
                          Flexible Weekday Evenings (1–2 days/week)
                        </option>
                        <option value="Friday Evenings (Friday Night Hoops)">
                          Friday Evenings (Friday Night Hoops)
                        </option>
                      </select>
                      {errors.availability && <p className="text-xs text-red-400 mt-1">{errors.availability}</p>}
                    </div>

                    {/* Why do you want to coach? */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted-light mb-1.5">
                        Why do you want to coach with EcoHoops? <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={4}
                        name="whyCoach"
                        value={formData.whyCoach}
                        onChange={handleChange}
                        placeholder="Tell us a little about your basketball background, why you'd like to work with kids, or what you hope to gain from this experience..."
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
                          <Loader2 size={18} className="animate-spin text-white" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit Volunteer Application</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-eco-muted-light/70 text-center leading-relaxed">
                      By submitting, you agree to allow EcoHoops to contact you regarding volunteer coaching opportunities in accordance with our{' '}
                      <Link to="/privacy" className="underline hover:text-white">
                        Privacy Policy
                      </Link>.
                    </p>
                  </form>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
