import { motion } from 'framer-motion'
import { useScrollReveal, useMouseGlow } from '../hooks/useScrollReveal'
import { ShieldCheck, Users, HeartHandshake, DollarSign, AlertCircle, ExternalLink } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function SafeSport() {
  useDocumentTitle('Safe Sport & Financial Aid')
  
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal(0.05)
  const { ref: rulesRef, isVisible: rulesVisible } = useScrollReveal(0.1)
  const { ref: financialRef, isVisible: financialVisible } = useScrollReveal(0.1)

  // Use mouse glow hooks for interactive cards
  const reportGlowRef = useMouseGlow()
  const ruleGlowRef = useMouseGlow()
  const jumpstartGlowRef = useMouseGlow()
  const kidsportGlowRef = useMouseGlow()

  return (
    <div className="pt-28 pb-20 overflow-hidden relative min-h-screen">
      {/* Background ambient glows */}
      <div className="absolute top-12 left-1/4 w-[600px] h-[600px] rounded-full bg-eco-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] rounded-full bg-eco-navy/10 blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8 relative z-10"
          >
            <span className="tag mb-4 inline-block">Athlete Safety & Support</span>
            <h1 className="font-display text-5xl md:text-7xl uppercase mb-6 leading-[0.9] tracking-[0.04em]">
              <span className="text-white">SAFE SPORT & </span>
              <br />
              <span className="gradient-text">FINANCIAL AID</span>
            </h1>
            <p className="text-xl text-eco-muted-light max-w-2xl leading-relaxed">
              EcoHoops is dedicated to a safe, clean, and fair basketball environment for everyone. 
              We ensure our athletes are protected, our environment is positive, and our programs are accessible to all families.
            </p>

            <div className="mt-6 inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
              <img
                src="/images/branding/canada-basketball-dark-horizontal-tight.png"
                alt="Canada Basketball Safe Sport"
                className="h-6 w-auto object-contain opacity-95"
              />
              <div className="h-5 w-px bg-white/15" />
              <span className="text-[11px] font-mono text-[#97B3D2] uppercase tracking-wider font-semibold">
                Canada Basketball & Responsible Coaching Standards
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 flex justify-center"
          >
            <div className="p-8 rounded-3xl bg-eco-blue/10 border border-eco-blue/20 relative group overflow-hidden max-w-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-eco-blue/20 rounded-full blur-2xl group-hover:scale-155 transition-transform duration-500" />
              <ShieldCheck className="text-eco-blue h-16 w-16 mb-6 relative z-10" strokeWidth={1.5} />
              <h3 className="font-heading text-xl font-bold text-white mb-2 relative z-10">Our Commitment</h3>
              <p className="text-sm text-eco-muted-light leading-relaxed relative z-10">
                We believe that sport should be psychologically and physically safe. We maintain a zero-tolerance policy for maltreatment, toxic coaching, and harassment.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto px-6 lg:px-8 mb-20" />

      {/* Safe Sport Sections */}
      <section ref={rulesRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={rulesVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="tag mb-4 inline-block">Policies & Standards</span>
          <h2 className="font-display text-4xl uppercase text-white">PROTECTING OUR ATHLETES</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Canadian Sport Helpline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={rulesVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            ref={reportGlowRef}
            className="glow-card p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <AlertCircle className="text-eco-orange h-10 w-10" />
                <span className="text-[10px] font-mono text-eco-orange border border-eco-orange/20 bg-eco-orange/10 px-2 py-0.5 rounded uppercase">Canadian Sport Helpline</span>
              </div>
              <h3 className="font-display text-2xl uppercase text-white mb-4">Report Maltreatment</h3>
              <p className="text-eco-muted-light leading-relaxed mb-4">
                If you need to report any sports misconduct, abuse, or behavior that violates safety standards, you can contact the Canadian Sport Helpline (Abuse-Free Sport) directly. They provide a free, confidential, and independent system to ensure accountability and safety.
              </p>
              <div className="bg-eco-black/50 border border-white/10 rounded-xl p-4 text-xs text-eco-muted-light font-mono space-y-1.5 mb-6">
                <p><span className="text-eco-blue">Phone / Text:</span> <strong className="text-white">1-888-83-SPORT (1-888-837-7678)</strong></p>
                <p><span className="text-eco-blue">Email:</span> <strong className="text-white">info@abuse-free-sport.ca</strong></p>
                <p><span className="text-eco-blue">Hours:</span> <strong className="text-white">8 AM – 8 PM ET (7 Days/Week)</strong></p>
              </div>
            </div>
            <a
              href="https://www.abuse-free-sport.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center justify-center gap-2 w-full text-center text-eco-black font-bold"
            >
              Visit Abuse-Free Sport Website <ExternalLink size={14} />
            </a>
          </motion.div>

          {/* Rule of Two */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={rulesVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            ref={ruleGlowRef}
            className="glow-card p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <Users className="text-[#97B3D2] h-10 w-10" />
                <span className="text-[10px] font-mono text-[#97B3D2] border border-[#97B3D2]/20 bg-[#97B3D2]/10 px-2 py-0.5 rounded uppercase">CAC Policy</span>
              </div>
              <h3 className="font-display text-2xl uppercase text-white mb-4">The Rule of Two</h3>
              <p className="text-eco-muted-light leading-relaxed mb-6">
                We strictly adhere to the **Rule of Two** to ensure the protection of both athletes and coaches. This policy mandates that a coach is never left alone with a single player. All interactions must have another screened coach or parent present to maintain transparency and safety.
              </p>
            </div>
            <a
              href="https://coach.ca/sport-safety/responsible-coaching-movement/rule-two"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center justify-center gap-2 w-full text-center"
            >
              Learn More about the Rule <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto px-6 lg:px-8 mb-20" />

      {/* Financial Aid Sections */}
      <section ref={financialRef} className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={financialVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="tag mb-4 inline-block">External Resources</span>
          <h2 className="font-display text-4xl uppercase text-white">FINANCIAL GRANTS & RESOURCES</h2>
          <p className="text-eco-muted-light max-w-2xl mx-auto mt-4 leading-relaxed">
            While EcoHoops is an independent organization, we encourage families seeking tuition assistance to explore these external national and provincial grant resources.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Jumpstart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={financialVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            ref={jumpstartGlowRef}
            className="glow-card p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-eco-blue/10 flex items-center justify-center border border-eco-blue/20">
                  <DollarSign className="text-eco-blue h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-white">Canadian Tire Jumpstart</h4>
                  <span className="text-[10px] font-mono text-eco-muted uppercase">External Parent Resource</span>
                </div>
              </div>
              <p className="text-eco-muted-light leading-relaxed mb-6">
                Jumpstart is an independent national charity committed to giving all kids the chance to be active. Parents can apply directly for individual grants to assist with sports registration, gear, and transportation costs.
              </p>
            </div>
            <a
              href="https://jumpstart.canadiantire.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center justify-center gap-2 w-full text-center text-eco-black font-bold"
            >
              Explore Jumpstart Grants <ExternalLink size={14} />
            </a>
          </motion.div>

          {/* KidSport */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={financialVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            ref={kidsportGlowRef}
            className="glow-card p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#97B3D2]/10 flex items-center justify-center border border-[#97B3D2]/20">
                  <HeartHandshake className="text-[#97B3D2] h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-white">KidSport Ontario</h4>
                  <span className="text-[10px] font-mono text-eco-muted uppercase">External Parent Resource</span>
                </div>
              </div>
              <p className="text-eco-muted-light leading-relaxed mb-6">
                KidSport is an independent provincial program providing grants to help families cover sports registration fees so children aged 18 and under in Ontario can participate in season-long activities.
              </p>
            </div>
            <a
              href="https://kidsportcanada.ca/ontario/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center justify-center gap-2 w-full text-center"
            >
              Explore KidSport Ontario <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
