import { motion } from 'framer-motion'
import { ShieldCheck, HeartHandshake, AlertCircle, ArrowRight, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useScrollReveal, useMouseGlow } from '../../hooks/useScrollReveal'

export default function SafeSportBanner() {
  const { ref, isVisible } = useScrollReveal(0.1)
  const glowRef = useMouseGlow()

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8 my-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        ref={glowRef}
        className="glow-card p-8 md:p-12 relative overflow-hidden border border-eco-blue/30 bg-gradient-to-br from-eco-surface via-eco-surface/90 to-eco-blue/10"
      >
        {/* Background glow circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-eco-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-blue/15 border border-eco-blue/30 text-eco-blue text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>Athlete Safety & Community Care</span>
            </div>
            
            <h2 className="font-display text-3xl md:text-5xl uppercase text-white leading-tight">
              SAFE SPORT CERTIFIED & <span className="gradient-text">FINANCIAL AID FOR ALL</span>
            </h2>

            <p className="text-eco-muted-light text-base md:text-lg leading-relaxed max-w-3xl">
              EcoHoops adheres to Canada's Responsible Coaching Movement (Rule of Two) and Abuse-Free Sport helpline reporting. For families seeking tuition support, independent community grants like Jumpstart and KidSport are great external resources for parents to explore.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-3 bg-eco-black/40 border border-white/5 rounded-xl p-3">
                <ShieldCheck className="text-eco-blue h-6 w-6 flex-shrink-0" />
                <span className="text-xs text-white font-medium">Rule of Two Protection</span>
              </div>
              <div className="flex items-center gap-3 bg-eco-black/40 border border-white/5 rounded-xl p-3">
                <AlertCircle className="text-eco-orange h-6 w-6 flex-shrink-0" />
                <span className="text-xs text-white font-medium">Abuse-Free Sport Helpline</span>
              </div>
              <div className="flex items-center gap-3 bg-eco-black/40 border border-white/5 rounded-xl p-3">
                <DollarSign className="text-emerald-400 h-6 w-6 flex-shrink-0" />
                <span className="text-xs text-white font-medium">Jumpstart & KidSport Resources</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
            <Link
              to="/safe-sport"
              className="btn-glow py-4 px-6 text-center text-eco-black font-bold uppercase tracking-wider flex items-center justify-center gap-2 w-full"
            >
              <HeartHandshake size={18} /> View Safe Sport & Aid Policy <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
