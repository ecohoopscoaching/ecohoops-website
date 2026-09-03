import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  User, Mail, Phone, Calendar, Users, Shield, ChevronRight,
  Check, AlertCircle, CreditCard, FileText, Loader2,
} from 'lucide-react'

type Step = 1 | 2 | 3 | 4 | 5

const PROGRAMS = [
  { id: 'jr-nba', name: 'EcoHoops Junior — Jr. NBA / Jr. WNBA (Ages 5–11 • 5–6 Co-Ed, 7–9 & 10–11)', price: 249, spots: 'Waitlist Open', billing: '10 weeks, gear kit included' },
  { id: 'rep-boys', name: 'Rep Team — U16 Boys (OBA + Coalition League)', price: 1950, spots: 'Open', billing: 'per season + HST' },
  { id: 'rep-girls', name: 'Rep Team — U15 Girls (OBA + Coalition League)', price: 1950, spots: 'Open', billing: 'per season + HST' },
  { id: 'friday-hoops', name: 'Friday Night Hoops', price: 0, spots: 'Free — Open to all', billing: '' },
  { id: 'skills', name: 'Skills Development Program', price: 149, spots: '1 session per week', billing: 'per month + HST' },
]

export default function Register() {
  useDocumentTitle('Join the Movement')
  const [regType, setRegType] = useState<'rep' | 'other'>('rep')
  const [step, setStep] = useState<Step>(1)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mountIframe, setMountIframe] = useState(false)
  const [iframeLoading, setIframeLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    medicalNotes: '',
    parentName: '',
    relationship: 'Parent',
    email: '',
    phone: '',
    agreedToWaiver: false,
    paymentMethod: 'Credit / Debit Card'
  })

  const { ref, isVisible } = useScrollReveal(0.05)

  // Lazy-mount iframe after a tiny delay to yield the main thread for low INP during navigation
  useEffect(() => {
    if (regType === 'rep') {
      const timer = setTimeout(() => {
        setMountIframe(true)
      }, 150)
      return () => clearTimeout(timer)
    } else {
      setMountIframe(false)
      setIframeLoading(true)
    }
  }, [regType])

  // Safety timeout: If iframe doesn't finish loading in 3.5s, clear loading state
  useEffect(() => {
    if (mountIframe && iframeLoading) {
      const timer = setTimeout(() => {
        setIframeLoading(false)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [mountIframe, iframeLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const payload = {
      access_key: "933bf5e4-2815-45e1-853f-a58c9fb77a2f",
      subject: "New EcoHoops Registration!",
      Program: PROGRAMS.find(p => p.id === selectedProgram)?.name || 'Unknown',
      "First Name": formData.firstName,
      "Last Name": formData.lastName,
      "Date of Birth": formData.dob,
      "Medical Notes": formData.medicalNotes,
      "Parent Name": formData.parentName,
      Relationship: formData.relationship,
      Email: formData.email,
      Phone: formData.phone,
      "Payment Method": formData.paymentMethod,
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'CompleteRegistration', {
            content_name: PROGRAMS.find(p => p.id === selectedProgram)?.name || 'EcoHoops Registration',
            currency: 'CAD',
            value: PROGRAMS.find(p => p.id === selectedProgram)?.price || 0,
          });
        }
        setStep(5)
      } else {
        alert("Something went wrong. Please try again.")
      }
    } catch (error) {
      alert("Error submitting form. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { num: 1, label: 'Program' },
    { num: 2, label: 'Player Info' },
    { num: 3, label: 'Parent/Guardian' },
    { num: 4, label: 'Review & Pay' },
  ]

  return (
    <section ref={ref} className="pt-28 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <span className="tag mb-4 inline-block">Join Us</span>
          <h1 className="font-display text-section uppercase mb-4">
            <span className="gradient-text">REGISTER</span>
          </h1>
          <p className="text-eco-muted-light text-lg">
            Accessible programming for all Mississauga youth. Play. Learn. Grow.
          </p>
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-4 mb-10"
        >
          <button
            onClick={() => setRegType('rep')}
            className={`flex-1 py-3.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
              regType === 'rep'
                ? 'bg-eco-orange text-white shadow-glow-sm'
                : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-orange/30'
            }`}
          >
            Rep Teams (Google Form)
          </button>
          <button
            onClick={() => setRegType('other')}
            className={`flex-1 py-3.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
              regType === 'other'
                ? 'bg-eco-orange text-white shadow-glow-sm'
                : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-orange/30'
            }`}
          >
            Recreational & Camps
          </button>
        </motion.div>

        {regType === 'rep' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glow-card overflow-hidden max-w-2xl mx-auto"
          >
            <div className="p-4 bg-eco-surface2 border-b border-eco-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-bold text-white">EcoHoops Rep Team Application</h3>
                <p className="text-xs text-eco-muted">Submit your application below</p>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-eco-orange/10 border border-eco-orange/30 text-eco-orange font-bold">
                Google Form
              </span>
            </div>
            
            <div className="relative w-full h-[500px] bg-white overflow-hidden rounded-b-xl">
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-eco-dark/95 z-20 p-6 text-center">
                  <Loader2 className="animate-spin text-eco-blue mb-3" size={32} />
                  <span className="font-heading text-xs uppercase tracking-widest text-eco-muted">Loading Application Form...</span>
                  <p className="text-xs text-eco-muted mt-6 max-w-sm">
                    Taking too long? You can also{' '}
                    <a 
                      href="https://docs.google.com/forms/d/e/1FAIpQLSe5VRmXBfBeQ0qy_Vw6ZQviioSxlC1C1UgbXVXeq15GbaxI6g/viewform" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-eco-blue hover:underline font-bold"
                    >
                      open the Google Form directly
                    </a>
                    .
                  </p>
                </div>
              )}

              {mountIframe ? (
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSe5VRmXBfBeQ0qy_Vw6ZQviioSxlC1C1UgbXVXeq15GbaxI6g/viewform?embedded=true"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  onLoad={() => setIframeLoading(false)}
                  title="Rep Registrations Google Form"
                  className="w-full h-full"
                >
                  Loading…
                </iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-eco-dark/95">
                  <Loader2 className="animate-spin text-eco-blue mb-2" size={24} />
                  <span className="font-heading text-xs uppercase tracking-widest text-eco-muted ml-2">Preparing Form...</span>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <>
            {/* Step Indicator */}
            {step < 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center justify-between mb-12"
              >
                {steps.map((s, i) => (
                  <div key={s.num} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm transition-all duration-300 ${
                          step >= s.num
                            ? 'bg-eco-orange text-white'
                            : 'bg-eco-surface border border-eco-border text-eco-muted'
                        }`}
                      >
                        {step > s.num ? <Check size={16} /> : s.num}
                      </div>
                      <span className="text-xs text-eco-muted mt-2 hidden sm:block">{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-12 sm:w-24 h-px mx-2 transition-colors duration-300 ${
                        step > s.num ? 'bg-eco-orange' : 'bg-eco-border'
                      }`} />
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Form Steps */}
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-xl text-white mb-6">Choose a Program</h3>
                  {PROGRAMS.map((prog) => (
                    <button
                      key={prog.id}
                      onClick={() => setSelectedProgram(prog.id)}
                      className={`w-full glow-card p-5 text-left transition-all duration-300 ${
                        selectedProgram === prog.id
                          ? 'border-eco-orange/50 shadow-glow-sm'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-heading font-bold text-white">{prog.name}</h4>
                          <p className="text-sm text-eco-muted mt-1">{prog.spots}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-2xl gradient-text">
                            {prog.price === 0 ? 'FREE' : `$${prog.price}`}
                          </p>
                          {prog.price > 0 && (
                            <p className="text-xs text-eco-muted">{prog.billing}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => selectedProgram && setStep(2)}
                    disabled={!selectedProgram}
                    className={`w-full mt-6 btn-glow flex items-center justify-center gap-2 ${
                      !selectedProgram ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="font-heading font-bold text-xl text-white mb-6">Player Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-eco-muted uppercase tracking-wider mb-2 block">First Name</label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-eco-muted" />
                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="input-field !pl-11" placeholder="First name" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-eco-muted uppercase tracking-wider mb-2 block">Last Name</label>
                      <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="input-field" placeholder="Last name" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-eco-muted uppercase tracking-wider mb-2 block">Date of Birth</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-eco-muted" />
                      <input name="dob" value={formData.dob} onChange={handleInputChange} type="date" className="input-field !pl-11" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-eco-muted uppercase tracking-wider mb-2 block text-white">Medical Notes <span className="text-eco-orange">*</span></label>
                    <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleInputChange} className="input-field min-h-[100px] resize-none" placeholder="Allergies, injuries, or type 'None' if not applicable..." required />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-ghost flex-1">Back</button>
                    <button onClick={() => setStep(3)} className="btn-glow flex-1 flex items-center justify-center gap-2">
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="font-heading font-bold text-xl text-white mb-6">Parent / Guardian</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-eco-muted uppercase tracking-wider mb-2 block">Full Name</label>
                      <div className="relative">
                        <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-eco-muted" />
                        <input name="parentName" value={formData.parentName} onChange={handleInputChange} className="input-field !pl-11" placeholder="Parent/Guardian name" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-eco-muted uppercase tracking-wider mb-2 block">Relationship</label>
                      <select name="relationship" value={formData.relationship} onChange={handleInputChange} className="input-field">
                        <option>Parent</option>
                        <option>Guardian</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-eco-muted uppercase tracking-wider mb-2 block">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-eco-muted" />
                      <input name="email" value={formData.email} onChange={handleInputChange} type="email" className="input-field !pl-11" placeholder="email@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-eco-muted uppercase tracking-wider mb-2 block">Phone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-eco-muted" />
                      <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="input-field !pl-11" placeholder="(416) 555-0123" />
                    </div>
                  </div>
                  <div className="glow-card p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input name="agreedToWaiver" checked={formData.agreedToWaiver} onChange={handleInputChange} type="checkbox" className="mt-1 accent-eco-orange" />
                      <span className="text-sm text-eco-muted-light">
                        I agree to the EcoHoops{' '}
                        <span className="text-eco-orange hover-underline cursor-pointer">Waiver & Code of Conduct</span>.
                        I understand the EcoHoops philosophy and commit to supporting a positive, growth-focused environment.
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-ghost flex-1">Back</button>
                    <button 
                      onClick={() => setStep(4)} 
                      disabled={!formData.agreedToWaiver}
                      className={`btn-glow flex-1 flex items-center justify-center gap-2 ${!formData.agreedToWaiver ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Review <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="font-heading font-bold text-xl text-white mb-6">Review & Payment</h3>

                  <div className="glow-card p-6 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-eco-border">
                      <span className="text-eco-muted">Program</span>
                      <span className="font-heading font-bold text-white">
                        {PROGRAMS.find(p => p.id === selectedProgram)?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-eco-border">
                      <span className="text-eco-muted">
                        {selectedProgram === 'skills' ? 'Monthly Fee' : 'Program Fee'}
                      </span>
                      <span className="font-display text-2xl gradient-text">
                        ${PROGRAMS.find(p => p.id === selectedProgram)?.price || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-eco-muted-light">
                      <AlertCircle size={14} className="text-eco-blue-light" />
                      Payment plans available. Contact us for details.
                    </div>
                  </div>

                  <div className="glow-card p-6">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-eco-orange mb-4 flex items-center gap-2">
                      <CreditCard size={14} />
                      Payment Method
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-eco-border hover:border-eco-orange/30 cursor-pointer transition-colors">
                        <input type="radio" name="paymentMethod" value="Credit / Debit Card" checked={formData.paymentMethod === 'Credit / Debit Card'} onChange={handleInputChange} className="accent-eco-orange" />
                        <CreditCard size={16} className="text-eco-muted" />
                        <span className="text-sm text-white">Credit / Debit Card</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-xl border border-eco-border hover:border-eco-orange/30 cursor-pointer transition-colors">
                        <input type="radio" name="paymentMethod" value="E-Transfer" checked={formData.paymentMethod === 'E-Transfer'} onChange={handleInputChange} className="accent-eco-orange" />
                        <FileText size={16} className="text-eco-muted" />
                        <span className="text-sm text-white">E-Transfer</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(3)} disabled={isSubmitting} className={`btn-ghost flex-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>Back</button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className={`btn-glow flex-1 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {isSubmitting ? 'Processing...' : 'Complete Registration'} <Check size={16} />
                    </button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="text-center py-16 space-y-6">
                  <div className="w-20 h-20 bg-eco-orange/20 rounded-full flex items-center justify-center mx-auto text-eco-orange mb-6 shadow-glow-sm">
                    <Check size={40} />
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl text-white uppercase gradient-text">Registration Complete!</h3>
                  <p className="text-eco-muted-light text-lg max-w-md mx-auto">
                    Thank you for applying to EcoHoops! We've successfully received your information. A confirmation email has been sent, and we'll be in touch with next steps shortly.
                  </p>
                  <button 
                    onClick={() => { 
                      setStep(1); 
                      setSelectedProgram(null); 
                      setFormData({
                        firstName: '', lastName: '', dob: '', medicalNotes: '',
                        parentName: '', relationship: 'Parent', email: '', phone: '',
                        agreedToWaiver: false, paymentMethod: 'Credit / Debit Card'
                      })
                    }} 
                    className="btn-glow mt-8 inline-block px-8 py-3"
                  >
                    Register Another Player
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
