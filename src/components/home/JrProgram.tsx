import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { ArrowRight } from 'lucide-react'

export default function JrProgram() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-eco-navy/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Official Brand Lockup */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="bg-[#050B14]/80 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 inline-flex items-center gap-4 sm:gap-6 shadow-xl">
              <img
                src="/images/branding/jr-nba-wnba-dark.png"
                alt="Jr. NBA & Jr. WNBA"
                className="h-8 sm:h-10 w-auto object-contain"
              />
              <div className="h-6 w-px bg-white/15" />
              <img
                src="/images/branding/canada-basketball-vertical-red.png"
                alt="Canada Basketball"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </div>
          </div>

          <span className="tag mb-4 inline-block">EcoHoops Jr. • Ages 5–6 (Co-Ed), Ages 7–9 & 10–11</span>
          <h2 className="font-display text-section uppercase tracking-tight mb-6">
            <span className="text-white">WHERE KIDS FALL IN LOVE </span>
            <span className="gradient-text">WITH BASKETBALL.</span>
          </h2>
          <p className="text-eco-muted-light text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Ages 5–11 across three divisions: Ages 5–6 (co-ed), Ages 7–9 (separate girls’ and boys’ groups), and Ages 10–11 (separate girls’ and boys’ groups). Groups will run based on registration numbers. Official Jr. NBA/WNBA gear kit and Canada Basketball membership included.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/jr" className="btn-glow inline-flex items-center justify-center gap-2">
              Explore EcoHoops Jr.
              <ArrowRight size={16} />
            </Link>
            <a
              href="/#jr-nba-waitlist"
              className="btn-ghost inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              Join the Waitlist
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
