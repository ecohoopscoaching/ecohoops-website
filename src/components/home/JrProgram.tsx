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
          <span className="tag mb-4 inline-block">EcoHoops Jr.</span>
          <h2 className="font-display text-section uppercase tracking-tight mb-6">
            <span className="text-white">WHERE KIDS FALL IN LOVE </span>
            <span className="gradient-text">WITH BASKETBALL.</span>
          </h2>
          <p className="text-eco-muted-light text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Ages 5-10. Our grassroots program designed to build foundational skills through play.
          </p>
          <Link to="/jr" className="btn-glow inline-flex items-center justify-center gap-2">
            Explore EcoHoops Jr.
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
