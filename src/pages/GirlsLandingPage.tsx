import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, MapPin, Users, CheckCircle2, ChevronDown, 
  ArrowRight, ShieldCheck, Heart, Sparkles, Award, Lock, Quote, Star, Check
} from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function GirlsLandingPage() {
  useDocumentTitle('Girls Grade 5 & 6 First Rep Basketball Tryouts | EcoHoops Mississauga')

  // Form State
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    playerName: '',
    playerDob: '',
    grade: 'Grade 5 (2016 Birth Year)',
    playedRep: 'No — First Time Trying Rep'
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    const payload = {
      access_key: "933bf5e4-2815-45e1-853f-a58c9fb77a2f",
      subject: "New Girls Rep Tryout Registration!",
      "Parent Name": formData.parentName,
      "Parent Email": formData.parentEmail,
      "Parent Phone": formData.parentPhone,
      "Player Name": formData.playerName,
      "Player DOB": formData.playerDob,
      "Grade / Birth Year": formData.grade,
      "Played Rep Before": formData.playedRep,
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (result.success) {
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead', {
            content_name: 'Girls Rep Tryout Registration',
          })
        }
        setSubmitted(true)
      } else {
        setErrorMessage(result.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Submission error:", error)
      setErrorMessage("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const faqs = [
    {
      q: "Does my daughter need rep experience?",
      a: "Not at all! EcoHoops is specifically designed for first-time rep players. Most girls trying out are transitioning from house league or looking for their very first competitive team. If she is willing to learn, compete, and have fun, she is exactly who we love coaching."
    },
    {
      q: "What if she's nervous about trying out?",
      a: "That is completely normal! We structure our tryouts to feel like a fun, supportive practice rather than a high-stakes exam. There is zero yelling, zero pressure, and coaches greet every player by name so she feels comfortable from the moment she walks in."
    },
    {
      q: "How are teams selected?",
      a: "We evaluate effort, positive attitude, communication, and how players react to learning opportunities during game-like scenarios. We look for players who want to grow, support their teammates, and love playing the game."
    },
    {
      q: "What should she bring to tryouts?",
      a: "Please wear comfortable gym clothes and basketball sneakers. Bring a filled water bottle and a size 28.5 (Size 6) basketball if she has one. (We will also have extra basketballs available)."
    },
    {
      q: "What happens after tryouts?",
      a: "Families receive a personalized follow-up email within 48 hours following tryouts. Every player receives constructive feedback, and selected players receive formal roster invitations with practice and next steps."
    }
  ]

  const scrollToForm = () => {
    const el = document.getElementById('register-form')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-eco-black text-white relative font-body selection:bg-eco-orange selection:text-black pb-16 md:pb-0">
      
      {/* ------------------------------------------------------------- */}
      {/* STICKY MOBILE CTA BAR (Action Booster for Mobile Traffic)      */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-eco-black/95 backdrop-blur-md p-3 border-t border-eco-orange/30 shadow-2xl">
        <button
          onClick={scrollToForm}
          className="btn-glow w-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer !bg-eco-orange text-eco-black shadow-[0_0_20px_rgba(242,122,34,0.4)]"
        >
          Register for Tryouts <ArrowRight size={14} />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MINIMAL DISTRACTION-FREE HEADER (No Nav Links, Single Goal)    */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-eco-black/90 backdrop-blur-md border-b border-white/10 py-3.5 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl tracking-wider uppercase text-white">
              ECO<span className="gradient-text">HOOPS</span>
            </span>
            <span className="hidden sm:inline-block bg-eco-orange/10 border border-eco-orange/30 text-eco-orange text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold">
              Mississauga Girls Rep Tryouts
            </span>
          </div>

          <button
            onClick={scrollToForm}
            className="btn-glow !py-2 !px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            Register Now <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* ============================================================= */}
      {/* 2-COLUMN HERO SECTION (FORM ABOVE THE FOLD FOR HIGH CONVERSION) */}
      {/* ============================================================= */}
      <section className="relative pt-8 pb-16 overflow-hidden">
        {/* Background Action Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/12.png"
            alt="EcoHoops Girls Rep Basketball squad active game play"
            className="w-full h-full object-cover opacity-20 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-eco-black/90 via-eco-black/85 to-eco-black" />
          <div className="absolute inset-0 bg-eco-navy/30 mix-blend-multiply" />
        </div>

        {/* Top Glow */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[350px] bg-eco-blue/15 blur-[140px] pointer-events-none z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* LEFT COLUMN: HEADLINE, SUBHEADLINE & EVENT SUMMARY */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-eco-surface/90 border border-eco-orange/30 text-xs font-mono text-eco-orange shadow-glow-sm"
              >
                <Sparkles size={13} className="animate-pulse" />
                <span>Designed for First-Time Rep Players in Mississauga</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display text-3xl sm:text-5xl lg:text-5xl uppercase tracking-tight leading-[1.1] text-white"
              >
                Looking for the Right First Rep Basketball Team for Your <span className="gradient-text">Daughter?</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-eco-muted-light leading-relaxed font-body"
              >
                EcoHoops helps Grade 5 and 6 girls in Mississauga make the jump from house league to rep basketball in a supportive environment where they build confidence, become smarter on the court, and enjoy learning the game.
              </motion.p>

              {/* Quick Event Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="p-4 rounded-2xl bg-eco-surface/80 border border-eco-blue/20 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-white"
              >
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-eco-blue" />
                  <strong>Sunday, Aug 2, 2026</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-eco-orange" />
                  <strong>3:00 PM – 4:00 PM</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-eco-blue" />
                  Churchill Meadows Community Centre
                </span>
              </motion.div>

              {/* Micro-Trust Signals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-eco-muted"
              >
                <span className="flex items-center gap-1 text-eco-blue">
                  <CheckCircle2 size={13} /> 100% Free Tryouts
                </span>
                <span className="flex items-center gap-1 text-eco-blue">
                  <CheckCircle2 size={13} /> Non-Profit Club
                </span>
                <span className="flex items-center gap-1 text-eco-orange">
                  <CheckCircle2 size={13} /> Grade 5 (2016) & Grade 6 (2015)
                </span>
              </motion.div>

            </div>

            {/* RIGHT COLUMN: REGISTRATION FORM DIRECTLY ABOVE THE FOLD */}
            <div id="register-form" className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="glow-card p-6 sm:p-8 bg-eco-surface/95 border border-eco-orange/40 rounded-3xl shadow-[0_0_40px_rgba(242,122,34,0.2)] relative"
              >
                <div className="mb-5 text-center">
                  <span className="text-[10px] font-mono uppercase text-eco-orange bg-eco-orange/10 border border-eco-orange/30 px-2.5 py-0.5 rounded-full font-bold inline-block mb-1">
                    Free Tryout Registration
                  </span>
                  <h2 className="font-display text-2xl uppercase text-white">
                    RESERVE YOUR DAUGHTER'S SPOT
                  </h2>
                  <p className="text-xs text-eco-muted-light mt-0.5">
                    Takes under 60 seconds • Spots are limited
                  </p>
                </div>

                {submitted ? (
                  <div className="text-center space-y-4 py-6">
                    <div className="w-14 h-14 rounded-full bg-eco-blue/20 border border-eco-blue text-eco-blue flex items-center justify-center mx-auto">
                      <CheckCircle2 size={30} />
                    </div>
                    <h3 className="font-display text-2xl uppercase text-white">Spot Saved!</h3>
                    <p className="text-xs text-eco-muted-light leading-relaxed">
                      Thank you <strong className="text-white">{formData.parentName}</strong>! Tryout details for <strong className="text-white">{formData.playerName}</strong> have been saved.
                    </p>
                    <div className="p-3.5 rounded-xl bg-eco-black/60 border border-white/10 text-[11px] text-eco-blue font-mono space-y-1 text-left">
                      <p>📍 Location: Churchill Meadows Community Centre</p>
                      <p>⏰ Time: Sunday, Aug 2 at 3:00 PM (Check-in 2:45 PM)</p>
                      <p>📩 Instructions sent to <strong>{formData.parentEmail}</strong>.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono text-center">
                        {errorMessage}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-eco-muted-light mb-1">
                        Parent / Guardian Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="w-full bg-eco-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-eco-blue"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-eco-muted-light mb-1">
                          Parent Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="sarah@example.com"
                          value={formData.parentEmail}
                          onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                          className="w-full bg-eco-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-eco-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-eco-muted-light mb-1">
                          Parent Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="(905) 555-0199"
                          value={formData.parentPhone}
                          onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                          className="w-full bg-eco-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-eco-blue"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-eco-muted-light mb-1">
                          Player Name (Daughter) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maya Jenkins"
                          value={formData.playerName}
                          onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                          className="w-full bg-eco-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-eco-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-eco-muted-light mb-1">
                          Player Birthday *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.playerDob}
                          onChange={(e) => setFormData({ ...formData, playerDob: e.target.value })}
                          className="w-full bg-eco-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-eco-blue font-heading font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-eco-muted-light mb-1">
                          Entering Grade *
                        </label>
                        <select
                          value={formData.grade}
                          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                          className="w-full bg-eco-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-eco-blue font-heading font-semibold"
                        >
                          <option>Grade 5 (2016 Birth Year)</option>
                          <option>Grade 6 (2015 Birth Year)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-eco-muted-light mb-1">
                          Played Rep Before? *
                        </label>
                        <select
                          value={formData.playedRep}
                          onChange={(e) => setFormData({ ...formData, playedRep: e.target.value })}
                          className="w-full bg-eco-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-eco-blue font-heading font-semibold"
                        >
                          <option>No — House League / First Time Rep</option>
                          <option>No — Completely New to Organized Team Basketball</option>
                          <option>Yes — Played Rep Basketball Before</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-glow w-full py-3.5 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer !bg-eco-orange text-eco-black hover:!bg-eco-orange/90 shadow-[0_0_25px_rgba(242,122,34,0.35)]"
                      >
                        {loading ? 'Registering...' : 'Register for Tryouts'}
                        <ArrowRight size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-eco-muted font-mono">
                      <Lock size={11} />
                      <span>100% Free Registration • Instant Confirmation</span>
                    </div>

                  </form>
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* AIDA STEP 2: INTEREST (Trust Section & Who This Is For)      */}
      {/* ============================================================= */}

      {/* TRUST SECTION */}
      <section className="py-14 bg-eco-surface/70 border-y border-white/10 relative">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-3">
          <span className="bg-eco-blue/10 border border-eco-blue/20 text-eco-blue text-[11px] font-mono uppercase px-3 py-1 rounded-full font-bold inline-block">
            No Rep Experience Required
          </span>
          <h2 className="font-display text-2xl sm:text-4xl uppercase text-white leading-tight">
            YOUR DAUGHTER DOESN'T NEED REP EXPERIENCE.
          </h2>
          <p className="text-eco-muted-light text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-body">
            If she's willing to learn, compete, and have fun, she's exactly the kind of player we love coaching.
          </p>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="py-20 max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="tag mb-3 inline-block">Target Player Profile</span>
          <h2 className="font-display text-3xl sm:text-4xl uppercase">
            WHO THIS IS <span className="gradient-text">FOR</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-2xl mx-auto mt-2">
            Specifically designed for girls entering <strong className="text-white">Grades 5 and 6</strong> (2016 & 2015 birth years).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Played House League",
              desc: "She has played house league or school basketball and wants more consistent practice and better development.",
              icon: Sparkles,
              color: "#97B3D2"
            },
            {
              title: "Wants to Try Rep Basketball",
              desc: "She loves the game and is ready for a real team environment, but wants a positive coach who builds her up.",
              icon: Award,
              color: "#B0C8E0"
            },
            {
              title: "Looking for Her First Team",
              desc: "She has never played on a formal rep squad before and needs a welcoming team where she won't feel overwhelmed.",
              icon: Users,
              color: "#F0E6D3"
            },
            {
              title: "Wants a Positive Environment",
              desc: "You want a team focused on confidence, teamwork, and actual player development without toxic pressure.",
              icon: Heart,
              color: "#4A7FB5"
            }
          ].map((card, i) => (
            <div key={card.title} className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between">
              <div>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${card.color}15`, border: `1px solid ${card.color}30` }}
                >
                  <card.icon size={22} style={{ color: card.color }} />
                </div>
                <h3 className="font-heading font-bold text-base uppercase text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-eco-blue">
                <Check size={12} /> Ideal Fit
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================= */}
      {/* AIDA STEP 3: DESIRE (Why EcoHoops 5 Cards & Testimonials)    */}
      {/* ============================================================= */}

      {/* WHY ECOHOOPS (5 Plain Language Cards - NO JARGON) */}
      <section className="py-20 bg-eco-surface/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-14">
            <span className="tag mb-3 inline-block">The EcoHoops Difference</span>
            <h2 className="font-display text-3xl sm:text-4xl uppercase">
              WHY PARENTS CHOOSE <span className="gradient-text">ECOHOOPS</span>
            </h2>
            <p className="text-eco-muted-light text-base max-w-2xl mx-auto mt-2">
              We focus on plain-language benefits that deliver a positive, high-growth experience for every girl on the roster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            <div className="glow-card p-7 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-eco-blue font-bold tracking-widest block mb-2">01. REAL TRANSFER</span>
                <h3 className="font-heading font-bold text-lg uppercase text-white mb-3">
                  Practices Look Like Real Games.
                </h3>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  No boring, repetitive cone drills where girls stand in line. Everything we do in practice mirrors actual game situations, so skills and decision-making actually transfer to real games.
                </p>
              </div>
            </div>

            <div className="glow-card p-7 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-eco-orange font-bold tracking-widest block mb-2">02. EQUAL FOCUS</span>
                <h3 className="font-heading font-bold text-lg uppercase text-white mb-3">
                  Every Player Is Involved.
                </h3>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  No second-class status or standing on the sidelines. Every girl receives direct coaching, constant ball touches, and meaningful game opportunities to develop at her own pace.
                </p>
              </div>
            </div>

            <div className="glow-card p-7 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-eco-blue font-bold tracking-widest block mb-2">03. SUPPORTIVE GYM</span>
                <h3 className="font-heading font-bold text-lg uppercase text-white mb-3">
                  We Build Confidence Before Pressure.
                </h3>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  We create a mistake-friendly environment where girls feel safe taking risks, asking questions, and discovering what they are capable of without fear of getting yelled at or benched.
                </p>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="glow-card p-7 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-eco-orange font-bold tracking-widest block mb-2">04. COURT INTELLIGENCE</span>
                <h3 className="font-heading font-bold text-lg uppercase text-white mb-3">
                  Players Learn How to Think, Not Just Follow Instructions.
                </h3>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  We help players become smarter on the court. Instead of forcing girls to memorize rigid plays by rote, we teach them how to read defender spacing, spot opportunities, and solve basketball problems themselves.
                </p>
              </div>
            </div>

            <div className="glow-card p-7 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-eco-blue font-bold tracking-widest block mb-2">05. GROWTH FIRST</span>
                <h3 className="font-heading font-bold text-lg uppercase text-white mb-3">
                  Coaches Focus on Development, Not Just Winning.
                </h3>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  Winning is a byproduct of great player development. Our coaches prioritize individual skill growth, team unity, and instilling a lifelong love of the game above short-term scoreboard pressure.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* HIGHLIGHTED PARENT TESTIMONIAL */}
      <section className="py-20 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="glow-card p-8 md:p-12 bg-gradient-to-r from-eco-surface via-eco-surface2 to-eco-surface border border-eco-orange/30 rounded-3xl relative overflow-hidden text-center shadow-glow-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-eco-orange/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex justify-center gap-1 text-eco-orange mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>

          <Quote size={36} className="text-eco-orange/20 mx-auto mb-4" />

          <p className="font-heading font-semibold text-lg md:text-xl text-white leading-relaxed italic max-w-3xl mx-auto mb-6">
            "Coach Adrian's focus on the mental and physical aspects of the game allowed our daughter to make effective decisions during practice and game time. We have noticed huge improvements with her confidence and decision making on the court. Our daughter and all kids that he works with gravitate to him and his style!"
          </p>

          <div className="space-y-0.5">
            <span className="font-heading font-bold text-white text-sm uppercase tracking-wider block">Meghan R.</span>
            <span className="text-xs text-eco-muted font-mono">Parent of EcoHoops Girls Rep Player</span>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* AIDA STEP 4: ACTION (Tryout Details, FAQs & Final Register)  */}
      {/* ============================================================= */}

      {/* TRYOUT DETAILS */}
      <section className="py-16 bg-eco-surface/50 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <span className="tag mb-2 inline-block">Tryout Information</span>
            <h2 className="font-display text-3xl uppercase text-white">
              TRYOUT DATES & LOCATION
            </h2>
            <p className="text-xs text-eco-muted-light font-mono mt-1">
              Churchill Meadows Community Centre • Open to Grades 5 & 6 Girls
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="glow-card p-6 bg-eco-surface border border-eco-blue/20 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center text-eco-blue flex-shrink-0">
                <Calendar size={22} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-eco-muted block">Date</span>
                <span className="font-heading font-bold text-white text-base">Sunday, August 2, 2026</span>
                <span className="text-xs text-eco-muted-light block mt-0.5">Grade 5 & 6 Girls</span>
              </div>
            </div>

            <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-eco-orange/10 border border-eco-orange/20 flex items-center justify-center text-eco-orange flex-shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-eco-muted block">Session Time</span>
                <span className="font-heading font-bold text-white text-base">3:00 PM – 4:00 PM</span>
                <span className="text-xs text-eco-muted-light block mt-0.5">Check-in starts 2:45 PM</span>
              </div>
            </div>

            <div className="glow-card p-6 bg-eco-surface border border-eco-blue/20 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center text-eco-blue flex-shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-eco-muted block">Location</span>
                <span className="font-heading font-bold text-white text-base">Churchill Meadows</span>
                <span className="text-xs text-eco-muted-light block mt-0.5">Community Centre • Mississauga</span>
              </div>
            </div>

            <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-eco-orange/10 border border-eco-orange/20 flex items-center justify-center text-eco-orange flex-shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-eco-muted block">What To Bring</span>
                <span className="font-heading font-bold text-white text-base">Sneakers & Water</span>
                <span className="text-xs text-eco-muted-light block mt-0.5">Size 28.5 ball (if available)</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="tag mb-3 inline-block">Parent Questions</span>
          <h2 className="font-display text-3xl uppercase text-white">
            FREQUENTLY ASKED <span className="gradient-text">QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="glow-card bg-eco-surface border border-eco-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-6 text-left font-heading font-bold text-base text-white flex items-center justify-between gap-4 uppercase tracking-wide cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-eco-blue transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 text-sm text-eco-muted-light leading-relaxed border-t border-white/5 pt-4 font-body">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-b from-eco-surface to-eco-black border-t border-eco-orange/30 text-center relative">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 space-y-6">
          <span className="tag inline-block bg-eco-orange/10 border-eco-orange/30 text-eco-orange font-bold">
            Free Tryout Registration
          </span>
          <h2 className="font-display text-3xl sm:text-5xl uppercase text-white leading-tight">
            GIVE YOUR DAUGHTER A GREAT FIRST REP BASKETBALL EXPERIENCE.
          </h2>
          <p className="text-eco-muted-light text-base max-w-xl mx-auto font-body">
            Tryouts are Sunday, August 2 at Churchill Meadows Community Centre. Spots are capped for personalized coaching focus.
          </p>
          <div>
            <button
              onClick={scrollToForm}
              className="btn-glow !px-10 !py-5 text-base sm:text-lg font-bold uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer mx-auto !bg-eco-orange text-eco-black hover:!bg-eco-orange/90 shadow-[0_0_35px_rgba(242,122,34,0.4)]"
            >
              Register for Tryouts Now
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* MINIMAL FOOTER (NO DISTRACTING NAV LINKS) */}
      <footer className="py-8 bg-eco-black border-t border-white/10 text-center text-xs text-eco-muted font-mono">
        <div className="max-w-7xl mx-auto px-6">
          <p>© 2026 EcoHoops Basketball Canada. Federal Non-Profit Organization.</p>
          <p className="mt-1 text-[11px] text-eco-muted-light">Designed for first-time rep players entering Grades 5 & 6 in Mississauga.</p>
        </div>
      </footer>

    </div>
  )
}
