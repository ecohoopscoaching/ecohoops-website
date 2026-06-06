import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function CoachAdrian() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-eco-surface2">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="glow-card overflow-hidden rounded-3xl"
          >
            <img src="/images/IMG_0160.JPG" alt="Coach Adrian" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="tag mb-4 inline-block">Meet Coach Adrian</span>
            <h2 className="font-display text-section uppercase tracking-tight mb-6">
              <span className="text-white">A DIFFERENT </span>
              <span className="gradient-text">APPROACH</span>
            </h2>
            <p className="text-eco-muted-light text-lg leading-relaxed mb-6">
              Coach Adrian built EcoHoops because youth sports needed a change. 
              After witnessing the negative impact of win-at-all-costs environments, 
              he created a program that puts kids first. 
            </p>
            <p className="text-eco-muted-light text-lg leading-relaxed mb-8">
              "We're not here to build pros. We're here to build people. Basketball is just the tool."
            </p>
            <Link to="/about" className="btn-ghost inline-flex items-center justify-center">
              Read Our Story
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
