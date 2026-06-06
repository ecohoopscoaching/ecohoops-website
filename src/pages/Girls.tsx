import AllGirlsProgram from '../components/home/AllGirlsProgram'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Girls() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <>
      <section ref={ref} className="pt-28 pb-10 min-h-screen bg-eco-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="tag mb-4 inline-block">All Girls</span>
            <h1 className="font-display text-section uppercase tracking-tight mb-6">
              <span className="text-white">OUR </span>
              <span className="gradient-text">GIRLS PROGRAM</span>
            </h1>
            <p className="text-eco-muted-light text-lg max-w-2xl mx-auto">
              Empowering the next generation of female athletes through basketball.
            </p>
          </motion.div>
        </div>
        <AllGirlsProgram />
      </section>
    </>
  )
}
