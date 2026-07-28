import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface TryoutsBannerProps {
  onRegisterClick?: () => void
}

export default function TryoutsBanner({ onRegisterClick }: TryoutsBannerProps) {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} id="tryouts" className="relative py-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-eco-navy/40 via-eco-navy/20 to-transparent" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-eco-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glow-card p-8 md:p-12 border-eco-orange/20 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #090e1a, #0d1627)',
          }}
        >
          {/* Subtle background team image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/hero-bg-new-2.jpg" 
              alt="U15 Boys Team" 
              className="w-full h-full object-cover opacity-[0.08] mix-blend-luminosity contrast-125 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090e1a]/95 via-[#090e1a]/70 to-[#0d1627]/95" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-heading font-bold bg-eco-orange/10 text-eco-orange border border-eco-orange/30 uppercase tracking-widest">
                <Calendar size={13} className="animate-pulse" />
                Upcoming August Rep Tryouts • Mississauga
              </div>
              
              {/* Hook */}
              <h2 className="font-display text-2xl md:text-4xl uppercase text-white leading-tight">
                Your kid practices every week. <span className="text-eco-orange">When the game gets fast, do they freeze?</span>
              </h2>

              {/* Outcome + Mechanism */}
              <p className="text-eco-muted-light text-base md:text-lg max-w-2xl leading-relaxed">
                EcoHoops builds players who stay calm, read the court, and figure it out on their own. Our practices look like real games so learning transfers when it counts most.
              </p>

              {/* Proof + Details */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-mono text-eco-blue">
                <span className="bg-eco-surface/80 border border-eco-blue/20 px-3 py-1.5 rounded-lg text-white font-heading font-semibold">
                  📅 August 1 & August 8
                </span>
                <span className="bg-eco-surface/80 border border-eco-blue/20 px-3 py-1.5 rounded-lg text-white font-heading font-semibold">
                  🏀 Grades 5/6, 7/8, 9/10
                </span>
                <span className="bg-eco-surface/80 border border-eco-blue/20 px-3 py-1.5 rounded-lg text-eco-muted-light font-heading">
                  📍 Mississauga, ON
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 w-full lg:w-auto flex flex-col items-center lg:items-end gap-2">
              <button
                onClick={onRegisterClick}
                className="btn-glow !px-8 !py-4 text-sm flex items-center gap-2 cursor-pointer font-bold uppercase tracking-widest text-eco-black shadow-[0_0_20px_rgba(242,122,34,0.3)] !bg-eco-orange hover:!bg-eco-orange/90 w-full sm:w-auto justify-center"
              >
                Register for Tryouts
                <ArrowRight size={16} />
              </button>
              <span className="text-[11px] text-eco-muted-light font-mono">Limited spots per age group</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
