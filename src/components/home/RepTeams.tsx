import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { ArrowRight } from 'lucide-react'

export default function RepTeams() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-eco-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="tag mb-4 inline-block">Rep Teams</span>
          <h2 className="font-display text-section uppercase tracking-tight mb-6">
            <span className="text-white">COMPETITIVE BASKETBALL. </span>
            <br />
            <span className="gradient-text">KIDS FIRST. ALWAYS.</span>
          </h2>
          <p className="text-eco-muted-light text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            High-performance training without the toxic culture.
          </p>
          <Link to="/rep" className="btn-glow inline-flex items-center justify-center gap-2">
            Explore Rep Teams
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
