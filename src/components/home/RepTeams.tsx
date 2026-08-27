import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { ArrowRight, Trophy, ShieldCheck, Users, Calendar } from 'lucide-react'

export default function RepTeams() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden bg-[#0B1120] border-t border-b border-eco-border">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#003366]/20 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="tag !bg-[#003366]/80 !border-[#97B3D2]/40 !text-[#97B3D2]">
              2026–27 REP TEAMS
            </span>
            <span className="tag !bg-eco-blue/15 !border-eco-blue/30 !text-white">
              OBA AFFILIATE & COALITION LEAGUE
            </span>
          </div>
          
          <h2 className="font-display text-section uppercase tracking-tight mb-6">
            <span className="text-white">COMPETITIVE SQUADS. </span>
            <br />
            <span className="gradient-text">KIDS FIRST. ALWAYS.</span>
          </h2>
          <p className="text-eco-muted-light text-lg leading-relaxed max-w-2xl mx-auto">
            High-performance development without toxic pressure. EcoHoops field competitive teams in Ontario Basketball (OBA) and the Coalition Basketball League.
          </p>
        </motion.div>

        {/* 2 Active Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* U16 Boys */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glow-card p-8 bg-[#0F1628]/90 border border-eco-blue/20 rounded-3xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-display text-white font-bold">U16 BOYS</span>
                <span className="text-xs font-mono uppercase text-[#97B3D2] bg-[#003366]/50 px-3 py-1 rounded-full border border-[#97B3D2]/30">
                  2011 Born
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-3 uppercase tracking-wide">
                Varsity Prep & High-Level Competition
              </h3>
              <ul className="space-y-2 text-xs text-eco-muted-light font-body mb-6">
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-eco-blue" />
                  <span>12 OBL/OBA Games + 12 Coalition Games</span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar size={14} className="text-eco-blue" />
                  <span>Practices: Twice per week (2 hours each)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Trophy size={14} className="text-eco-blue" />
                  <span>1-2 Showcase Tournaments included</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-eco-muted font-mono uppercase">Tuition: $1,950 + HST</span>
              <span className="text-[#97B3D2] font-semibold">Installments Available</span>
            </div>
          </motion.div>

          {/* U15 Girls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glow-card p-8 bg-[#0F1628]/90 border border-eco-blue/20 rounded-3xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-display text-white font-bold">U15 GIRLS</span>
                <span className="text-xs font-mono uppercase text-[#97B3D2] bg-[#003366]/50 px-3 py-1 rounded-full border border-[#97B3D2]/30">
                  2012 Born
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-3 uppercase tracking-wide">
                First Rep Team Experience & Player Growth
              </h3>
              <ul className="space-y-2 text-xs text-eco-muted-light font-body mb-6">
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-eco-blue" />
                  <span>12 OBL/OBA Games + 12 Coalition Games</span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar size={14} className="text-eco-blue" />
                  <span>Practices: Twice per week (2 hours each)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users size={14} className="text-eco-blue" />
                  <span>Equal care, resources & supportive culture</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-eco-muted font-mono uppercase">Tuition: $1,950 + HST</span>
              <span className="text-[#97B3D2] font-semibold">Installments Available</span>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/rep" className="btn-glow inline-flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-bold">
            Explore All Rep Details & Tryouts
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
